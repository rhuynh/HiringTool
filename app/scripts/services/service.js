app.factory('ModelService', function($firebase) {
	var _url = null;
	var _ref = null;

	return {
		init: function (url) {
            _url = url;
            _ref = new Firebase(_url);
        },
		getAll: function() {
			return $firebase(_ref);
		},
		getById: function(id) {
			return $firebase(new Firebase(_url + '/' + id));
		},
		add: function(item){
			//clean object and remove angular $$hash property
			var toJson = angular.copy(item);
    		_ref.push(toJson);
		},
		update: function(item,id){
			var itemRef = new Firebase(_url + '/' + id);
			var toJson = angular.copy(item);
			itemRef.update(toJson);
		},
		delete: function(id){
    		var itemRef = new Firebase(_url + '/' + id);
    		itemRef.remove();
		},
		deleteAll: function(){
    		_ref.remove();
		}	
	};
});