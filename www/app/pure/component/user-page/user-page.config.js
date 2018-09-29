module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'user',
		name: 'User',
		icon: 'graduation-cap',
		params: [':id'],
	});
}