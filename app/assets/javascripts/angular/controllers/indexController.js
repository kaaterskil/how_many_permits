(function(){
  var IndexController = function($scope, steps, stepManager, resultsHelper, stepService){
    function init(stepTitle){
      $scope.resultset = [];
      stepManager.setStore(steps);
      stepManager.initializeWheel(stepTitle);
      $scope.reset(stepTitle);
    }

    $scope.reset = function(stepTitle, shrink){
      stepService.reset($scope, stepTitle, shrink);
    }

    $scope.spinWheel = function(){
      stepManager.gratuitousSpin($scope.step);
    }

    $scope.execute = function(response){
      stepService.execute($scope, response);
    }

    $scope.continue = function(){
      stepService.showNextStep($scope);
    }

    $scope.toggleResults = function(){
      return stepService.toggleResults($scope);
    }

    $scope.print = function(){
      window.print();
    }

    $scope.showResults = false;
    $scope.today = new Date();
    init('Welcome');
  };

  IndexController.$inject = ['$scope', 'steps', 'stepManager', 'resultsHelper', 'stepService'];

  var app = angular.module('ISDApp.controllers');
  app.controller('indexController', IndexController);
})();
