angular.module('app')
.controller('DetailCtrl', function($scope, API){
	var _pre = {
		init: function(){
			API.getStoreDetail(1).then(function(info){
				console.log(info);
				$scope.info = info[1];
			});

			API.getComments(1).then(function(comments){
				console.log(comments);
				$scope.comments = comments;
			});
		}
	};

	_pre.init();
});