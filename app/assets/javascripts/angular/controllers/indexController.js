(function IndexControllerIIFE($){
  var IndexController = function($scope, initialData, resultsHelper){
    var steps = initialData.steps;

    function init(step){
      $scope.resultset = [];
      reset(step);
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

    init(steps['Welcome']);

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

  var app = angular.module('ISDApp.controllers', ['ISDApp.initialData', 'ISDApp.resultsHelper']);
  app.controller('indexController', IndexController);
})(jQuery);
