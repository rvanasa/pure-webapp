module.exports = function TextTool($timeout, UserService)
{
	var editor = null;
	var received = false;
	var applying = false;
	var inputBuffer = [];
	
	return {
		id: 'text',
		icon: 'file-alt',
		onConfig(options)
		{
			this.state = this.service.storage['session.text'];
		},
		getHash()
		{
			if(!editor)
			{
				return null;
			}
			
			var text = this.state || '';
			var hash = 0;
			if(!text)
			{
				return hash;
			}
			for(var i = 0; i < text.length; i++)
			{
				var char = text.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash;
			}
			return hash;
		},
		update(text)
		{
			if(arguments.length > 0)
			{
				this.state = text;
			}
			
			if(editor)
			{
				editor.setValue(this.state || '', 1);
			}
			
			this.save();
		},
		save()
		{
			this.service.storage['session.text'] = this.state || '';
		},
		setEditor(newEditor)
		{
			editor = newEditor;
			
			this.update();
			
			editor.getSession().getDocument().applyDeltas(inputBuffer);
			
			editor.on('change', delta =>
			{
				var isApplying = applying;
				$timeout(() =>
				{
					this.state = editor.getValue();
					
					if(!isApplying)
					{
						this.sendPacket({
							hash: this.getHash(),
							deltas: [delta],
						});
					}
					
					this.save();
				});
			});
		},
		evaluate()
		{
			
		},
		onRestart()
		{
			this.update(null);
		},
		onPeer(peer)
		{
			if(!received)
			{
				this.sendPacket({request: true}, peer);
			}
			// this.sendPacket({hash: this.getHash()}, peer);
		},
		onPacket(packet, peer)
		{
			try
			{
				applying = true;
				
				if('hash' in packet)
				{
					if(this.getHash() !== packet.hash)
					{
						this.sendPacket({request: true}, peer);
					}
				}
				if('request' in packet)
				{
					this.sendPacket({state: this.state}, peer);
				}
				if('state' in packet)
				{
					received = true;
					this.update(packet.state);
				}
				if('deltas' in packet)
				{
					if(editor)
					{
						for(var delta in packet.deltas)
						{
							
						}
						
						editor.getSession().getDocument().applyDeltas(packet.deltas);
					}
					else
					{
						inputBuffer.push(...packet.deltas);
					}
				}
			}
			finally
			{
				applying = false;
			}
		}
	};
}