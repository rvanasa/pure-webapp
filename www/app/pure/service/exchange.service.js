module.exports = function ExchangeService(API)
{
	// var ExchangeAPI = API.service('exchange');
	
	this.getBuyRate = function(currency)
	{
		return Promise.resolve(90);
	}
	
	this.getSellRate = function(currency)
	{
		return Promise.resolve(100);
	}
}