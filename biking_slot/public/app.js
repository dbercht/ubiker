/* global angular: false, google: false, console: false, alert: false, window:false */
angular.module('ubarker', [
    'ui.map',
    'ui.event',
    'ngResource'
    ])
.service('Slots', function($resource) {
  return $resource('/slots/:latitude;:longitude', {latitude:'@latitude', longitude: '@longitude'});
})
.controller('UbarkerCtrl', function($scope, Slots, $window) {
  $scope.slots = [];
  $scope.loading = false;
  $scope.myMap = null;
  $scope.zoom = 13;
  $scope.mockLat = 37.725951;
  $scope.mockLong = -122.450339;
  $scope.userPosition = new google.maps.LatLng(37.7188951, -122.500339);
  $scope.selectedBikeSlot = null;

  var biciclyingLayer = new google.maps.BicyclingLayer();
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  $scope.mapOptions = {
    //zoomControl: false,
    streetViewControl: false,
    panControl: false,
    zoom: $scope.zoom,
    mapTypeId: google.maps.MapTypeId.RODMAP
  }; 

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
        $scope.myMarkers = [{'marker' : $scope.userMarker, 'slot' : false} ];
        $scope.slots = Slots.query({'latitude' : $scope.userPosition.lat(), 'longitude' : $scope.userPosition.lng()}, function(data) {
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
        $scope.loading = false;
      });
    }, function(error) {
      alert(error);
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
  }//;

  //Markers should be added after map is loaded
  $scope.onMapIdle = function() {
    if ($scope.myMarkers === undefined){
      directionsDisplay.setMap($scope.myMap);
      directionsDisplay.setPanel(document.getElementById("directions-panel"));
      biciclyingLayer.setMap($scope.myMap);
      $scope.userMarker = new google.maps.Marker({
        map: $scope.myMap,
        position: $scope.userPosition 
      });
      $scope.myMarkers = [$scope.userMarker, ];
    }
  };

  $scope.getLocation();
});
