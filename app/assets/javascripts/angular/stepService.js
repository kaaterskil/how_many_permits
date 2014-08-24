(function StepServiceIIFE(){
  var StepService = function($http, $q){
    function getData(url){
      var deferred = $q.defer();

      $http.get(url)
      .success(function(data){
        deferred.resolve(data);
      }).error(function(data){
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getStepData(){
      return getData('/steps.json');
    }

    function getResponseData(){
      return getData('/responses.json');
    }

    return {
      getStepData : getStepData,
      getResponseData : getResponseData
    };
  };

  var app = angular.module('ISDApp.stepService', []);
  app.factory('StepService', StepService);
})();
