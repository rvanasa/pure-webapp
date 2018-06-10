'use strict'

var mongoose = require('mongoose');

module.exports = function()
{
	class Model
	{
		constructor(name)
		{
			this.name = name;
			
			this.props = {};
			this.methods = {};
		}
		
		table(tableName)
		{
			this.tableName = tableName;
		}
		
		prop(name, type, options)
		{
			this.current = Object.assign({
				type,
				required: true,
			}, options);
			this.props[name] = this.current;
			if(typeof type === 'string')
			{
				this.ref(type);
			}
			return this;
		}
		
		ref(type)
		{
			this.current.type = mongoose.Schema.Types.ObjectId;
			this.current.ref = type;
			return this;
		}
		
		opt()
		{
			this.current.required = false;
			return this;
		}
		
		lowercase()
		{
			this.current.lowercase = true;
			return this;
		}
		
		array()
		{
			delete this.current.required;
			this.current.type = [this.current.type];
			return this;
		}
		
		default(provider)
		{
			this.current.default = provider;
			return this;
		}
		
		unique()
		{
			if(!this.current.index) this.current.index = {};
			this.current.index.unique = true;
			return this;
		}
		
		method(name, handler)
		{
			if(!handler)
			{
				handler = name;
				name = handler.name;
			}
			
			this.methods[name] = handler;
			return this;
		}
		
		static(name, handler)
		{
			if(!handler)
			{
				handler = name;
				name = handler.name;
			}
			
			this.statics[name] = handler;
			return this;
		}
		
		toSchema()
		{
			return new mongoose.Schema(this.props);
		}
		
		build(connection)
		{
			var schema = this.toSchema();
			
			Object.assign(schema.methods, this.methods);
			Object.assign(schema.statics, this.statics);
			
			return connection.model(this.name, schema, this.tableName);
		}
	}
	
	return (name) => new Model(name);
}