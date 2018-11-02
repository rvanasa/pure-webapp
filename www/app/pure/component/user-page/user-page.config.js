module.exports = function(PageListProvider)
{
	PageListProvider.addPage({
		id: 'user',
		name: 'Teach',
		icon: 'graduation-cap',
		params: [':id'],
	});
}