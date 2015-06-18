<!doctype html>
<html lang="en" ng-app='archive'>
<head>
  <meta charset="utf-8">
  <title>Archive admin</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-resource.js"></script>
<!--
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
-->
  <script src="javascript/app.js"></script>
  
</head>
<body>
   <div class="container-fluid">
      <div class="page-header">Header {{'yeah'}}</div>
      <div ng-controller="CollectionController as collections" >
         <div ng-repeat="collection in collections.list" class="col-md-3">
            <div class="panel panel-default fixed-height">
               <div class="panel-heading">
               <h4 ng-repeat="attribute in collection.element_texts |filter: {element: {id: 50} }" >
                  {{attribute.text}}
                  <span class="glyphicon glyphicon-remove btn btn-link pull-right"></span>
               </h4>
               </div>
               <div class="panel-body scroll-y">
                  <div>items: {{collection.items.count}}</div>
                  <div ng-repeat="attribute in collection.element_texts |filter: {element: {id: 41} }">
                     {{attribute.text}}
                  </div>
                  <div>id: {{collection.id}}</div>
               </div>
            </div>
         </div>
         <div class="col-md-3">
			<div class="panel panel-success add-item">
				<span class="glyphicon glyphicon-plus btn btn-link huge"></span>
			</div>
         </div>
      </div>
   </div>
</body>
</html>

