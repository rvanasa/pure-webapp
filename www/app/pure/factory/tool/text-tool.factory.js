module.exports = function TextTool()
{
	return {
		id: 'text',
		icon: 'file-alt',
		onConfig(options)
		{
			this.load();
		},
		load()
		{
			this.state = this.service.storage['session.text'];
		},
		save()
		{
			this.service.storage['session.text'] = this.state || '';
		},
		evaluate()
		{
			
		},
		onRestart()
		{
			this.state = null;
			this.save();
		}
	};
}