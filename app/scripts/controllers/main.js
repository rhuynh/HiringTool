'use strict';

angular.module('projectApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('ModelCtrl',function($scope){
  	$scope.modelMock = {"title":"","description":"","criteria":[{"name":"","weight":""},{"name":"","weight":""}],
  	"candidate":[{"name":"","skill":[{"name":"","weight":"","score":""},{"name":"","weight":"","score":""}]}]};
  	$scope.model.title = "";
  	$scope.model.description = "";
  	$scope.model.criteria = [];
  	$scope.model.candidates = [];
  	$scope.model.candidate.name = "";
    $scope.model.candidate.salary = "";
  	$scope.model.candidate.skill = [];

  });
