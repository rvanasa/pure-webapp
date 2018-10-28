'use strict'

var EventEmitter = require('events');

function randomString()
{
	return Math.random().toString(36).substring(2, 15);
}

var storageProps = ['paths', 'undos'/*, 'remotes'*/];

class Whiteboard extends EventEmitter
{
	constructor(context, options = {})
	{
		super();
		
		this.context = context;
		this.options = options;
		
		this.cursor = options.cursor || {};
		this.width = options.width || 854;
		this.height = options.height || 480;
		
		this.storage = options.storage || window.sessionStorage;
		this.storageKey = options.storageKey || 'whiteboard';
		
		this.paths = [];
		this.undos = [];
		this.remotes = {};
		
		this.on('add', path => this.change({add: [path]}));
		this.on('remove', path => this.change({remove: [path.id]}));
		this.on('clear', () => this.change({clear: true}));
		
		this.load();
	}
	
	load(key)
	{
		if(this.storage)
		{
			var data = typeof key === 'object' ? key : JSON.parse(this.storage[key || this.storageKey] || 'null');
			if(data)
			{
				Object.assign(this, data);
				this.redraw();
			}
		}
	}
	
	save(key)
	{
		if(this.storage)
		{
			var data = {};
			for(var i = 0; i < storageProps.length; i++)
			{
				var prop = storageProps[i];
				data[prop] = this[prop];
			}
			this.storage[key || this.storageKey] = JSON.stringify(data);
		}
	}
	
	add(path, user)
	{
		this.drawPath(path, user);
		if(path.id)
		{
			this.remove(path.id, user, true);
		}
		
		if(!user)
		{
			this.paths.push(path);
		}
		else
		{
			(this.remotes[user] || (this.remotes[user] = [])).push(path);
		}
	}
	
	indexOf(id, user)
	{
		var paths = !user ? this.paths : this.remotes[user];
		if(paths)
		{
			for(var i = paths.length - 1; i >= 0; i--)
			{
				if(paths[i].id === id)
				{
					return i;
				}
			}
		}
	}
	
	remove(id, user, silent)
	{
		var paths = !user ? this.paths : this.remotes[user];
		if(paths)
		{
			for(var i = paths.length - 1; i >= 0; i--)
			{
				var path = paths[i];
				if(path.id === id)
				{
					paths.splice(i, 1);
					if(!silent)
					{
						this.redraw();
					}
					return path;
				}
			}
		}
	}
	
	undo()
	{
		if(this.paths.length)
		{
			var path = this.paths.pop();
			this.undos.push(path);
			this.emit('remove', path);
		}
		this.redraw();
	}
	
	redo()
	{
		if(this.undos.length)
		{
			var path = this.undos.pop();
			this.add(path);
			this.emit('add', path);
		}
	}
	
	startPath(point)
	{
		if(this.cursor.path)
		{
			this.endPath();
		}
		
		this.cursor.path = {
			id: randomString(),
			color: this.cursor.color,
			points: [point],
		};
		this.cursor.point = point;
		this.undos.length = 0;
	}
	
	endPath(point)
	{
		var path = this.cursor.path;
		if(path)
		{
			if(point)
			{
				this.continuePath(point);
			}
			
			if(path.points.length > 1)
			{
				this.paths.push(path);
				this.emit('add', path);
			}
			this.cursor.path = null;
		}
	}
	
	continuePath(point)
	{
		if(String(this.cursor.point) === String(point))
		{
			return;
		}
		
		this.drawLine(this.cursor.point, point, this.cursor.path.color);
		this.cursor.path.points.push(point);
		this.cursor.point = point;
	}
	
	drawSetup(user)
	{
		this.context.globalAlpha = (user && 'remoteAlpha' in this.options) ? this.options.remoteAlpha : 1;
	}
	
	drawLine([x0, y0], [x1, y1], color, user)
	{
		this.drawSetup(user);
		
		var context = this.context;
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.strokeStyle = color;
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	}
	
	drawPath(path, user)
	{
		this.drawSetup(user);
		
		var context = this.context;
		context.beginPath();
		var [x, y] = path.points[0];
		context.moveTo(x, y);
		for(var i = 1; i < path.points.length; i++)
		{
			[x, y] = path.points[i];
			context.lineTo(x, y);
		}
		context.strokeStyle = path.color;
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	}
	
	draw(user)
	{
		var paths = !user ? this.paths : this.remotes[user];
		if(paths)
		{
			for(var i = 0; i < paths.length; i++)
			{
				this.drawPath(paths[i], user);
			}
		}
	}
	
	redraw()
	{
		if(!this.redrawing)
		{
			setTimeout(() =>
			{
				this.redrawing = null;
				this.forceRedraw();
			});
		}
	}
	
	forceRedraw()
	{
		this.context.clearRect(0, 0, this.width, this.height);
		for(var user in this.remotes)
		{
			if(this.remotes.hasOwnProperty(user))
			{
				this.draw(user);
			}
		}
		this.draw();
	}
	
	clear(user)
	{
		if(!user)
		{
			this.paths.length = 0;
			this.undos.length = 0;
			this.emit('clear');
		}
		else
		{
			delete this.remotes[user];
		}
		this.redraw();
	}
	
	screenshot(format = 'png')
	{
		return this.context.canvas.toDataURL(format);
	}
	
	blob()
	{
		return new Promise((resolve, reject) => this.context.canvas.toBlob(resolve));
	}
	
	change(packet)
	{
		this.emit('packet', packet);
		
		this.save();
	}
	
	packet({add, remove, clear}, user)
	{
		if(add)
		{
			for(var path of add)
			{
				this.add(path, user);
			}
		}
		if(remove)
		{
			for(var id of remove)
			{
				this.remove(id, user);
			}
		}
		if(clear)
		{
			this.clear(user);
		}
	}
}

function throttle(callback, delay)
{
	if(!delay)
	{
		return callback;
	}
	
	var prev = Date.now();
	return function()
	{
		var time = Date.now();
		if(time - prev >= delay)
		{
			prev = time;
			callback.apply(null, arguments);
		}
	};
}

module.exports = function(canvas, options = {})
{
	var board = options.handle;
	var context = canvas.getContext('2d');
	if(!board)
	{
		board = new Whiteboard(context, options);
		options.handle = board;
	}
	else
	{
		board.context = context;
	}
	
	canvas.width = board.width;
	canvas.height = board.height;
	
	var aspectRatio = board.width / board.height;
	function onResize()
	{
		var rect = canvas.getBoundingClientRect();
		canvas.style.height = Math.round(rect.width / aspectRatio);
	}
	onResize();
	window.addEventListener('resize', onResize, false);//TODO leak
	
	board.redraw();
	
	function onKeyDown(event)
	{
		if(event.ctrlKey)
		{
			if(event.key === 'z')
			{
				board.undo();
			}
			if(event.key === 'y')
			{
				board.redo();
			}
		}
	}
	document.addEventListener('keydown', onKeyDown, false);//TODO leak
	
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mouseup', onMouseUp, false);
	canvas.addEventListener('mouseout', onMouseUp, false);
	canvas.addEventListener('mousemove', throttle(onMouseMove, options.throttle || 20), false);
	
	canvas.addEventListener('touchstart', onTouchStart, false);
	canvas.addEventListener('touchend', onTouchEnd, false);
	canvas.addEventListener('touchcancel', onTouchEnd, false);
	canvas.addEventListener('touchmove', throttle(onTouchMove, options.throttle || 20), false);
	
	function stopEvent(event)
	{
		event.preventDefault();
		event.stopPropagation();
		return event;
	}
	
	function round(n)
	{
		var precision = 100;
		return Math.round(n * precision) / precision;
	}
	
	function getPoint({clientX, clientY})
	{
		var rect = canvas.getBoundingClientRect();
		var scaleX = canvas.width / rect.width;
		var scaleY = canvas.height / rect.height;
		return [round((clientX - rect.left) * scaleX), round((clientY - rect.top) * scaleY)];
	}
	
	function onMouseDown(event)
	{
		stopEvent(event);
		board.startPath(getPoint(event));
	}
	
	function onTouchStart(event)
	{
		stopEvent(event);
		if(event.touches.length == 1)
		{
			board.startPath(getPoint(event.touches[0]));
		}
	}
	
	function onMouseUp(event)
	{
		stopEvent(event);
		board.endPath(getPoint(event));
	}
	
	function onTouchEnd(event)
	{
		stopEvent(event);
		if(event.changedTouches.length == 1)
		{
			board.continuePath(getPoint(event.changedTouches[0]));
		}
		board.endPath();
	}
	
	function onMouseMove(event)
	{
		stopEvent(event);
		var point = getPoint(event);
		if(!board.cursor.path)
		{
			board.cursor.point = point;
		}
		else
		{
			board.continuePath(point);
		}
	}
	
	function onTouchMove(event)
	{
		stopEvent(event);
		if(event.touches.length == 1)
		{
			var point = getPoint(event.touches[0]);
			if(!board.cursor.path)
			{
				board.cursor.point = point;
			}
			else
			{
				board.continuePath(point);
			}
		}
		else
		{
			onTouchEnd(event);
		}
	}
	
	return board;
}

	// socket.on('drawing', onDrawingEvent);
	
	//TODO events for mouse pointer?
	
		// socket.emit('drawing', {
		// 	x0: x0 / w,
		// 	y0: y0 / h,
		// 	x1: x1 / w,
		// 	y1: y1 / h,
		// 	color: color,
		// });
	
	// function onDrawingEvent(data)
	// {
	// 	var w = canvas.width;
	// 	var h = canvas.height;
	// 	drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
	// }