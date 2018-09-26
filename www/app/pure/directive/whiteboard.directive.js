module.exports = function($timeout, SessionService)
{
	return {
		restrict: 'A',
		link($scope, $elem, $attrs)
		{
			var canvas = $elem[0];
			var context = canvas.getContext('2d');
			
			var current = $scope.$eval($attrs.handle);
			var drawing = false;
			
			canvas.addEventListener('mousedown', onMouseDown, false);
			canvas.addEventListener('mouseup', onMouseUp, false);
			canvas.addEventListener('mouseout', onMouseUp, false);
			canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
			
			//TODO touch events
			
			current.actions = {
				clear: clearBoard,
				screenshot: getScreenshot,
			};
			
			window.addEventListener('resize', onResize, false);
			onResize();
			
			// socket.on('drawing', onDrawingEvent);
			
			//TODO events for mouse pointer?
			
			function stopEvent(e)
			{
				e.preventDefault();
				e.stopPropagation();
			}
			
			function drawLine(x0, y0, x1, y1, color, emit)
			{
				context.beginPath();
				context.moveTo(x0, y0);
				context.lineTo(x1, y1);
				context.strokeStyle = color;
				context.lineWidth = 2;
				context.stroke();
				context.closePath();
				
				if (!emit) return;
				var w = canvas.width;
				var h = canvas.height;
				
				// socket.emit('drawing', {
				// 	x0: x0 / w,
				// 	y0: y0 / h,
				// 	x1: x1 / w,
				// 	y1: y1 / h,
				// 	color: color,
				// });
			}
			
			function onMouseDown(e)
			{
				drawing = true;
				current.x = e.offsetX;
				current.y = e.offsetY;
			}
			
			function onMouseUp(e)
			{
				if(!drawing) return;
				drawing = false;
				drawLine(current.x, current.y, e.offsetX, e.offsetY, current.color, true);
			}
			
			function onMouseMove(e)
			{
				if(!drawing) return;
				drawLine(current.x, current.y, e.offsetX, e.offsetY, current.color, true);
				current.x = e.offsetX;
				current.y = e.offsetY;
			}
			
			// function onColorUpdate(e)
			// {
			// 	current.color = e.target.className.split(' ')[1];
			// }
			
			function throttle(callback, delay)
			{
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
			
			function onDrawingEvent(data)
			{
				var w = canvas.width;
				var h = canvas.height;
				drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
			}
			
			function onResize()
			{
				canvas.width = $elem.width();
				canvas.height = $elem.height();
			}
			
			function clearBoard()
			{
				context.clearRect(0, 0, canvas.width, canvas.height);
			}
			
			function getScreenshot()
			{
				return canvas.toDataURL('png');
			}
		}
	};
}