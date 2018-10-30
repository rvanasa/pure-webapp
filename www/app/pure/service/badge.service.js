module.exports = function BadgeService(API, Socket, Alert, UserService)
{
	var AwardsAPI = API.service('awards');
	
	Socket.on('award.offer', notifyOffer);
	
	AwardsAPI.find()
		.then(results =>
		{
			for(var badge of results)
			{
				notifyOffer(badge);
			}
		});
	
	function populateBadge(badge)
	{
		return UserService.get(badge.issuer)
			.then(user =>
			{
				badge.issuer = user;
				return badge;
			});
	}
	
	function notifyOffer(badge)
	{
		return populateBadge(badge)
			.then(() =>
			{
				Alert({
					titleText: `${badge.issuer.name} has given you a badge!`,
					text: `${badge.name} - ${badge.blurb}`,
					type: 'success',
				})
				.then(() => AwardsAPI.patch(badge._id, {}))
				.then(() => badge.issuer.badges.push(badge));
			});
	}
}