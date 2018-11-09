module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'user',
		name: 'Teacher',
		icon: 'graduation-cap',
		params: [':id'],
	});
}