angular.module('diptych', ['ngRoute'])

angular.module('diptych')
.config(['$routeProvider', '$locationProvider',
function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/'});
}]);

angular.module('diptych').controller('RootController', function( $rootScope, $scope, $http ){

// call('/photo/'+ exculsion1 + "/" + exclusion2)
// present duplicate images

})
.directive('imagePair', [ '$rootScope', '$http', function( $rootScope, $http ){
	return {
		templateUrl: 'app/templates/diptych.html'
	,	controller: function($scope, $element){
            $scope.keep = function(winner){
                var looser =_.reject( $scope.images, winner ).pop()
                $http.get('/keep/'+winner._id+'/'+looser._id)
                .success(function(updated, status){
                    var localWinner = _.find($scope.images, {_id: updated.winner._id});
                    var localLooser = _.find($scope.images, {_id: updated.looser._id});
                    _.assign(localWinner, updated.winner)
                    _.assign(localLooser, updated.looser)
                    fetchPair().then(function(data){
                        // prevent duplicate image display
                        data = _.reject(data, _.pick(looser, '_id') )
                        // replace loosing image
                        _.assign(localLooser, data.pop() )
                    })
                })
            }
            $scope.lose = function(looser){
                var winner =_.reject( $scope.images, looser ).pop()
                $scope.keep(winner)
            }
            $scope.toss = function(images){
                $http.get('/toss/'+images[0]['_id']+'/'+images[1]['_id'])
                .success(function(updated, status){
                    // matches returned images to local copy and updates
                    _(updated).each(function(updatedImage){
                        var localImage = _.find($scope.images
                            , _.pick(updatedImage, '_id') // get object {_id}
                        )
                        _.assign(localImage, updatedImage) //updates object
                    })
                    update();
                })
            }
            $scope.pair = function(images){
                $http.get('/pair/'+images[0]['_id']+'/'+images[1]['_id'])
                .success(function(updated, status){
                    _(updated).each(function(updatedImage){
                        var localImage = _.find($scope.images
                            , _.pick(updatedImage, '_id') // get object {_id}
                        )
                        _.assign(localImage, updatedImage) //updates object
                    })
                    update();
                })
            }

            function update(){
                fetchPair().then(function(data){
                    $scope.images = data
                })
            }

            function fetchPair(){
                return $http.get('/photos')
                .then(function(response){
                    return response.data
                })
            }



			update()
		}
	}
}])

.directive('gallery', [ '$rootScope', '$http', function( $rootScope, $http ){
        return { 
            templateUrl: 'app/templates/gallery.html', 
            controller: function($scope, $element){

                function update(){
                    fetchRank().then(function(data){
                    $scope.rankImages = data
                    })
                }

                function fetchRank(){
                    return $http.get('/rank')
                    .then(function(response){
                        return response.data
                    }) 
                }

                update()
            }
        }
    }])
