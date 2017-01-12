		var app = angular.module("coding" , ['ngRoute' , 'ui.bootstrap']);

	    // configure routes
	    app.config(function($routeProvider , $locationProvider) {

		    // delete ! prefix in url 
		    $locationProvider.hashPrefix("");

	        $routeProvider
	            .when('/', {
	                templateUrl : 'views/home.html',
	                controller  : 'homeController'
	            })
	            .when('/dashboard', {
	                templateUrl : 'views/dashboard.html',
	                controller  : 'dashboardController'
	            })
	            // route for the logout page
	            .when('/code', {
	            	templateUrl : 'views/code.html',
	            	controller : 'codeController'
	            })
	            .when('/tests', {
	                templateUrl  : 'views/tests.html',
	                controller : 'testsController'
	            })
	            .when('/database' , {
	                templateUrl : 'views/database.html',
	                controller : 'databaseController'
	            })
	            .when('/myaccount' , {
	                templateUrl : 'views/myaccount.html',
	                controller : 'myaccountController'
	            })
	            .when('/subscriptions' , {
	                templateUrl : 'views/subscriptions.html',
	                controller : 'subscriptionsController'
	            })
	            .otherwise({ redirectTo: '/login' });
	    });


	    // controllers
	    // 
		app.controller("codingCtrl" , function($scope , $location){
		    $scope.$watch(function(){
		       return $location.path(); 
		    }, function(newPath){
		        console.log(newPath);
		    });
		});

		app.controller("homeController" , function($scope , $location){

		});

		app.controller("dashboardController" , function($scope , $location){

		});

		app.controller("codeController" , function($scope , $location){

		});

		app.controller("testsController" , function($scope , $location){

		});

		app.controller("databaseController" , function($scope , $location){

		});

		app.controller("myaccountController" , function($scope , $location){

		});

		app.controller("subscriptionsController" , function($scope , $location){

		});