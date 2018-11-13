module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'fund',
		name: 'Add Funds',
		icon: 'credit-card',
		params: [':topic'],
	});
}