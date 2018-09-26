module.exports = function API(RequestService, BannerService)
{
	var prefix = '/api/';
	
	function request(method, path, params)
	{
		console.log(method, prefix + path);////
		return RequestService[method.toLowerCase()](prefix + path, params)
			.then(wrapResponse, wrapError);
	}
	
	function wrapResponse(response)
	{
		return response.data;
	}
	
	function wrapError(error)
	{
		BannerService.error(error.responseText);
		throw error;
	}
	
	return {
		bind(component, path, params)
		{
			return window.Observable.fromPromise(this.get(path, params)); // TODO
		},
		get(path, params)
		{
			return request('GET', path, params);
		},
		create(path, data)
		{
			return request('POST', path, data);
		},
		update(path, data)
		{
			return request('PUT', path, data);
		},
		delete(path, params)
		{
			return request('DELETE', path, params);
		},
	};
}