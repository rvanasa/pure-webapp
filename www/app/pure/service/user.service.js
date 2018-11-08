module.exports = function UserService($window, API, Cache)
{
	var UserAPI = API.service('users');
	
	Object.assign(this, Cache(id => UserAPI.get(id)));
	
	this.user = $window.UserData;
	
	this.user.birthdate = new Date(this.user.birthdate);
}