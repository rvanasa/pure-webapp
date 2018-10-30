module.exports = {
	template: require('./content-list.html'),
	bindings: {
		title: '@',
		service: '@',
	},
	transclude: {
		item: 'contentItem',
		edit: 'contentEdit',
	},
	controller: function(API)
	{
		var $ctrl = this;
		
		$ctrl.$onInit = function()
		{
			var itemAPI = API.service($ctrl.service);
			
			itemAPI.find()
				.then(results =>
				{
					$ctrl.items = results;
					if(!$ctrl.items.length)
					{
						$ctrl.create();
					}
				});
			
			$ctrl.create = function()
			{
				if(!$ctrl.items)
				{
					return;
				}
				
				var item = {_selected: true};
				$ctrl._selected = item;
				$ctrl.items.push(item);
			}
			
			$ctrl.update = function(item)
			{
				delete item._selected;
				var promise;
				if(!item._id)
				{
					promise = itemAPI.create(item)
						.then(_id => item._id = _id);
				}
				else
				{
					promise = itemAPI.update(item._id, item);
				}
				promise.catch(err =>
				{
					item._selected = true;
					throw err;
				});
			}
			
			$ctrl.close = function(item)
			{
				if(!item._id)
				{
					$ctrl.delete(item);
				}
				else
				{
					delete item._selected;
				}
			}
			
			$ctrl.delete = function(item)
			{
				var index = $ctrl.items.indexOf(item);
				if(index > -1)
				{
					$ctrl.items.splice(index, 1);
				}
				if(item._id)
				{
					itemAPI.remove(item._id);
				}
			}
		}
	}
};