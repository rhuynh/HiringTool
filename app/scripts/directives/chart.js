'use strict';
app.directive("googleChart",function(){  
	  return {
	      restrict : "A",
	      scope: {
			'loadData':'&',
			ngModel: '='	      	 
	      },
	      link: function($scope, $elem, $attr){
	      	 $scope.$watch('ngModel', function() {	      	 	
	      	 	var data = $scope.loadData();
			      	var dt = data.dataTable;
		          	var options = {};
		          	if($attr.title)
						options.title = $attr.title;
					if($attr.width)
						options.width = $attr.width;
					if($attr.height)
						options.height = $attr.height;
					if($attr.googleChart === 'ComboChart'){// its 4 am, i'll just hardcode it for now.
						options.seriesType = "line";
						options.series = {
							0:{targetAxisIndex:1}, 
							1:{type:"bars",targetAxisIndex:0}
						};
					}
		          	var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
		          	googleChart.draw(dt,options);
	      	 }, true);
	         
	      }
	  }
	});
/*
var chart = {};

var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);
	var options = {
          title: 'Company Performance'
        };

chart.data = data;
chart.options = options;

*/