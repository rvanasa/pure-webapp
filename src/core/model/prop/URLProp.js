module.exports = function()
{
	return {
		type: String,
		validate: [/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, '{VALUE} is not a valid URL'],
	};
}