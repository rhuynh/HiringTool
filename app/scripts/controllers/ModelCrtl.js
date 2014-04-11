app.controller("modelListCtrl", function($scope, $modal, $location, $firebase, ModelService) {
  ModelService.init('https://hranalytics.firebaseio.com/models');
  $scope.models = ModelService.getAll();
  $scope.newItem = {};
  $scope.model = {};
  $scope.originalModel = {};
  $scope.isNew = false;
  $scope.maxWeightValidation = /^[1-5]$/;

  $scope.open = function (id) {
    $scope.model = id ? $scope.models[id] : {};
    $scope.originalModel = angular.extend($scope.originalModel, $scope.model);
    $scope.isNew = id ? false : true;
    var modalInstance = $modal.open({
      templateUrl: '../views/model.html',
      controller: 'editModelCtrl',
      resolve: {
        model: function () {
          return $scope.model;
        },
        originalModel: function () {
          return $scope.originalModel;
        },
        id: function(){
          return id;
        }
      }
    });
    
    modalInstance.result.then(function (id) {
      if($scope.isNew){
        ModelService.add($scope.model);        
      }
      else {
        ModelService.update($scope.model,id);
      }
      $scope.model = {};
    });
  };

  $scope.delete = function(id){
    ModelService.delete(id);
  };

  $scope.details = function(id){
    $location.path("/details/"+ id);    
  }
});



app.controller("editModelCtrl", function($scope, $modalInstance, model, originalModel, id) {
  $scope.model = model;
  $scope.model.criterias = $scope.model && $scope.model.criterias ? $scope.model.criterias : [];
  $scope.model.candidates = $scope.model && $scope.model.candidates ? $scope.model.candidates : [];
  $scope.maxWeight = 5;
  $scope.maxWeightValidation = /^[1-5]$/;
  $scope.criteria = {};

  $scope.ok = function () {
    $modalInstance.close(id);
  };

  $scope.cancel = function () {
    angular.extend($scope.model,originalModel);//revert changes.
    $modalInstance.dismiss('cancel');
  };

  $scope.addCriteria = function (criteria) {
      if(!criteria || !criteria.name.length || !criteria.weight || !new RegExp($scope.maxWeightValidation).test(criteria.weight)){
        return;
      }
      $scope.model.criterias.push(criteria);
      $scope.criteria = {};
  };

  $scope.removeCriteria = function (criteria) {
    for (var i = $scope.model.criterias.length - 1; i >= 0; i--) {
          if($scope.model.criterias[i].name == criteria.name && $scope.model.criterias[i].weight == criteria.weight){
            $scope.model.criterias.splice(i, 1);
          }
    };
  }
});