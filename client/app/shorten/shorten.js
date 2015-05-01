angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links) {
  // Your cøde here
  $scope.link = {
    url: ''
  };

  $scope.addLink = function (link) {
    $scope.link.url = link;

    Links.postLink($scope.link).then(function() {
      Links.linksRedirect()
    });
  }
});
