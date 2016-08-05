angular.module('app')

.service('HttpSvc', function($http, $q){
	this.post = function(url , data){
		data = Object.keys(data).map(function(key){ 
			  return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]); 
			}).join('&');

		var deferred = $q.defer();

		$http({
			url : url,
			method : "POST",
			data : data,
			headers : {
				'Content-Type' : 'application/json;charset=utf-8'				
			}                   	
		}).success(function(data, status, headers, config){
			console.log(data);
			deferred.resolve(data);
		}).error(function(data, status, headers, config){
			console.log(data);
			deferred.reject(data);
		});

		return deferred.promise;
	};

	this.get = function(url){
		var deferred = $q.defer();

		$http({
			url : url,
			method : "GET"  	
		}).success(function(data, status, headers, config){
			deferred.resolve(data);
		}).error(function(data, status, headers, config){
			deferred.reject(data);
		});

		return deferred.promise;
	};
})

.service('API', function(HttpSvc, $q){
	this.getStores = function(){
		var deferred = $q.defer();
		HttpSvc.get(urls.getstores).then(function(stores){
			console.log(stores);			
			deferred.resolve(JSON.parse(stores));
		}, function(err){
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}

	this.getStoreDetail = function(id){
		var deferred = $q.defer();
		HttpSvc.get(urls.getstores + "/" + id).then(function(stores){
			console.log(stores);			
			deferred.resolve(JSON.parse(stores));
		}, function(err){
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}

	this.getComments = function(storeid){
		var deferred = $q.defer();
		HttpSvc.get(urls.getcomments + storeid).then(function(comments){
			console.log(comments);
			deferred.resolve(JSON.parse(comments));
		}, function(err){
			console.log(err);
			deferred.reject(err);
		});

		return deferred.promise;
	}
})