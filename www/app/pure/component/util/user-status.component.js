module.exports = {
	template: `
		<span ng-switch="$ctrl.status($ctrl.user)">
			<i ng-switch-when="available" class="fa fa-podcast text-success animate-pulse"></i>
			<i ng-switch-when="busy" class="fa far-pencil-square text-muted"></i>
			<i ng-switch-default class="far fa-user text-muted"></i>
		</span>
	`,
	bindings: {
		user: '<',
	},
	controller: function(Binder, StatusService)
	{
		var $ctrl = this;
		
		$ctrl.status = function()
		{
			return StatusService.status($ctrl.user);
		}
		
		// var listener = null;
		// Binder($ctrl).onDestroy(() =>
		// {
			
		// });
	}
};