module.exports = {
	template: require('./topic-badges.html'),
	bindings: {
		badges: '<',
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
			return $ctrl.badges && $ctrl.badges[key];
		}
		
		$ctrl.starIcon = function(threshold, n)
		{
			if(n >= threshold)
			{
				return 'fa fa-star';
			}
			else if(Math.round(n) >= threshold)
			{
				return 'fa fa-star-half-alt';
			}
			return 'far fa-star';
		}
		
		$ctrl.percent = function(n)
		{
			return Math.round(n * 100);
		}
	}
}