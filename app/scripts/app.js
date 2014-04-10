'use strict';

var app = angular.module('projectApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'firebase'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/modelList.html',
        controller: 'modelListCtrl'
      })
      .when('/details/:id?', {
        templateUrl: 'views/ModelDetails.html',
        controller: 'modelDetailsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
