module.exports = function(TransactionModel, UserEvents)
{
	return {
		async getSpendableBalance(user)
		{
			var id = user._id || user;
			var balance = 0;
			for(var tx of await TransactionModel.find({$or: [{from: user}, {to: user}]}).lean())
			{
				if(id.equals(tx.from))
				{
					balance -= tx.amount;
				}
				if(id.equals(tx.to))
				{
					balance += tx.amount;
				}
			}
			return balance;
		},
		async createTransaction(tx)
		{
			await TransactionModel.create(tx);
			if(tx.to)
			{
				UserEvents.emit(tx.to._id || tx.to, 'wallet.receive', {from: tx.from._id || tx.from, amount: tx.amount});
			}
			if(tx.from)
			{
				UserEvents.emit(tx.from._id || tx.from, 'wallet.send', {to: tx.to._id || tx.to, amount: tx.amount});
			}
		},
	};
}