module.exports = {
	template: `
		<b class="badge badge-pill my-1"
			style="font-size:1em"
			ng-class="'badge-'+($ctrl.interests.has($ctrl.interest) ? 'primary' : 'light')"
			ng-bind="$ctrl.interest"
			ng-click="$ctrl.toggle()">
		</b>
	`,
	bindings: {
		interest: '<',
	},
	controller: function(InterestService)
	{
		var $ctrl = this;
		
		$ctrl.interests = InterestService;
		
		$ctrl.toggle = function()
		{
			if(!$ctrl.interests.has($ctrl.interest))
			{
				InterestService.add($ctrl.interest);
			}
			else
			{
				InterestService.remove($ctrl.interest);
			}
		}
	}
};