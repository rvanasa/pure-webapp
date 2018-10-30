module.exports = {
	template: require('./badges-page.html'),
	controller: function(API, Alert)
	{
		var $ctrl = this;
		
		var AwardAPI = API.service('awards');
		
		$ctrl.award = function(badge)
		{
			return AwardAPI.create({
				badge: badge._id,
				email: $ctrl.email,
			}).then(() =>
			{
				Alert.toast('Awarded successfully.', null, 'success');
				$ctrl.email = null;
			});
		}
		
		$ctrl.revoke = function(badge)
		{
			return AwardAPI.update(badge._id, {
				email: $ctrl.email,
				revoke: true,
			}).then(() =>
			{
				Alert.toast('Revoked successfully.', null, 'success');
				$ctrl.email = null;
			});
		}
	}
};