module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'resource',
		name: 'Resource',
		icon: 'link',
		params: [':id'],
	});
}