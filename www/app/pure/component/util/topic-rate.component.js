module.exports = {
	template: `
		<span ng-if="$ctrl.topic.rate > 0">
			<xp-label amount="$ctrl.topic.rate"></xp-label>
		</span>
		<span ng-if="$ctrl.topic.rate == 0">
			<span>Free session</span>
			<span>- <span ng-bind="$ctrl.intervalNumber | number"></span> <span ng-bind="$ctrl.intervalWord"></span></span>
		</span>
		<span ng-if="$ctrl.topic.rate > 0 || $ctrl.topic.interval > 0">
			<span ng-if="$ctrl.intervalNumber == 1">per</span>
			<span ng-if="$ctrl.intervalNumber != 1">for <span ng-bind="$ctrl.intervalNumber | number"></span></span>
			<span ng-bind="$ctrl.intervalWord"></span>
		</span>
	`,
	bindings: {
		topic: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.$onInit = function()
		{
			var interval = $ctrl.topic.interval;
			var name;
			if(!interval)
			{
				interval = 1;
				name = 'session';
			}
			else if(interval % 60 === 0)
			{
				interval /= 60;
				name = 'hour' + (interval === 1 ? '' : 's');
			}
			else
			{
				name = 'minute' + (interval === 1 ? '' : 's');
			}
			$ctrl.intervalNumber = interval;
			$ctrl.intervalWord = name;
		}
	}
};