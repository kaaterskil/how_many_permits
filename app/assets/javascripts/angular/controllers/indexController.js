(function IndexControllerIIFE($){
  var IndexController = function($scope, steps, stepManager){

    function init(stepTitle){
      $scope.resultset = [];
      stepManager.setStore(steps);
      stepManager.initializeWheel();
      reset(stepTitle);
    }

    function reset(stepTitle, shrink){
      var nextStep = stepManager.get(stepTitle)
      shrink = shrink || false;

      if(shrink) {
        stepManager.shrinkBox($scope.step, nextStep);
      }
      $scope.step = nextStep;
      $scope.nextStep = undefined;
      stepManager.spin(stepTitle);
    }

    init('Welcome');

    $scope.execute = function(response){
      $scope.nextStep = $scope.step.execute(response);
      // resultsHelper.setResults($scope, response);
    }

    $scope.continue = function(){
      var responses = $scope.step.responses();
      if(responses.length === 1) {
        $scope.nextStep = $scope.step.execute(responses[0]);
        stepManager.shrinkBox($scope.step, $scope.nextStep);
      }
      reset($scope.nextStep.title(), true);
    }
  };

  var app = angular.module('ISDApp.controllers');
  app.controller('indexController', IndexController);
})(jQuery);
