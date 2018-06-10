module.exports = {
	template: `
		<span class="btn btn-sm" ng-class="'btn-' + ($ctrl.deletePrompt ? 'danger' : 'light')" ng-init="$ctrl.deletePrompt = false" ng-click="!$ctrl.deletePrompt ? $ctrl.deletePrompt = true : $ctrl.action()">
			<i class="fa fa-trash"></i>
		</span>`,
	bindings: {
		action: '&',
	}
};