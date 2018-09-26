module.exports = {
	template: require('./search-page.html'),
	controller: function($location)
	{
		var $ctrl = this;
		
		$ctrl.query = $location.search()['q'] || 'Arabic',
		
		$ctrl.results = [{
			type: 'tutor',
			user: {
				name: 'Ahmed K.',
				status: 'available',
			},
			name: 'Arabic lessons',
			blurb: 'I\'m a native speaker.',
			lessons: 9,
			reputation: 4.5,
			match: .95,
			rate: 10,
			hourly: true,
		}, {
			type: 'tutor',
			user: {
				name: 'Vlad P.',
				status: 'busy',
			},
			name: 'Modern Soviet history',
			blurb: 'Electoral politics specialist here, with plenty of experience in office. Thus I have confidential information about Gulag operations and other intriguing aspects of the Soviet Union.',
			lessons: 143,
			reputation: 3.9,
			match: .91,
			rate: 35,
			hourly: false,
		}];
		
		///TODO
		$ctrl.isHighlighted = function()
		{
			
		}
	}
};