module.exports = function BannerService()
{
	this.queue = [];
	this.current = null;
	
	// this.current = {type:'info',message:'Hi! I\'m a banner!'};////
	
	this.add = function(banner)
	{
		this.queue.push(banner);
		this.show();
	}
	
	this.close = function(banner)
	{
		this.banner = this.queue.shift();
		this.show();
	}
	
	this.show = function()
	{
		this.current = this.queue[0] || null;
	}
	
	this.hide = function()
	{
		this.current = null;
	}
}