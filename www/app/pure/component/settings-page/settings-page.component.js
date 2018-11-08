module.exports = {
	template: require('./settings-page.html'),
	controller: function(API, Alert, UserService)
	{
		var $ctrl = this;
		
		var SettingsAPI = API.service('settings');
		
		$ctrl.user = UserService.user;
		
		var prevSettings = {};
		var invalidFlags = {};
		
		$ctrl.focus = function()
		{
			Object.assign(prevSettings, $ctrl.user);
		}
		
		$ctrl.update = function(key)
		{
			if(prevSettings[key] === $ctrl.user[key])
			{
				return;
			}
			
			return SettingsAPI.update(key, {value: $ctrl.user[key]})
				.then(result =>
				{
					invalidFlags[key] = false;
					Alert.toast('Updated successfully.', null, 'success');
				})
				.catch(err =>
				{
					invalidFlags[key] = true;
					throw err;
				});
		}
	}
};