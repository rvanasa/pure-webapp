module.exports = function(Model, Database, URLProp)
{
	return Model('ExternalTopic')
		.prop('userLabel', String)
		.prop('name', String)
		.prop('blurb', String)
		.prop('category', String)
		.prop('url', null, URLProp)
		.build(Database);
}
