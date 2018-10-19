module.exports = {
	template: require('./topic-badges.html'),
	bindings: {
		topic: '<',
		include: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.showing = function(key)
		{
			if($ctrl.include && $ctrl.include.includes(key))
			{
				return true;
			}
			return $ctrl.topic && $ctrl.topic[key];
		}
		
		$ctrl.starIcon = function(threshold, n)
		{
			if(n >= threshold)
			{
				return 'fas fa-star';
			}
			else if(Math.round(n) >= threshold)
			{
				return 'far fa-star-half';
			}
			return 'far fa-star';
		}
		
		$ctrl.percent = function(n)
		{
			return Math.round(n * 100);
		}
	}
}