module.exports = function(Model, Database, MoneyProperty)
{
	return Model('Transaction')
		.prop('from', 'User')
		.prop('to', 'User')
		.prop('amount', null, MoneyProperty)
		.build(Database);
}
