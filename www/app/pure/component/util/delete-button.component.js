module.exports = {
	template: `
		<span
			class="btn btn-sm"
			ng-class="'btn-' + ($ctrl.deletePrompt ? 'danger btn-lg' : 'outline-info')"
			ng-click="!$ctrl.deletePrompt ? $ctrl.deletePrompt = true : $ctrl.onConfirm()"
			ng-init="$ctrl.deletePrompt = false">
			<span class="mr-1" ng-if="$ctrl.deletePrompt">Are you sure?</span>
			<i class="fa fa-trash"></i>
		</span>`,
	bindings: {
		onConfirm: '&',
	}
};