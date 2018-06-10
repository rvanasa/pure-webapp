module.exports = {
	template: `
		<div class="sio-loading-panel text-center py-5" ng-if="$ctrl.loading">
			<i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw text-primary"></i>
		</div>
		<div ng-if="!$ctrl.loading" ng-transclude></div>`,
	transclude: true,
	bindings: {
		loading: '<',
	}
};