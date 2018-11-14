module.exports = function BadgeService($timeout, $compile, $rootScope, QueueService, API, Socket, Alert, UserService)
{
	var AwardsAPI = API.service('awards');
	
	Socket.on('award.offer', notifyOffer);
	
	QueueService.events.on('award.offer', notifyOffer);
	
	function populateBadge(badge)
	{
		return UserService.get(badge.issuer)
			.then(user =>
			{
				badge.issuer = user;
				return badge;
			});
	}
	
	var bodyTemplate = `
		<div>
			<hr class="mt-0">
			<h4><user-badge badge="badge"></user-badge></h4>
			<h4>{{badge.name}}</h4>
			<h5 class="text-muted">{{badge.blurb}}</h5>
			<hr>
			<span class="text-muted">Awarded by <b>{{badge.issuer.name}}</b></span>
		</div>
	`;
	
	function notifyOffer(badge)
	{
		return populateBadge(badge)
			.then(() =>
			{
				var scope = Object.assign($rootScope.$new(true), {
					badge,
				});
				var elem = $compile(bodyTemplate)(scope);
				
				$timeout(() =>
				{
					Alert({
						titleText: `You received a badge!`,
						html: elem.html(),
						showCancelButton: true,
						confirmButtonText: `Add to Profile`,
						cancelButtonText: `Done`,
					})
					.then(result =>
					{
						var enabled = result.value;
						return AwardsAPI.patch(badge._id, {enabled})
							.then(() =>
							{
								if(enabled)
								{
									badge.issuer.badges.push(badge);
								}
							});
					});
				});
			});
	}
}