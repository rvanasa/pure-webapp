module.exports = function(AwardModel)
{
	return {
		name: 'displayName',
		interests: 1,
		lastOnline: 1,
		available: 1,
		async badges()
		{
			return (await AwardModel.find({user: this._id, enabled: true}).populate('badge').lean()).map(award => award.badge);
		},
	};
}