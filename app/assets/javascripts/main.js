(function ISDApp(){
  var app = angular.module('ISDApp', [
    'ngRoute',
    'ISDApp.stepService',
    'ISDApp.steps',
    'ISDApp.initialData',
    'ISDApp.controllers'
  ]);

  app.config(function($routeProvider){
    $routeProvider
    .when('/', {
      controller: 'indexController',
      templateUrl: '../templates/index.html',
      resolve: {
        initialData : function(InitialData){
          return InitialData();
        }
      }
    });
  });

})();
