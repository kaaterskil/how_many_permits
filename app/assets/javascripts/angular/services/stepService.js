(function(){
  var stepService = function(stepManager, resultsHelper){
    function reset($scope, stepTitle, shrink){
      var nextStep = stepManager.get(stepTitle)
      shrink = shrink || false;

      if(shrink) {
        stepManager.shrinkBox($scope.step, nextStep);
      }
      $scope.step = nextStep;
      $scope.stepTitle = stepTitle;
      $scope.nextStep = undefined;
      stepManager.spin(stepTitle);
      stepManager.highlightRoadMapStep(stepTitle);
    }

    function execute($scope, response){
      if(response.mustBranch()) {
        if(stepManager.isNewBranch(response)) {
          stepManager.branchRoadMap($scope.step, response);
          $scope.nextStep = response.getBranchStep();
        } else {
          $scope.nextStep = response.getNextStep();
          return;
        }
      } else {
        $scope.nextStep = $scope.step.execute(response);
      }
      resultsHelper.addQuestion($scope.step, response);
    }

    function showNextStep($scope){
      var responses = $scope.step.responses();
      if(responses.length === 1) {
        $scope.nextStep = $scope.step.execute(responses[0]);
        stepManager.shrinkBox($scope.step, $scope.nextStep);
      }
      if($scope.nextStep === undefined) {
        if(stepManager.hasBumpedStep()) {
          $scope.nextStep = stepManager.getBumpedStep();
        } else {
          alert('Please select a response');
          return;
        }
      }
      this.reset($scope, $scope.nextStep.title(), true);
    }

    function toggleResults($scope){
      $scope.showResults = !$scope.showResults;
      if($scope.showResults) {
        $scope.results = resultsHelper.getResults();
      }
      return $scope.showResults;
    }

    return {
      showNextStep: showNextStep,
      execute: execute,
      reset: reset,
      toggleResults: toggleResults
    }
  };

  stepService.$inject = ['stepManager', 'resultsHelper']

  var module = angular.module('ISDApp.stepService');
  module.service('stepService', stepService);
})()
