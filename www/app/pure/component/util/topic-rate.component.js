module.exports = {
	template: `
		<span ng-if="$ctrl.topic.rate > 0">
			<xp-label amount="$ctrl.topic.rate"></xp-label> per <span ng-bind="$ctrl.topic.hourly ? 'hour' : 'session'"></span>
		</span>
		<span ng-if="$ctrl.topic.rate == 0">Free session<span>
	`,
	bindings: {
		topic: '<',
	},
};