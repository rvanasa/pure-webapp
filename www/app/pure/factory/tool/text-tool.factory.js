module.exports = function TextTool($timeout, UserService)
{
	var editor = null;
	var applying = false;
	var latestPeer = null;
	
	return {
		id: 'text',
		icon: 'file-alt',
		onConfig(options)
		{
			this.state = this.service.storage['session.text'];
		},
		getHash()
		{
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
			
			var state = this.state || '';
			if(editor && editor.getValue() !== state)
			{
				var pos = editor.session.selection.toJSON();
				editor.setValue(state);
				editor.session.selection.fromJSON(pos);
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
			
			this.sendPacket({request: true}, latestPeer);
			
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
			// this.sendPacket({hash: this.getHash()}, peer);
			
			latestPeer = peer;
		},
		onPacket(packet, peer)
		{
			if(editor)
			{
				try
				{
					applying = true;
					
					if('request' in packet)
					{
						this.sendPacket({state: this.state}, peer);
					}
					if('state' in packet)
					{
						// received = true;
						this.update(packet.state);
					}
					if('deltas' in packet)
					{
						editor.getSession().getDocument().applyDeltas(packet.deltas);
					}
					if('hash' in packet)
					{
						if(this.getHash() !== packet.hash)
						{
							this.sendPacket({request: true}, peer);
						}
					}
				}
				finally
				{
					applying = false;
				}
			}
		}
	};
}