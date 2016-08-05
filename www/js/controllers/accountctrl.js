angular.module('app')
.controller('AccountCtrl', function($scope, $rootScope){
	$scope.updateCarrier = function(status){
		if(status == true){
			$rootScope.settings.car = false;
			$rootScope.settings.foot =  true;
		}else{
			$rootScope.settings.car = true;
			$rootScope.settings.foot =  false;
		}
	}
	$scope.save =  function(){
		
	}
});