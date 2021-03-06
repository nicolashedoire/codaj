angular.module('digital.speech', []).
    factory('speech', function () {
        if(window.speechSynthesis) {
            var msg = new SpeechSynthesisUtterance();
        }
        function getVoices() {
            window.speechSynthesis.getVoices();
        	return window.speechSynthesis.getVoices();
        }
  
        function sayIt(text, config) {
            var voices = getVoices();
         
            //choose voice. Fallback to default
            msg.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
            msg.volume = config && config.volume ? config.volume : 1;
            msg.rate = config && config.rate ? config.rate : 1;
            msg.pitch = config && config.pitch ? config.pitch : 1;

            //message for speech
            msg.text = text;
            speechSynthesis.speak(msg);
        }

        return {
            sayText: sayIt,
            getVoices: getVoices
        };
});

angular.module('digital.recognition' , []).
	factory('recognition' , function ($rootScope,$timeout) {
		var recognizer;
		window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
		try{
			recognizer = new window.SpeechRecognition();
			recognizer.continuous = true;
			recognizer.interimResults = false;
			recognizer.maxAlternatives = 0;
			recognizer.interimResults = 'interim';
		}catch(e){
			console.log(e);
		}

		function start () {
			try {
				recognizer.start();
			} catch(e) {
				console.log(e);
			}
		}

		function stop (){
			if(recognizer !== undefined){
				try{
			    	recognizer.stop();
			    }catch(e){
			    	console.log(e);
			    }
			}
		}

		function getResults () {
			var items = [];
			recognizer.onresult = function(event) {
				res = '';
				for (var i = event.resultIndex; i < event.results.length; i++) {
				   	if (event.results[i].isFinal) {
				    	res += event.results[i][0].transcript;
				    } else {
				    	res += event.results[i][0].transcript;
				    }
				} 
				items = res.split(' ');	
				console.log(items);
				$rootScope.$watch(function () {
			        return $rootScope.inputModel.sentence = items;
			    }, function (value) {
			        console.log("inputModel.sentence changed");
			    });   
			}

		}

		recognizer.onsoundend = function(event) {
				console.log(event);
		}

		recognizer.onaudioend = function(event) {
				console.log(event);
		}

		recognizer.onend = function(event) {
			console.log(event);
			console.log('la session est terminée');
			$rootScope.$watch(function () {
			        return $rootScope.inputModel.sentence = '';
			}, function (value) {
			        console.log("inputModel.sentence changed");
			});   
		}

		recognizer.onnomatch = function(event) {
			console.log(event);
		}

		recognizer.onerror = function(event) {
			console.log(event);
		}

		return {
			start : start, 
			stop : stop,
			getResults : getResults
		};
	});


		var app = angular.module("coding" , ['ngRoute' , 'ui.bootstrap' , 'ui-notification'  , 'digital.speech' , 'digital.recognition']);
	    // configure routes
	    app.config(function($routeProvider , $locationProvider , $interpolateProvider , NotificationProvider) {
	    	// Change brackets {{}} to {[{}]} (because use twig)
	    	$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
		    
		    // Notifications module config
	        NotificationProvider.setOptions({
	            delay: 3000,
	            startTop: 20,
	            startRight: 10,
		            verticalSpacing: 20,
		            horizontalSpacing: 20,
	            positionX: 'right',
	            positionY: 'bottom'
	        });

		    $locationProvider.hashPrefix("");
	    });

	    // controllers
		app.controller("codingCtrl" , function($scope , $location , $http , $uibModal , Notification){

			$scope.selectedCategory = "Categories";
			$scope.selectCategoryId = 0;

			$scope.selectCategory = function(category , id){
				$scope.selectedCategory = category;
				$scope.selectCategoryId = id;
			}

	        $http({
	            method: 'GET',
	            url: '/listTechnologies'
	        }).then(function successCallback(response) {
	            $scope.categories = response.data;
	        }, function errorCallback(err) {
	            console.log(err);
	        });

			// WATCHER ON URL
			
			$scope.arianeUrl = '';
			$scope.arianeText = '';

		    $scope.$watch(function(){
		       return $location.path(); 
		    }, function(newPath){
		        $scope.arianeUrl = newPath;
		        $scope.arianeText = newPath.replace("/", "");
		        if($scope.arianeText.indexOf("/") !== -1){
		        	var path = $scope.arianeText;
		        	path = path.replace('technology/' , '');
		        	$scope.arianeText = path;
		        }
		    });
		});

		app.controller("homeController" , function($scope , $location){
			$scope.buttonDiscover = 'Discover';
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
			console.log('je suis dans le controller code');
		});

		app.controller("testsController" , function($scope , $location){
			console.log('je suis dans le controller tests');
		});

		app.controller("databaseController" , function($scope , $location , $http){
			console.log('je suis dans le controller database');
			$scope.titleQuestions = 'Liste des questions';
	        $scope.sortType     = 'name'; // set the default sort type
  			$scope.sortReverse  = false;  // set the default sort order
  			$scope.searchQuestion   = '';     // set the default search/filter term
		});

		app.controller('detailsTechnologyController' , function($scope, $location,$http, $routeParams){
			$scope.itemName = $routeParams.itemName;
			$scope.results = false;
			$scope.noResults = 'il n\'y a pas encore de questions pour cette technologie...';
			$http({
	            method: 'GET',
	            url: '/listQuestions/' + $routeParams.itemName
	        }).then(function successCallback(response) {
	            if(response.data.length > 0){
	            	$scope.questions = response.data;
	            	$scope.results = true;
	            }
	        }, function errorCallback(err) {
	            console.log(err);
	        });
		});

		app.controller('speechCtrl', function ($scope, $timeout, $interval , $rootScope, speech , recognition) {
			console.log('je suis dans le controller speech');
      		$scope.support = false;
      		if(window.speechSynthesis) {
        		$scope.support = true;                                    
		    	$timeout(function () {
		    		$scope.voices = speech.getVoices();          
		    	}, 500);  
		    }

        	$scope.pitch = 1;
        	$scope.rate = 1;           
        	$scope.volume = 1;

        	$rootScope.inputModel = {
        		sentence: ''
    		};


        	$scope.initRecognition = function () {
        		if(window.SpeechRecognition){
        			recognition.start();
        			$interval(function(){
	        			$rootScope.inputModel = {
	        				sentence: recognition.getResults()
	    				};
        			} , 0);
        		}

/*        		$timeout(function(){
        			$scope.stopRecognition();
        		} , 10000);*/
        	}

        	$scope.stopRecognition = function () {
        		if(window.SpeechRecognition){
        			recognition.stop();
		        	$rootScope.inputModel = {
			        	sentence: ''
			    	};
        		}
/*        		$timeout(function(){
        			$scope.initRecognition();
        		} , 500);*/
        	}
      
	        $scope.submitEntry = function () {
	            var voiceIdx = $scope.voices.indexOf($scope.optionSelected),
	                config = {
	                  voiceIndex: voiceIdx,
	                  rate: $scope.rate,
	                  pitch: $scope.pitch,
	                  volume: $scope.volume
	                };

	            if(window.speechSynthesis) {
	                speech.sayText($scope.msg, config);
	            }
	        }
    	});

		app.controller('detailsQuestionController' , function($scope, $location, $http, $routeParams){
			// TODO
		})

		app.controller("myaccountController" , function($scope , $location){
			console.log('je suis dans le controller myaccount');
			$scope.myaccountTitle = 'Account';
			$scope.profileTitle = 'Profile';
			$scope.updateProfile = 'Update profile';
			$scope.paymentTitle = 'Payment method';
			$scope.billingAdress = 'Billing Adress';
		});

		app.controller("subscriptionsController" , function($scope , $location){

		});


		// directive to focus input field
		app.directive('focus',
			function($timeout) {
			 return {
			 scope : {
			   trigger : '@focus'
			 },
			 link : function(scope, element) {
			  scope.$watch('trigger', function(value) {
			    if (value === "true") {
			      $timeout(function() {
			       element[0].focus();
			      });
			   }
			 });
			 }
			};
		});


	app.controller('ModalDemoCtrl', function ($scope , $http , $uibModal, $log, $document , Notification) {


			$scope.class = "start";
			$scope.microphone = "fa-microphone";
			$scope.startRecognition = function(){
  			 	if ($scope.class === "start"){
      				/*recognition.start();*/
      				$scope.class = "stop";
      				$scope.microphone = "fa-microphone-slash";
  			 	}
    			else{
    				/*recognition.stop();*/
      				$scope.class = "start";
      				$scope.microphone = "fa-microphone";
    			}			
			}



	$scope.postQuestion = function(){
		if($scope.bigData.postQuestion && $scope.question !== ''){
			console.log('post question');
			$http({
			    url: 'insertQuestion',
				method: 'POST',
				data: { 
					question : $scope.question ,
					technologieId : $scope.selectCategoryId
				}
			}).then((response) => { 
					Notification.success('Question enregistrée avec success');
					$scope.question = '';
				} , function(error){
					Notification.error({message: 'Une erreur est survenue...', positionY: 'bottom', positionX: 'right'});
			});
		}
	}

	$scope.bigData = {};
	$scope.bigData.postQuestion = false;
	$scope.bigData.getResponse = false;
	$scope.bigData.searchPlaceholder = 'Posez une question et choisissez une catégorie';

	$scope.$watch('bigData.postQuestion ', function(newValue, oldValue){
		$scope.question = '';
		if(newValue){
			$scope.bigData.searchPlaceholder = 'Poster une question';
		}else{
			$scope.bigData.searchPlaceholder = 'Posez une question et choisissez une catégorie';
		}
	});

	$scope.$watch('question' , function(val){
		/*console.log(val);*/
		// TODO for validate string
	});


  var $ctrl = this;
  $ctrl.item = '';
  $ctrl.createcategory = 'Create new category';
  $ctrl.animationsEnabled = false;

  $ctrl.open = function (size, parentSelector) {
    var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        item: function () {
          return $ctrl.item;
        },
        createcategory : function () {
        	return $ctrl.createcategory;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        item: function () {
          return $ctrl.item;
        },
        createcategory : function () {
        	return $ctrl.createcategory;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };

  $ctrl.openMultipleModals = function () {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'stackedModal.html',
      size: 'sm',
      controller: function($scope) {
        $scope.name = 'bottom';  
      }
    });

    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title-top',
      ariaDescribedBy: 'modal-body-top',
      templateUrl: 'stackedModal.html',
      size: 'sm',
      controller: function($scope) {
        $scope.name = 'top';  
      }
    });
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($uibModalInstance, item , createcategory) {
  var $ctrl = this;
  $ctrl.item = item;
  $ctrl.createcategory = createcategory;
  $ctrl.selected = {
    item: $ctrl.item
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

// Please note that the close and dismiss bindings are from $uibModalInstance.

app.component('modalComponent', {
  templateUrl: 'myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
      $ctrl.item = $ctrl.resolve.item;
      $ctrl.createcategory = $ctrl.resolve.createcategory;
      $ctrl.selected = {
        item: $ctrl.item
      };
    };

    $ctrl.ok = function () {
      $ctrl.close({$value: $ctrl.selected.item});
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
}); 
