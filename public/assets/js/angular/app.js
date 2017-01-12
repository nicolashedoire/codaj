		var app = angular.module("coding" , ['ui.bootstrap'] , ($locationProvider)=> {
		    // delete ! prefix in url 
		    $locationProvider.hashPrefix("");
		});


		app.controller("codingCtrl" , function($scope , $location){
/*		    $scope.menu = menu;
		    
		    $scope.currentItem = null;
		    $scope.selectionMenu = function(item){
		        $scope.currentItem = item;
		    }*/
		    
		    $scope.$watch(function(){
		       return $location.path(); 
		    }, function(newPath){
		        console.log(newPath);
		    });
		});
