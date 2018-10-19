module.exports = {
	template: require('./fund-page.html'),
	controller: function(WalletService)
	{
		var $ctrl = this;
		
		WalletService.getWallet()
			.then(wallet => $ctrl.wallet = wallet);
		
		$ctrl.amounts = [10, 25, 100];
		
		$ctrl.amount = {
			total: $ctrl.amounts[0],
			currency: 'USD',
		};
	}
};