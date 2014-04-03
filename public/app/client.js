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

            $scope.$on('image:choose', function(event, winner, looser){
                $http.get('/choose/'+winner._id+'/'+looser._id+'/').success(function(updatedWinner, updatedLooser){
                    var localWinner = _.find($scope.images, {_id: updatedWinner._id});
                    var localLooser = _.find($scope.images, {_id: updatedLooser._id});
                    _.assign(localWinner, updatedWinner)
                    _.assign(localLooser, updatedLooser)
                })
            })

			$scope.win = function(image){
                console.log("win");
				$scope.$emit('image:vote', 'win', image);
				// update()
			}
			$scope.lose = function(image){
				$scope.$emit('image:vote', 'lose', image);
				// update()
			}
            // chosen image
            $scope.choose = function(winner, looser){
                console.log("choose");
                console.log(winner);
                console.log(looser);
                $scope.$emit('image:choose', winner, looser);
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
