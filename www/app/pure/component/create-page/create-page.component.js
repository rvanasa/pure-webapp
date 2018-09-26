module.exports = {
	template: require('./create-page.html'),
	controller: function($location)
	{
		var $ctrl = this;
		
		$ctrl.topics = [{
			name: 'JavaScript Fundamentals',
			blurb: 'Learn JS from a web developer.',
			rate: 10,
			hourly: true,
			group: false,
			lessons: 0,
		}];
		
		$ctrl.newTopic = null;
		
		$ctrl.startNewTopic = function(fields)
		{
			$ctrl.newTopic = Object.assign({
				hourly: true,
			}, fields);
			$ctrl.editing = $ctrl.newTopic;
		}
		
		$ctrl.saveTopic = function()
		{
			// TODO
			// if(!$ctrl.editing._id)
			{
				$ctrl.topics.push($ctrl.newTopic);
				$ctrl.newTopic = null;
			}
			// .then()
			$ctrl.editing = null;
		}
		
		if(!$ctrl.topics.length)
		{
			$ctrl.startNewTopic();
		}
	}
};