(function ResultsHelperIIFE(){
  var ResultsHelper = function(){

    //---------- Private functions ----------//

    function addResults($scope, permitName, text, resources){
      permit = findPermit($scope, permitName);
      if(typeof permit === 'undefined') {
        permit = {name: permitName, checklist: [], resources: []}
        $scope.resultset.push(permit);
      }
      doAddResults(permit, text, resources);
    }

    function findPermit($scope, name) {
      for(var i = 0; i < $scope.resultset.length; i += 1) {
        var target = $scope.resultset[i];
        if(target.name === name) {
          return target;
        }
      }
      return undefined;
    }

    function doAddResults(permit, text, resources) {
      if(text !== '' && text.length > 0) {
        permit.checklist.push(text);
      }
      if(resources !== '' && resources.length > 0) {
        permit.resources.push(resources);
      }
    }

    //---------- Public functions ----------//

    function setResults($scope, response){
      var requiredPermits = response.requiredPermits(),
      text = response.resultText(),
      resources = response.resultResource();

      if(typeof requiredPermits !== 'undefined' && requiredPermits.length > 0) {
        for(var j = 0; j < requiredPermits.length; j += 1) {
          addResults($scope, requiredPermits[j], text, resources);
        }
      } else {
        addResults($scope, 'General', text, resources);
      }
    }

    return {
      setResults: setResults
    };
  };

  var app = angular.module('ISDApp.resultsHelper', []);
  app.factory('resultsHelper', ResultsHelper);
})();
