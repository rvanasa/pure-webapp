module.exports = function Util($rootScope)
{
	return {
		onDestroy(component, callback)
		{
			if(component.$onDestroy)
			{
				var prev = component.$onDestroy;
				component.$onDestroy = function()
				{
					prev.call(this);
					callback.call(this);
				}
			}
			else
			{
				component.$onDestroy = callback;
			}
		},
	};
}