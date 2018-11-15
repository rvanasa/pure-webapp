module.exports = function(API, Endpoint, ModelEndpoint, Hooks, TransactionModel, SessionModel)
{
	return Endpoint('stats')
		.add('get', async (id, {user}) =>
		{
			if(id === 'teacher')
			{
				var earnings = 0;
				for(var tx of await TransactionModel.find({to: user, reason: 'session'}, '-_id amount').lean())
				{
					earnings += tx.amount;
				}
				return {
					earnings,
				};
			}
			else
			{
				throw `Invalid stats type: ${id}`;
			}
		})
		.build(API);
}