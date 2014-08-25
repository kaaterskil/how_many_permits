(function ISDApp(){
  angular.module('ISDApp.step', []);
  angular.module('ISDApp.response', ['ISDApp.step']);
  angular.module('ISDApp.dataServices', []);
  angular.module('ISDApp.stepManager', []);
  angular.module('ISDApp.controllers', ['ISDApp.stepManager']);

  var app = angular.module('ISDApp', [
    'ngRoute',
    'ISDApp.step',
    'ISDApp.response',
    'ISDApp.dataServices',
    'ISDApp.controllers'
  ]);

  app.config(function($routeProvider){
    $routeProvider
    .when('/', {
      controller: 'indexController',
      templateUrl: '../templates/index.html',
      resolve: {
        steps: function(DataService, Step, Response){
          return DataService.getStepData()
          .then(function(stepJson){
            return Step.apiResponseTransform(stepJson);
          })
          .then(function(steps){
            // Nest this promise so it waits until the first is resolved.
            return DataService.getResponseData()
            .then(function(responseJson){
              Response.apiResponseTransform(responseJson, steps);
              return steps;
            });
          });
        }
      }
    });
  });

})();
