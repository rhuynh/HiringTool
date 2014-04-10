var modelDetailsCtrl = function($scope, $modal, $location, $routeParams, $firebase,$q, $timeout, ModelService) {
	ModelService.init('https://hranalytics.firebaseio.com/models');
  	$scope.model = ModelService.getById($routeParams.id);
  	$scope.maxWeightValidation = /^[1-5]$/;
  	$scope.selectedCandidateId;
  	$scope.selectedCandidate;
  	
  	$scope.salaryChart = {};
  	$scope.salaryChart.dataTable = new google.visualization.DataTable();

	$scope.candidateEditor = function(candidate, id){
		$scope.selectedCandidateId = id;
		$scope.selectedCandidate = candidate ? candidate : {}
		$scope.isNew = id ? false : true;
		var modalInstance = $modal.open({
	      templateUrl: '../views/CandidateManager.html',
	      controller: editCandidateCtrl,
	      resolve: {
	        candidate: function () {
	          return $scope.selectedCandidate;
	        },
	        model: function () {
	          return $scope.model;
	        }
	      }
	    });
	    modalInstance.result.then(function (selectedCandidate) {
			if($scope.isNew){
				ModelService.init('https://hranalytics.firebaseio.com/models/'+ $scope.model.$id + '/candidates');
				ModelService.add(selectedCandidate);
			}
	      else {
	      	$scope.model.candidates[$scope.selectedCandidateId] = selectedCandidate;
	        ModelService.init('https://hranalytics.firebaseio.com/models/'+ $scope.model.$id + '/candidates/');
			ModelService.update(selectedCandidate,$scope.selectedCandidateId);
	      }
	    });
	}

	$scope.getRunningTotal = function(candidate){
		var skills = candidate.skills;
		var criterias = $scope.model.criterias;
		var total = 0;
		for (var i = 0; i < skills.length; i++) {
			total = total + (skills[i].score * criterias[i].weight);
		};
		candidate.totalScore = total;		
		return total;
	}

	$scope.getAverageTotal = function(skillIndex){
		var candidateCount = 0;
		var average = 0;
		 angular.forEach($scope.model.candidates, function(candidate, key){
		 		average += parseInt(candidate.skills[skillIndex].score);
		 		candidateCount ++;
		 });
		return (average/candidateCount);
	}

	$scope.getRunningTotalAverage = function(){
		var averageRunningTotal = 0;
		var candidateCount = 0;
		angular.forEach($scope.model.candidates, function(candidate, key){
		 		averageRunningTotal += parseInt($scope.getRunningTotal(candidate));
		 		candidateCount ++;
		 });
		return (averageRunningTotal/candidateCount);
	}

	$scope.getChartData = function(index){
		var data = {};
		data.dataTable = new google.visualization.DataTable();
		data.dataTable.addColumn("string","Name");
		data.dataTable.addColumn("number",$scope.model.criterias[index].name);
		angular.forEach($scope.model.candidates, function(candidate, key){
			data.dataTable.addRow([candidate.name,parseInt($scope.model.candidates[key].skills[index].score)]);
		});
		$scope['skillChart' + index] = data;
		return $scope['skillChart' + index];
	}

	$scope.getTotalScoreChart = function(){
		var totalScoreChart = {};
		totalScoreChart.dataTable = new google.visualization.DataTable();
		totalScoreChart.dataTable.addColumn("string","Candidate");
		totalScoreChart.dataTable.addColumn("number","Total Score");
		totalScoreChart.dataTable.zf = [];//clear rows
		angular.forEach($scope.model.candidates, function(candidate, key){
			totalScoreChart.dataTable.addRow([candidate.name,candidate.totalScore]);		
		});
		$scope.totalScoreChart = totalScoreChart;
		return $scope.totalScoreChart;
	}

	$scope.getSkillsSummartChart = function(){
		var skillsSummartChart = {};
		skillsSummartChart.dataTable = new google.visualization.DataTable();
		skillsSummartChart.dataTable.addColumn("string","Candidate");
		angular.forEach($scope.model.criterias, function(skill,index){
			skillsSummartChart.dataTable.addColumn("number",skill.name);
		});
		skillsSummartChart.dataTable.zf = [];//clear rows		
		angular.forEach($scope.model.candidates, function(candidate, key){
			var rowArray = [];
			rowArray.push(candidate.name);
			angular.forEach(candidate.skills, function(skill, index){
				rowArray.push(parseInt(skill.score));
			});
			skillsSummartChart.dataTable.addRow(rowArray);		
		});
		$scope.skillsSummartChart = skillsSummartChart;
		return $scope.skillsSummartChart;
	}

	$scope.getSalaryChart = function(){
		var salaryChart = {};
		salaryChart.dataTable = new google.visualization.DataTable();
		salaryChart.dataTable.addColumn("string","Candidate");
		salaryChart.dataTable.addColumn("number","Salary");
		salaryChart.dataTable.addColumn("number","Score");
		salaryChart.dataTable.zf = [];//clear rows
		angular.forEach($scope.model.candidates, function(candidate, key){
			salaryChart.dataTable.addRow([candidate.name, parseInt(candidate.salary), parseInt($scope.getRunningTotal(candidate))]);
		});
		salaryChart.options = {
			seriesType: "bars",
        	series: {1: {type: "line"}}
		}
		$scope.salaryChart = salaryChart;
		return $scope.salaryChart;
	}
	 	

	//*******************sample data*********************
	//$scope.populateChart = function(){
		// $scope.data1 = {};
		// $scope.data1.dataTable = new google.visualization.DataTable();
		// $scope.data1.dataTable.addColumn("string","Name");
		// $scope.data1.dataTable.addColumn("number",".Net");
		// $scope.data1.dataTable.addColumn("number","SQL");
		//debugger;
		//$scope.data1.dataTable.addRow(["Test",$scope.model.candidates['-JJtEc3cYqcw1L7Bi6bu'].skills[0].score]);
		// angular.forEach($scope.model.candidates, function(candidate, key){
		// 	debugger;
		// 	$scope.data1.dataTable.addRow([candidate.name,parseInt($scope.model.candidates[key].skills[index].score)]);
		// });
		// $scope.data1.dataTable.addRow(["Test1",4,5]);
		// $scope.data1.dataTable.addRow(["Test2",2,4]);
		// $scope.data1.dataTable.addRow(["Test3",3,5]);    
		// $scope.data1.options = {};
		// $scope.data1.options.title="My Pie title";
		// $scope.data1.options.width=500;
		// $scope.data1.options.height=320;
	//}
	//*******************sample data*********************
};

var editCandidateCtrl = function ($scope, $modalInstance, candidate, model, ModelService) {
  $scope.candidate = candidate;
  $scope.isNew = false;
  if(!candidate){//if it is new candidate
  	$scope.isNew = true;
	$scope.candidate = {};
	$scope.candidate.skills = [];  	
  	$scope.candidate.salary = 0;
  	$scope.candidate.name = "";  	
  	$scope.candidate.skills = [];  	
	for (var i = 0; i < model.criterias.length; i++) {
		 $scope.candidate.skills.push({"name":model.criterias[i].name,"score":""});
	};
  }

  $scope.ok = function (candidateForm) {
  	if(candidateForm.$valid){
    	$modalInstance.close($scope.candidate);
	}
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addCriteria = function (candidateForm,candidate) {    
      if(modelForm.$valid) {
        $scope.candidate.skills.push({"name":candidate.skill.name,"weight":candidate.skill.weight});
        $scope.candidate.skill.name = "";      
        $scope.candidate.skill.weight = "";
      }
  };

  $scope.removeCriteria = function (criteria) {
    for (var i = $scope.candidate.skills.length - 1; i >= 0; i--) {
          if($scope.candidate.skills[i].name == criteria.name && $scope.candidate.skills[i].weight == skill.weight){
            $scope.candidate.skills.splice(i, 1);
          }
    };
  }
};