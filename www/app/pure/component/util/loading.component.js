module.exports = {
	template: `
		<div class="text-center py-5" ng-if="!$ctrl.status">
			<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw text-light"></i>
		</div>
		<div ng-if="$ctrl.status" ng-transclude></div>`,
	transclude: true,
	bindings: {
		status: '<',
	}
};