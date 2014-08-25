(function IndexControllerIIFE($){
  var IndexController = function($scope, steps, stepManager){

    function init(stepTitle){
      $scope.resultset = [];
      stepManager.setStore(steps);
      stepManager.initializeWheel();
      reset(stepTitle);
    }

    function reset(stepTitle){
      var step = stepManager.get(stepTitle);
      $scope.step = step;
      $scope.question = step.text();
      $scope.responses = step.responses();
      $scope.responseText = '';
      $scope.nextStep = undefined;
      $scope.showResponse = false;
      $scope.continueBtnText = step.continueBtnText();
      stepManager.spin(stepTitle);
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
      reset($scope.nextStep.title());
      $(':radio').prop('checked', false);
    }
  };

  var app = angular.module('ISDApp.controllers');
  app.controller('indexController', IndexController);
})(jQuery);
