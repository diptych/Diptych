angular.module('diptych', ['ngRoute'])

angular.module('diptych')
.config(['$routeProvider', '$locationProvider', 
function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/'});
}]);


angular.module('diptych').controller('RootController', function( $rootScope, $scope, $http ){


	
})
// .service('diptych.service', [ '$http', '$q', function( $http, $q ){


// 	return {
// 		get: function(){
// 			return $http.get('/photos')
// 		}
// 	}
// })
.directive('imagePair', [ '$rootScope', '$http', function( $rootScope, $http ){
	return {
		templateUrl: 'app/templates/diptych.html'
	,	controller: function($scope, $element){

			$scope.$on('image:vote', function(event, vote, image){
				$http.get('/image/'+image._id+'/'+vote).success(function( updatedImage ){
					var localImage = _.find( $scope.images, { _id: updatedImage._id } );
					// update all the image properties
					_.assign( localImage, updatedImage ) 
				})
			})

			$scope.win = function(image){
				$scope.$emit('image:vote', 'win', image);
				// update()
			}
			$scope.lose = function(image){
				$scope.$emit('image:vote', 'lose', image);
				// update()
			}


			function update(){
				$http.get('/photos').success(function(data){
					$scope.images = data
				})
			}
			update()
		}
	}
}])
