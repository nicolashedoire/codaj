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
			var ctx = document.getElementById("myChart");
			var myChart = new Chart(ctx, {
			    type: 'bar',
			    data: {
			        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
			        datasets: [{
			            label: '# of Votes',
			            data: [12, 19, 3, 5, 2, 3],
			            backgroundColor: [
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(255, 206, 86, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)',
			                'rgba(255, 159, 64, 0.2)'
			            ],
			            borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)',
			                'rgba(255, 159, 64, 1)'
			            ],
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			});

			var data = {
			    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
			    datasets: [
			        {
			            label: "My First dataset",
			            backgroundColor: "rgba(179,181,198,0.2)",
			            borderColor: "rgba(179,181,198,1)",
			            pointBackgroundColor: "rgba(179,181,198,1)",
			            pointBorderColor: "#fff",
			            pointHoverBackgroundColor: "#fff",
			            pointHoverBorderColor: "rgba(179,181,198,1)",
			            data: [65, 59, 90, 81, 56, 55, 40]
			        },
			        {
			            label: "My Second dataset",
			            backgroundColor: "rgba(255,99,132,0.2)",
			            borderColor: "rgba(255,99,132,1)",
			            pointBackgroundColor: "rgba(255,99,132,1)",
			            pointBorderColor: "#fff",
			            pointHoverBackgroundColor: "#fff",
			            pointHoverBorderColor: "rgba(255,99,132,1)",
			            data: [28, 48, 40, 19, 96, 27, 100]
			        }
			    ]
			};

			var ctx = document.getElementById("twoChart");
			var Chart2 = new Chart(ctx, {
			    type: 'radar',
			    data: data
			});


			var data = {
			    datasets: [{
			        data: [
			            11,
			            16,
			            7,
			            3,
			            14
			        ],
			        backgroundColor: [
			            "#FF6384",
			            "#4BC0C0",
			            "#FFCE56",
			            "#E7E9ED",
			            "#36A2EB"
			        ],
			        label: 'My dataset' // for legend
			    }],
			    labels: [
			        "Red",
			        "Green",
			        "Yellow",
			        "Grey",
			        "Blue"
			    ]
			};
			var ctx = document.getElementById("threeChart");
			var Chart3 = new Chart(ctx, {
			    data: data,
			    type: 'polarArea',
			    options: {
        elements: {
            arc: {
                borderColor: "#000000"
            }
        }
    }
			});

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