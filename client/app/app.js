angular.module('shortly', [
  // 'shortly.services',
  // 'shortly.links',
  // 'shortly.shorten',
  // 'shortly.auth',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  // $routeProvider
    // .when('/signin', {
    //   templateUrl: 'app/auth/signin.html',
    //   controller: 'AuthController'
    // })
    // .when('/signup', {
    //   templateUrl: 'app/auth/signup.html',
    //   controller: 'AuthController'
    // })
    // // Your cºde here
    // .when('/links', {
    //   templateUrl: 'app/links/links.html',
    //   controller: 'LinksController'
    // })
    // .when('/shorten', {
    //   templateUrl: 'app/shorten/shorten.html',
    //   controller: 'ShortenController'
    // })
    // .when('/logout', {
    //   templateUrl: 'app/auth/signin.html',
    //   controller: 'AuthController'
    // })
    // .otherwise({
    //   redirectTo: '/links'
    // })

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    // $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  /*$rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });*/


  if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
  }

  var context = new AudioContext();
  var audioBuffer;
  var sourceNode;


  var setupAudioNodes = function () {
      // create a buffer source node
      sourceNode = context.createBufferSource();

      // and connect to destination
      sourceNode.connect(context.destination);
  };

  var playSound = function (buffer) {
      sourceNode.buffer = buffer;
      sourceNode.start(0);
  };

  // load the specified sound
  var loadSound = function (url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // When loaded decode the data
      request.onload = function() {

          // decode the data
          context.decodeAudioData(request.response, function(buffer) {
              // when the audio is decoded play the sound
              playSound(buffer);
          }, onError);
      }
      request.send();
  };


  // log if an error occurs
  var onError = function (e) {
      console.log("error:", e);
  };

  // load the sound
  loadSound("NewWaveBossaNova.mp3");
  // setupAudioNodes();



    // setup a javascript node
    var javascriptNode = context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    // analyser2 = context.createAnalyser();
    // analyser2.smoothingTimeConstant = 0.0;
    // analyser2.fftSize = 1024;

    // create a buffer source node
    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();

    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);

    // connect one of the outputs from the splitter to
    // the analyser
    splitter.connect(analyser,0,0);
    // splitter.connect(analyser2,1,0);

    // we use the javascript node to draw at a
    // specific interval.
    analyser.connect(javascriptNode);

    // and connect to destination
    sourceNode.connect(context.destination);
    //console.log("inside", analyser);












  // setup a javascript node
  //javascriptNode = context.createScriptProcessor(2048, 1, 1);

  //console.log(javascriptNode);

  var getAverageVolume = function (array) {
    //console.log("here");
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    //console.log("array", array);

    average = values / length;
    return average;
  };

  // when the javascript node is called
  // we use information from the analyzer node
  // to draw the volume
  javascriptNode.onaudioprocess = function(e) {
  var barRemove = function () {
    d3.select(".visual")
    .selectAll("div").remove();
  };
    // get the average, bincount is fftsize / 2
    // var array =  new Uint8Array(analyser.frequencyBinCount);
    // analyser.getByteFrequencyData(array);

    analyser.maxDecibels = -30;
    analyser.minDecibels = -100;

    var array = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(array);

    //console.log(array);

    var average = getAverageVolume(array)
  var x = d3.scale.linear()
    .domain([0, d3.max(array)])
    .range([0, 420]);

  var barRender = function() {
    d3.select(".visual")
    .selectAll("div")
      .data(array)
    .enter().append("div").attr("class", "bar")
      .style("width", function(d) { return (x(d) - 400) * 0.75 + "px"; })
      .style("height", function(d) { return 1 + "px"});
  };
  barRemove();
  barRender();
  };  

});
