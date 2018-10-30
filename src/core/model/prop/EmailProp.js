module.exports = function()
{
    var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    
	return {
		type: String,
		validate: {
		    validator(val)
		    {
		        return regex.test(val);
		    },
		    message: `{VALUE} is not a valid email address`,
		},
		lowercase: true,
	};
}