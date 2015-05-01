angular.module('shortly.services', [])

.factory('Links', function ($http, $location) {

  var getLinks = function () {
    return $http({
      method: 'GET',
      url: '/api/links',
    }).then(function (resp) {
      console.log("data ", resp.data);
      return resp.data;
    })
  };

  var postLink = function (link) {
    return $http({
      method: 'POST',
      url: '/api/links',
      data: link
    }).then(function (resp) {
      console.log("link ", resp.data);
      return resp.data;
    })
  };

  var linksRedirect = function () {
    $location.path('/links');
  }

  return {
    getLinks: getLinks,
    postLink: postLink,
    linksRedirect: linksRedirect
  };
})

.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server

  // hijack this to make loadSound
  // var loadSound = function (url) {
  //       // var request = new XMLHttpRequest();
  //       // request.open('GET', url, true);
  //       // request.responseType = 'arraybuffer';
 
  //       // // When loaded decode the data
  //       // request.onload = function() {
 
  //       //     // decode the data
  //       //     context.decodeAudioData(request.response, function(buffer) {
  //       //         // when the audio is decoded play the sound
  //       //         playSound(buffer);
  //       //     }, onError);
  //       // }
  //       // request.send();
  //     return $http({
  //       method: 'GET',
  //       url: 'http://cf-media.sndcdn.com/323B2oVdm0iI.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vMzIzQjJvVmRtMGlJLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE0MjU5Mjg5ODd9fX1dfQ__&Signature=uaCWHgmAWq3ivajOEBJjmOViqHHDaJkTNW06EnvS7bkXDa9p3vgLI6bmN9NafCL9vUj-qQUx3gel99Why8-hd1rPuGxLPzQi0HKxWW~lRgNVqDRHGnYYJqO~fX1msXA1h0ZMtBldxswIB4FMn2SqcMqMie7vw8sF6rDO4kawfrJIIIWYDElUAMZWxtl4SNA3Nv37cxnSLLFHiOxzFljYq7THWYsIrTyMUKub09D9vKRiuF019WM1Vwigze4B~TLbFGbecNcw9nH3tiso9VGNR61~cl1ClxFbKeO3nBZ82AvPdfoo6TfcV5YXuOQ-lYBl77gvRNGzA2i5l9LI5hWhBA__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ',
  //       data: user
  //     })
  //     .then(function (resp) {
  //       return resp.data
  //     })
  //   };



  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shortly');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shortly');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
