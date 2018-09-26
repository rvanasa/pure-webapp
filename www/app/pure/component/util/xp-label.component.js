module.exports = {
	template: `<span class="badge badge-light"><span ng-bind="$ctrl.amount | number"></span> XP</span>`,
	bindings: {
		amount: '<',
	},
};