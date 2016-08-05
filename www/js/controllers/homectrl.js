angular.module('app')
.controller('HomeCtrl', function($scope, $cordovaGeolocation, API){

	var _pre = {
		init: function(){
			var options = {
				timeout: 10000,
				enableHighAccuracy: true
			};

			$cordovaGeolocation.getCurrentPosition(options).then(function(pos){
				console.log(pos);

				var myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				var mapOptions = {
					center: myLatLng,
					zoom: 12,
					disableDefaultUI: true
				};

				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

				var curMarker = new google.maps.Marker({
					position: myLatLng,
					icon: 'img/pin2.png'
				});
				curMarker.setMap($scope.map);

				_pre.getStores();
			});
		},

		getStores: function(){
			API.getStores().then(function(stores){
				for(var key in stores){					
					storePos = new google.maps.LatLng(stores[key].lattitude, stores[key].longitude);
					storeMarker = new google.maps.Marker({
						position: storePos,
						icon: 'img/pin1.png'
					});
					storeMarker.setMap($scope.map);
					storeMarker.set('data', stores[key]);

					google.maps.event.addListener(storeMarker, 'click', function(){
						var data = this.get('data');
						var content = "";
						content +="<a href='#/tab/detail'>" + data.name + "</a>";
						var d = parseInt(data.rating);
						content +="<p style='text-align: right'>";
						for(var i = 0; i < d; i++){
							content +="<span style='font-size:150%;color:#e4e3ae'>&starf;</span>";
						}
						content +="</p>";

						if($scope.iw){
							$scope.iw.close();
							$scope.iw = null;
						}

						$scope.iw = new google.maps.InfoWindow({
							content: content
						});
						$scope.iw.open($scope.map, this);
					});
				}
			});
		}
	};	
	
	_pre.init();
});