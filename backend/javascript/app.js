var ids = {
	title: 50,
	subject: 49,
	text: 41,
	Date: 40
};
var theForm;

var main = function () {
	var key = '92240b1020b541bc583c71859629bac628d4131d';
	var client = $.omekaClient( '../api' );
	var context;
	
	// Grab the template script
	var theTemplateScript = $("#address-template").html();

	// Compile the template
	var theTemplate = Handlebars.compile(theTemplateScript);

	var render = function (context) {

		// Pass our data to the template
		var theCompiledHtml = theTemplate(context);

		// Add the compiled html to the page
		$('#content-placeholder').html(theCompiledHtml);
	}

	var getCollections = function () {
		client.get('collections', null, null).done( function (data) {
			render({data});
			document.body.style.cursor = 'default';
		} );	
	};
	
	var getPhoto = function (collectionId) {
	};
	
	var addCollection = function (data, photo, success) {
		var i, photoId, collectionId,
			sendData = {
				public: true,
				element_texts: []
			};

		for (i in data) {
			sendData.element_texts.push({
				html: false,
				text: data[i],          
				element: {
					id: ids[i]
				}
			});
		}
		
		client.post('collections', sendData, {key: key}).then( function (collectionData) {
			if (!photo ) {
				success();
				return true; 
			};
			client.post('items', {
				public: true,
				collection: {
					id: collectionData.id
					}
				}, 
				{ key: key }
			).then(function (itemData) {
				client.postFile(photo, {item: {id: itemData.id} }, {key: key});
				}).then ( success );
		})
	};

	var removeCollection = function (id, success) {
		BootstrapDialog.show({
			type: 'type-danger',
			title: 'Επιβεβαίωση',
			message: 'Να διαγραφεί η εκπομπή και όλες οι ηχογραφήσεις;',
			buttons: [ {
				icon: 'glyphicon glyphicon-trash',
				label: 'Διαγραφή',
				cssClass: 'btn-danger',
				action: function (dialogItself) {
					client.delete('collections', id, {key: key}).then( success );
					document.body.style.cursor = 'progress';
					dialogItself.close();
				}
			}, {
				label: 'Άκυρο',
				action: function (dialogItself) {
					dialogItself.close();
				}
			}]
		});
	};
		
	getCollections();
		
	$('#collections').off().on('click', '#add-collection', function () {
		var data = {
				title: $('#new-title').val(),
				subject: $('#new-subject').val(),
				text: $('#new-description').val()
		};
		var file = $('#new-image')[0].files[0];
		document.body.style.cursor = 'progress';
		addCollection(data, file, getCollections);
	}).on('click', '.remove-collection', function () {
		removeCollection( $(this).data('id'),  getCollections);
	});	
}

var singleCollection = function (id) {
	var key = '92240b1020b541bc583c71859629bac628d4131d';
	var client = $.omekaClient( '../api' );
	var context;
	var collectionData;
	var items;
	var data = {};
	
	// Grab the template script
	var theTemplateScript = $("#single-collection-template").html();

	// Compile the template
	var theTemplate = Handlebars.compile(theTemplateScript);
	
	Handlebars.registerPartial('the-form', theForm);

	var render = function (context) {

		// Pass our data to the template
		var theCompiledHtml = theTemplate(context);

		// Add the compiled html to the page
		$('#single-collection-placeholder').html(theCompiledHtml);
		
		$("input[data-type='datetime']").datetimepicker();

	}
	
	var getData = function() {
		var collectionPromise = client.get('collections', id, null );

		collectionPromise.then( function (data) {
			collectionData = data.element_texts.reduce(function ( total, current ) {
				total[ current.element.name ] = current.text;
				return total;
			}, {});
		});

		var imageUrl;
		var itemsPromise = client.get('items', null, {collection: id}).then(function (data) {
			var filePromise = [];
			items = data.map(function (el) {
				var item = el.element_texts.reduce(function ( total, current ) {
					total[ current.element.name ] = current.text;
					return total;
				}, {}); 
				item.id = el.id;
				if (el.files.count > 0) {
					var fp = client.get('files', null, {item: item.id});
					fp.then(function (data) {
						item.files = data.map( function (el) {
							var file = {}
							file.urls = $.extend({}, el.file_urls);
							file.type = el.mime_type.indexOf('audio')  > -1 ? 'audio' :
										el.mime_type.indexOf('/ogg')  > -1 ? 'audio' :
										el.mime_type.indexOf('image') > -1 ? 'image' :
										el.mime_type;
							file.type === 'image' && (imageUrl = file.urls.thumbnail);
							return file;
						});
						
					});
					filePromise.push(fp);
				}
				return item;
			});
			
			items.sort(function (a, b) {
				if (a.Date && b.Date) {
					aTime = new Date(a.Date);
					bTime = new Date(b.Date);
					return aTime > bTime;
				} else if (!a.Date) {
					return true;
				} else if (!b.Date) {
					return false;
				}				
			});
			return Promise.all(filePromise);
		});
		Promise.all([collectionPromise, itemsPromise]).then( function (values) {
			data = {
				collection: collectionData,
				items: items
			};
			data.collection.imageUrl = imageUrl;
			data.attributes = [ {
				id: 'item-title', 
				label: 'Τίτλος',
				placeholder: 'Τίτλος',
				type: 'text'
			}, {
				id: 'item-subject', 
				label: 'Θέμα',
				placeholder: 'Θέμα',
				type: 'text'
			}, {
				id: 'item-description', 
				label: 'Σχόλια',
				placeholder: 'Περιγραφή',
				type: 'text'
			}, {
				id: 'item-date', 
				label: 'Χρόνος',
				placeholder: 'Ημερομηνία',
				type: 'text',
				extra: 'data-type=datetime'
			} ];
			data.submitText = 'Δημιουργία';
			data.submitId = 'add-item'; 
			data.upload = [ {
				label: 'Αρχείο',
				id: 'item-file'
			}];

			render(data);
			document.body.style.cursor = 'default';
		});
	};
	
	var removeItem = function(id, success) {
		BootstrapDialog.show({
			type: 'type-danger',
			title: 'Επιβεβαίωση',
			message: 'Να διαγραφεί η ηχογράφηση και όλα τα αρχεία;',
			buttons: [ {
				icon: 'glyphicon glyphicon-trash',
				label: 'Διαγραφή',
				cssClass: 'btn-danger',
				action: function (dialogItself) {
					client.delete('items', id, {key: key}).then( success );
					document.body.style.cursor = 'progress';
					dialogItself.close();
				}
			}, {
				label: 'Άκυρο',
				action: function (dialogItself) {
					dialogItself.close();
				}
			}]
		});
	};
	
	
	var addItem = function () {
		var data = {
			title: $('#item-title').val(),
			subject: $('#item-subject').val(),
			text: $('#item-description').val(),
			Date: $('#item-date').val()
		};
		var file = $('#item-file')[0].files[0];

		var sendData = {
			public: true,
			collection: {id: id},
			element_texts: []
		}
		
		for (i in data) {
			sendData.element_texts.push({
				html: false,
				text: data[i],          
				element: {
					id: ids[i]
				}
			});
		}
		
		return client.post('items', sendData, {key: key}).
			then( function (resp) {
				if ( file ) {
					return client.postFile(file, {item: {id: resp.id} }, {key: key});
				}
			});
		

	};
	
	getData();
	
	$('#single-collection').off().on('click', '.remove-item', function () {
		removeItem( $(this).data('id'),  getData);
	}).on('click', '#add-item', function () {
		addItem().then(getData);
	});
}
Handlebars.registerHelper('file', function (file) {
	var str = file.type === 'image' ? '<img src="' + file.urls.thumbnail + '">' :
			file.type === 'audio' ? '<audio src="' + file.urls.original + '" controls></audio>' :
			'<a href="' + file.urls.original + '">file</a>';
	return new Handlebars.SafeString(str);
});
Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;
    
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    
    result = operators[operator](lvalue, rvalue);
    
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('body').on('fileselect', '.btn-file :file', function(event, numFiles, label) {
        
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
        
    });
    
    $('body').on('click', '.hide-add-form', function () {
		$( this ).parents().parents().find('.add-form').slideToggle(300);
	});

});
$().ready(function () {
	routie({
		'collections/:id': function (id) {
			$('#router-container').animate({opacity: 0}, 300).promise().then( function () {			
			} ).then(function () {
				$('#collections').hide();
				$('#single-collection').show();
				singleCollection(id);
				$(this).animate({opacity: 1}, 300);
			});
		},
		'collections': function () {
			 $('#router-container').animate({opacity:0}, 300).promise().then( function () {
				$('#single-collection').hide();
				$('#collections').show();
				main();
			} ).then( function () {
				$(this).animate({opacity:1}, 300);
			})
			},
		'*': function () {
			routie('collections/');
		}	
		
	})
});

$().ready(function () {
// Grab the template script
	var theTemplateScript = $("#form-template").html();

	// Compile the template
	theForm = Handlebars.compile(theTemplateScript);

	var context = {
		attributes: [ {
			id: 'new-title', 
			label: 'Τίτλος',
			placeholder: 'Τίτλος',
			type: 'text'
		}, {
			id: 'new-subject', 
			label: 'Θέμα',
			placeholder: 'Θέμα',
			type: 'text'
		}, {
			id: 'new-description', 
			label: 'Σχόλια',
			placeholder: 'Περιγραφή',
			type: 'text'
		} ], 
		submitText: 'Δημιουργία',
		submitId: 'add-collection', 
		upload: [ {
			label: 'Εικόνα',
			id: 'new-image'
		}]
		
	};	

	// Pass our data to the template
	var theCompiledHtml = theForm(context);

	// Add the compiled html to the page
	$('#form-placeholder').html(theCompiledHtml);
});
