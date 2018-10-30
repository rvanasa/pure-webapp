module.exports = function(API, Endpoint, ModelEndpoint, Hooks, QueueService, UserEvents, AwardModel, AwardOfferModel, BadgeModel, UserModel)
{
	async function findUserId(email)
	{
		return (await UserModel.findOne({email}, '_id').lean())._id;
	}
	
	QueueService.register(async ({user}) =>
	{
		return (await AwardOfferModel.find({email: user.email}).lean().populate('badge'))
			.map(offer => ['award.offer', offer.badge]);
	});
	
	return Endpoint('awards')
		// .add('find', async ({user}) =>
		// {
		// 	// TODO migrate to queue
		// 	return (await AwardOfferModel.find({email: user.email}).lean().populate('badge'))
		// 		.map(offer => offer.badge);
		// })
		.add('create', async (data, {user}) =>
		{
			var badge = await BadgeModel.findById(data.badge);
			if(!badge)
			{
				throw 'Invalid badge';
			}
			else if(!user._id.equals(badge.issuer))
			{
				throw 'Cannot award badge created by a different user';
			}
			
			var uid = await findUserId(data.email);
			
			var [alreadyAward, alreadyOffer] = [
				await AwardModel.count({user: uid, badge}),
				await AwardOfferModel.count({email: data.email, badge}),
			];
			
			if(alreadyAward || alreadyOffer)
			{
				throw 'Already awarded';
			}
			
			await AwardOfferModel.create(data);
			UserEvents.emit(uid, 'award.offer', badge);
			return 'Awarded';
		})
		.add('update', async (id, {email, revoke}, {user}) =>
		{
			if(revoke)
			{
				[
					await AwardOfferModel.deleteOne({email, badge: id}),
					await AwardModel.deleteOne({user: await findUserId(email), badge: id}),
				];
				return 'Revoked';
			}
			
			throw 'Invalid operation';
		})
		.add('patch', async (id, {enabled}, {user}) =>
		{
			var offer = await AwardOfferModel.findOne({email: user.email, badge: id});
			if(!offer)
			{
				throw 'Not offered';
			}
			
			[await offer.remove(), await AwardModel.create({user, badge: id, enabled})];
			return 'Accepted';
		})
		.build(API);
}