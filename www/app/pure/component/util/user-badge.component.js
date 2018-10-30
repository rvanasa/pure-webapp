module.exports = {
	template: `
		<span class="fa-stack">
			<i class="fa fa-stack-2x fa-circle text-warning"></i>
			<i class="fa fa-stack-2x fa-certificate text-dark"></i>
			<i class="fa fa-stack-1x text-warning" ng-class="'fa-'+$ctrl.badge.icon"></i>
		</span>
	`,
	bindings: {
		badge: '<',
	},
};