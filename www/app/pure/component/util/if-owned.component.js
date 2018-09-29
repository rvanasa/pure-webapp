module.exports = {
	template: `<ng-transclude ng-if="($ctrl.user._id == $ctrl.service.user._id) == !$ctrl.invert"></ng-transclude>`,
	transclude: true,
	bindings: {
		user: '<',
		invert: '<',
	},
	controller: function(UserService)
	{
		var $ctrl = this;
		
		$ctrl.service = UserService;
	}
};