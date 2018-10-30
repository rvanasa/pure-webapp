module.exports = {
	template: require('./badges-page.html'),
	controller: function(API, Alert)
	{
		var $ctrl = this;
		
		var AwardAPI = API.service('awards');
		
		$ctrl.award = function(badge)
		{
			var email = $ctrl.email;
			if(!email)
			{
				return;
			}
			
			return AwardAPI.create({
				badge: badge._id,
				email,
			}).then(() =>
			{
				Alert.toast('Awarded successfully.', null, 'success');
				$ctrl.email = null;
			});
		}
		
		$ctrl.revoke = function(badge)
		{
			var email = $ctrl.email;
			if(!email)
			{
				return;
			}
			
			return AwardAPI.update(badge._id, {
				email,
				revoke: true,
			}).then(() =>
			{
				Alert.toast('Revoked successfully.', null, 'success');
				$ctrl.email = null;
			});
		}
	}
};