(function ISDApp(){
  var app = angular.module('ISDApp', ['ngRoute']);

  app.config(function($routeProvider){
    $routeProvider
    .when('/', {
      controller: 'indexController',
      templateUrl: '../templates/index.html'
    });
  });
})();
