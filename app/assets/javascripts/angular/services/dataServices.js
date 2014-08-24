(function(){
  var dataService = function($q, $http){
    function getData(url){
      var dfd = $q.defer();

      $http.get(url)
      .success(function(data){
        dfd.resolve(data);
      })
      .error(function(reason){
        dfd.reject(reason);
      });

      return dfd.promise;
    }

    return {
      getStepData : function(){
        return getData('/steps.json');
      },
      getResponseData : function(){
        return getData('/responses.json');
      }
    };
  };

  var module = angular.module('ISDApp.dataServices');
  module.service('DataService', dataService);
})();
