module.exports = {
	template: `
		<span ng-switch="$ctrl.user.status">
			<i ng-switch-when="available" class="fa fa-podcast text-success animate-pulse"></i>
			<i ng-switch-when="busy" class="fa fa-pencil-square-o text-muted"></i>
			<i ng-switch-default class="fa fa-user-o text-muted"></i>
		</span>
	`,
	bindings: {
		user: '<',
	},
};