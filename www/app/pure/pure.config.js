module.exports = function($animateProvider, $locationProvider, $compileProvider)
{
	$animateProvider.classNameFilter(/allow-anim/);
	
	$locationProvider.html5Mode(true);
	
	// $compileProvider.preAssignBindingsEnabled(true);
}