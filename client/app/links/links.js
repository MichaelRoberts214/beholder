angular.module('shortly.links', [])

.controller('LinksController', function ($scope, Links) {

  $scope.data = {
    links: []
  };

  $scope.incrementVisits = function(link){
    // on click
    // increment $scope.data.visits
    ++link.visits;
    // profit!
    // server sending time

  };


  $scope.getLinks = function(){

    Links.getLinks().then(function(promise){
      $scope.data.links = promise;
      console.log('promise', $scope.data.links);
    });

  };
  $scope.getLinks();
});
