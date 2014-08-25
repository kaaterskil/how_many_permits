(function IndexControllerIIFE($){
  var IndexController = function($scope, steps, stepManager){

    function init(name){
      stepManager.setStore(steps)
      $scope.resultset = [];
      reset(stepManager.get(name));
      stepManager.initializeWheel();
    }

    function reset(step){
      $scope.step = step;
      $scope.question = step.text();
      $scope.responses = step.responses();
      $scope.responseText = '';
      $scope.nextStep = undefined;
      $scope.showResponse = false;
      $scope.continueBtnText = step.continueBtnText();
    }

    init('Welcome');

    $scope.execute = function(response){
      $scope.nextStep = $scope.step.execute(response);
      $scope.responseText = response.resultText();
      $scope.resources = response.resultResource();
      $scope.showResponse = true;
      resultsHelper.setResults($scope, response);
    }

    $scope.continue = function(){
      if($scope.responses.length === 1) {
        $scope.nextStep = $scope.step.execute($scope.responses[0]);
      }
      reset($scope.nextStep);
      $(':radio').prop('checked', false);
    }
  };

  var app = angular.module('ISDApp.controllers');
  app.controller('indexController', IndexController);
})(jQuery);
