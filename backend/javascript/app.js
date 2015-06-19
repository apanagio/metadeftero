(function  () {
	var app = angular.module('archive', ['ngResource']);	

	var urlBase = '../api/';
	var key = '92240b1020b541bc583c71859629bac628d4131d';
	
	app.controller('CollectionController', ["$resource", "$timeout", function($resource, $timeout) {
		var that = this;
		var rest = $resource(urlBase + "collections/:id/", {
			key: '@key'
		});
		this.getCollections = function (delay) {
				that.list = rest.query();
		};
		
		this.addCollection = function (data) {
			var ids = {
				title: 50,
				subject: 49,
				text: 1
			};
			var sendData = {
				public: true,
				key: key,
				element_texts: [{
					html: false,
					text: data.title || 'untitled',          
					element: {
						id: 50
					}
				}, 
				data.subject && {
					html: false, 
					text: data.subject,
					element: {
						id: 49
					}
				},
				data.text && {
					html: false, 
					text: data.text,
					element: {
						id: 1
					}
				}
				]
			};
			rest.save(sendData).$promise.then( this.getCollections );
		};
		this.removeCollection = function (id) {
			rest.remove({
				id: id, 
				key: key
			}).$promise.then( this.getCollections );
		};
		this.getCollections();
		
	} ]);
	//~ 
	//~ app.controller('AddCollection', ["$resource", function($resource) {
		//~ var key = '92240b1020b541bc583c71859629bac628d4131d';
	//~ } ]);
})();
