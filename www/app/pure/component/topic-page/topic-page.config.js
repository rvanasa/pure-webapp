module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'topic',
		name: 'Topic',
		icon: 'folder-o',
		params: [':id'],
	});
}