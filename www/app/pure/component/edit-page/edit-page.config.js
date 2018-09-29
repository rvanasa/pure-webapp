module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'edit',
		name: 'Edit',
		icon: 'code',
		params: [':id'],
	});
}