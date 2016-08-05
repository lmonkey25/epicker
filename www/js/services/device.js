angular.module('app')
.service('DeviceFile', function($cordovaFile, $ionicPlatform){
	this.writeAsJson = function(filename, json, cb){
		$ionicPlatform.ready(function() {
			$cordovaFile.writeFile(cordova.file.externalDataDirectory, filename, JSON.stringify(json), true).then(function(){
				cb(true);
			}, function(err){
				cb(false);
			});
		});
	};

	this.readAsJson = function(filename, cb){
		$ionicPlatform.ready(function(){
			$cordovaFile.checkFile(cordova.file.externalDataDirectory, filename).then(function(){
				$cordovaFile.readAsText(cordova.file.externalDataDirectory, filename).then(function(data){
					cb(true, JSON.parse(data));
				}, function(err){
					cb(false, null);
				});
			}, function(err){
				cb(false, null);
			});
		});
	};

	this.delete = function(filename, cb){
		$ionicPlatform.ready(function(){
			$cordovaFile.removeFile(cordova.file.externalDataDirectory, filename).then(function(){
				cb(true);
			}, function(err){
				cb(false);
			});
		});
	};
})
