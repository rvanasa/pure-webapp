module.exports = function RequestService($q, $http)
{
	this.get = function(resource, url)
	{
		return handle(resource, url, $http.get(url)
			.then(function(response)
			{
				return response;
			}));
	}
	
	this.post = function(resource, url, body)
	{
		return handle(resource, url, $http.post(url, body))
			.then(function(response)
			{
				resource.notify();
				return response;
			});
	}
	
	this.put = function(resource, url, body)
	{
		return handle(resource, url, $http.put(url, body))
			.then(function(response)
			{
				resource.notify(resource);
				return response;
			});
	}
	
	this.delete = function(resource, url, body)
	{
		return handle(resource, url, $http.delete(url, body))
			.then(response =>
			{
				resource.notify();
				return response;
			});
	}
	
	function handle(resource, url, promise)
	{
		return promise
			.then(response =>
			{
				return response.data;
			})
			.catch(error =>
			{
				error = new Error(error.data || error.status + ' ' + error.statusText);
				resource.reject(error);
				return $q.reject(error);
			});
	}
}