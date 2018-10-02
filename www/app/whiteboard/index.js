'use strict'

var EventEmitter = require('events');

function randomString()
{
	return Math.random().toString(36).substring(2, 15);
}

class Whiteboard extends EventEmitter
{
	constructor(context, options)
	{
		super();
		
		this.context = context;
		this.options = options;
		
		this.id = options.id || randomString();
		this.cursor = options.cursor || {};
		this.width = options.width || 854;
		this.height = options.height || 480;
		
		this.paths = [];
		this.undos = [];
	}
	
	path(path)
	{
		this.drawPath(path);
		if(path.id)
		{
			this.remove(path.id);
		}
		this.paths.push(path);
	}
	
	remove(id)
	{
		for(var i = this.paths.length - 1; i > 0; i--)
		{
			if(this.paths[i].id === id)
			{
				this.paths.splice(i, 1);
				return;
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
			this.path(path);
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
			this.paths.push(path);
			this.cursor.path = null;
			this.emit('add', path);
		}
	}
	
	continuePath(point)
	{
		this.drawLine(this.cursor.point, point, this.cursor.path.color);
		this.cursor.path.points.push(point);
		this.cursor.point = point;
	}
	
	drawLine([x0, y0], [x1, y1], color)
	{
		var context = this.context;
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.strokeStyle = color;
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	}
	
	drawPath(path)
	{
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
	
	clear()
	{
		this.paths.length = 0;
		this.redraw();
		this.emit('clear');
	}
	
	redraw()
	{
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i = 0; i < this.paths.length; i++)
		{
			this.drawPath(this.paths[i]);
		}
	}
	
	screenshot(format = 'png')
	{
		return this.context.canvas.toDataURL(format);
	}
	
	packet({id, add, remove, clear})
	{
		if(add)
		{
			for(var path of add)
			{
				/*path.id = id + path.id;*/
				this.path(path);
			}
		}
		if(remove)
		{
			for(var pid of remove)
			{
				this.remove(/*id + */pid);
			}
		}
		if(clear)
		{
			this.clear();
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
	var {board} = options;
	var context = canvas.getContext('2d');
	if(!board)
	{
		board = new Whiteboard(context, options);
		options.board = board;
	}
	else
	{
		board.context = context;
		setTimeout(() => board.redraw());
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
	canvas.addEventListener('touchmove', throttle(onTouchMove, options.throttle || 20), false);
	
	function stopEvent(event)
	{
		event.preventDefault();
		event.stopPropagation();
		return event;
	}
	
	function getPoint({clientX, clientY})
	{
		var rect = canvas.getBoundingClientRect();
		var scaleX = canvas.width / rect.width;
		var scaleY = canvas.height / rect.height;
		return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
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
		if(event.touches.length == 1)
		{
			board.endPath(getPoint(event.touches[0]));
		}
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