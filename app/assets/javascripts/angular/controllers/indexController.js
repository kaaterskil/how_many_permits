(function($){
  var IndexController = function($scope, steps, stepManager, resultsHelper){
    function leadingZeros(raw){
      return raw < 10 ? '0' + raw : raw;
    }

    function today(){
      var today = new Date(),
      d = leadingZeros(today.getDate()),
      m = leadingZeros(today.getMonth() + 1),
      y = today.getFullYear(),
      h = leadingZeros(today.getHours()),
      i = leadingZeros(today.getMinutes()),
      s = leadingZeros(today.getSeconds());
      return m + '/' + d + '/' + y + ' ' + h + ':' + i + ':' + s;
    }

    function init(stepTitle){
      $scope.resultset = [];
      stepManager.setStore(steps);
      stepManager.initializeWheel(stepTitle);
      reset(stepTitle);
    }

    function reset(stepTitle, shrink){
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

    $scope.reset = function(stepTitle, shrink){
      reset(stepTitle, shrink);
    }

    $scope.spinWheel = function(){
      stepManager.gratuitousSpin($scope.step);
    }

    $scope.execute = function(response){
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

    $scope.continue = function(){
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
      reset($scope.nextStep.title(), true);
    }

    $scope.toggleModal = function(){
      $scope.modalShown = !$scope.modalShown;
      if($scope.modalShown) {
        $scope.results = resultsHelper.getResults();
      }
    }

    // $scope.results = resultsHelper.getResults();
    $scope.today = today();
    $scope.modalShown = false;
    init('Welcome');
  };

  IndexController.$inject = ['$scope', 'steps', 'stepManager', 'resultsHelper'];

  var app = angular.module('ISDApp.controllers');
  app.controller('indexController', IndexController);
})(jQuery);
