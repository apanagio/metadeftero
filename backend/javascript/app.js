(function  () {
	var app = angular.module('archive', ['ngResource']);
	
	var urlBase = '../api/';
	
	app.controller('CollectionController', ["$resource", function($resource) {
		var rest = $resource(urlBase + "collections/:id");
		var getCollections = function () {
			return rest.query();
		};
		this.list = getCollections();
		
	} ]);
	
	app.controller('AddCollection', ["$resource", function($resource) {
		var key = '92240b1020b541bc583c71859629bac628d4131d';
	} ]);
})();
