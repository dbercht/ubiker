/* global angular: false, google: false, console: false, alert: false, window:false */
angular.module('ubiker', [
    'ui.map',
    'ui.event',
    'ngResource'
    ])

/**
 * Slots service
 */
.service('Slots', function($resource) {
  return $resource('/slots/:latitude;:longitude', {latitude:'@latitude', longitude: '@longitude'});
})

.service('SlotRequests', function($resource) {
  return $resource('/slots/:id/requests', {id:'@id'});
})

.service('Ratings', function($resource) {
  return $resource('/slots/:id/ratings', {id: '@id'});
})

/**
 * Config service for maps
 */
.service('Config', function() {
  var maps = {
    //zoomControl: false,
    streetViewControl: false,
    panControl: false,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.RODMAP
  };
})

/**
 * Auth factory holding global Auth information
 */
.factory('Auth', function(UserSession) {
  var currentUser = { isLoggedIn : false, user : {}, error: false};

  var login = function(user) {
   UserSession.save({email : user.email, password: user.password}, function(response) {
     console.log(response);
      currentUser.isLoggedIn = true;
      currentUser.user = response.user;
      currentUser.error = false;
    }, function(response){
      currentUser.isLoggedIn = false;
      currentUser.user = {}; 
      currentUser.error = "Wrong/Invalid email/password combination.";
    });
  };

  var logout = function() {
    UserSession.delete({}, function() {
      currentUser.isLoggedIn = false;
      currentUser.user = {},
      currentUser.error = false 
    });
  };  

  return {
    login : login,
    logout : logout,
    currentUser : currentUser
  };
})

/**
 * User service for login/logout 
 */
.service('UserSession', function($resource) {
  return $resource('/login');
})

/**
 * User service for login/logout 
 */
.service('User', function($resource) {
  return $resource('/users');
})

/**
 * Controllers for logging in and signing up
 */
.controller('UserCtrl', function($scope, User, UserSession, Auth) {
  $scope.user = {email: "", password : ""};
  $scope.currentUser = Auth.currentUser;
  $scope.signupInfo = {email : "", password : "", username : "" };

  $scope.$watch(function () {
    return Auth.currentUser;
  }, function (currentUser) {
    $scope.currentUser = currentUser;
    console.log($scope.currentUser);
  });

  $scope.signup = function() {
    User.save($scope.signupInfo, function(response) {
      if (response.status < 300) {
        $scope.login($scope.signupInfo);
      } else {
        Auth.currentUser.error = "Please verify your inputs.";
      }

    }, function(response) {
      console.log(response);
      if (response.status === 400) {
        Auth.currentUser.error = "Please verify your inputs.";
      } else {
        Auth.currentUser.error = "Entered e-mail already registered.";
      }
    });
  };

  $scope.login = function(user) {
    if (user === undefined) user = $scope.user;
    Auth.login(user);
  };

})

.controller('AuthCtrl', function($scope, Auth) {
  $scope.currentUser = Auth.currentUser;

  $scope.$watch(function () {
    return Auth.currentUser;
  }, function (currentUser) {
    $scope.currentUser = currentUser;
    console.log($scope.currentUser);
  });

  $scope.logout = function() {
    Auth.logout();
  };
  
})

.controller('SlotCtrl', function($scope, Auth, SlotRequests, Ratings) {
  $scope.currentUser = Auth.currentUser;
  $scope.currentSlotRequested;
  $scope.ratedSlots = {};

  $scope.$watch(function () {
    return Auth.currentUser;
  }, function (currentUser) {
    $scope.currentUser = currentUser;
    console.log($scope.currentUser);
  });

  $scope.requestSlot = function(slot) {
    if (confirm("Make this your current requested spot?")) {
      $scope.currentSlotRequested = slot;
      SlotRequests.save({id: slot.id});
      console.log("Updated slot");
    }
  };
  $scope.rateSlot = function(slot, rating) {
    var ratingTotal = parseInt(slot.rating)*parseInt(slot.num_ratings);
    ratingTotal = isNaN(ratingTotal) ? 0 : ratingTotal;
    var newRating =  (ratingTotal + rating)/(parseInt(slot.num_ratings)+1); 
    slot.rating = newRating; 
    slot.num_ratings = parseInt(slot.num_ratings) + 1;
    Ratings.save({id: slot.id, rating: rating}); 
    $scope.ratedSlots[slot.id] = true;
  }

  
})
.controller('UbikerCtrl', function($scope, Slots, $window, Config, Auth) {
  $scope.slots = [];
  $scope.search = {placement :[]};
  $scope.loading = false;
  $scope.mapLoading = true;
  $scope.myMap = null;
  $scope.zoom = 13;

  $scope.mockLat = 37.725951;
  $scope.mockLong = -122.450339;
  $scope.userPosition = new google.maps.LatLng(37.7188951, -122.500339);
  $scope.selectedBikeSlot = null;

  var biciclyingLayer = new google.maps.BicyclingLayer();
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  $scope.mapOptions = Config.maps;

  $scope.getLocation = function(keepDestination) {
    console.log("Getting lcoation");
    $scope.loading = true;
    $window.navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function() {
        $scope.userPosition = new google.maps.LatLng($scope.mockLat, $scope.mockLong);
        //$scope.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.myMap.panTo($scope.userPosition);
        if ($scope.userMarker !== undefined) {
          $scope.userMarker.setPosition($scope.userPosition);
        }
        $scope.updateMarkers(keepDestination);
        $scope.loading = false;
      });
    }, function(error) {
      alert(error);
    });
  };
  $scope.updateMarkers = function(keepDestination) {
    for (var i = 1; i < $scope.myMarkers.length; i++) {
      $scope.myMarkers[i].marker.setMap(null);
    }
    $scope.myMarkers = [];
    $scope.myMarkers.push({'marker' : $scope.userMarker, 'slot' : false});
    $scope.slots = Slots.query(
        {'latitude' : $scope.userPosition.lat(), 'longitude' : $scope.userPosition.lng(), 'placement' : $scope.search.placement.join(",")}, 
        function(data) {
          for(var i = 0; i < data.length; i++) {
            var pos = new google.maps.LatLng(data[i].latitude, data[i].longitude);
            var obj = {'marker' : new google.maps.Marker({ map: $scope.myMap, position: pos}),'slot': data[i]};
            $scope.myMarkers.push(obj);
            //Now select the closest one
            if (i === 0 && keepDestination !== true) {
              $scope.setDestination(obj);
            }
          }
        });
  };

  $scope.$watch('zoom', function() {
    $scope.myMap.setZoom($scope.zoom);
  });

  $scope.setDestination = function(obj) {
    console.log("Changing destination");
    $scope.selectedBikeSlot = obj;
    var request = {
      origin: $scope.userPosition,
      destination: $scope.selectedBikeSlot.marker.getPosition(),
      travelMode: google.maps.TravelMode.BICYCLING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  };

  //Markers should be added after map is loaded
  var instantiated = false;
  $scope.onMapIdle = function() {
    if (!instantiated) {
      $scope.getLocation();
      $scope.mapLoaded = true;
      instantiated = true;
      directionsDisplay.setMap($scope.myMap);
      directionsDisplay.setPanel(document.getElementById("directions-panel"));
      biciclyingLayer.setMap($scope.myMap);
    }
    if ($scope.myMarkers === undefined){
      $scope.userMarker = new google.maps.Marker({
        map: $scope.myMap,
        position: $scope.userPosition ,
        title: "This is you"
      });
      $scope.myMarkers = [$scope.userMarker, ];
    }
  };
  $scope.repeat = function(n) { 
    if (n == 0) return null;
    return new Array(n);
  };
});
