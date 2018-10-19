module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'topic',
		name: 'Topic',
		icon: 'folder',
		params: [':id'],
	});
}