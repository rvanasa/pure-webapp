module.exports = function Binder($interval)
{
	class Binder
	{
		constructor(component)
		{
			this.component = component;
		}
		
		interval(...args)
		{
			var interval = $interval(...args);
			this.onDestroy(() => $interval.cancel(interval));
			return this;
		}
		
		onDestroy(callback)
		{
			if(this.component.$onDestroy)
			{
				var prev = this.component.$onDestroy;
				this.component.$onDestroy = function()
				{
					prev.call(this);
					callback.call(this);
				}
			}
			else
			{
				this.component.$onDestroy = callback;
			}
			return this;
		}
	}
	
	return (...args) => new Binder(...args);
}