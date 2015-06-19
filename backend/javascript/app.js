(function  () {
	var app = angular.module('archive', ['ngResource']);	

	var urlBase = '../api/';
	var key = '92240b1020b541bc583c71859629bac628d4131d';
	
	app.controller('CollectionController', ["$resource", function($resource) {
		//~ this.list = {};
		var rest = $resource(urlBase + "collections/:id/", {
			key: '@key'
		});
		this.getCollections = function () {
			this.list = rest.query();
		};
		
		this.addCollection = function (data) {
			var sendData = {
				public: true,
				key: key,
				element_texts: [{
					html: false,
					text: data.title || 'untitled',          
					element: {
						id: 50
					}
				}]
			};
			
			rest.save(sendData).$promise.then(this.getCollections.call(this));
		};
		this.removeCollection = function (id) {
			rest.remove({
				id: id, 
				key: key
			}).$promise.then(this.getCollections.call(this));
		};
		this.getCollections();
		
	} ]);
	//~ 
	//~ app.controller('AddCollection', ["$resource", function($resource) {
		//~ var key = '92240b1020b541bc583c71859629bac628d4131d';
	//~ } ]);
})();
