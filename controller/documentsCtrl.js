app.controller('documentsCtrl', function ($scope,menuService,services,$cookieStore) {

	var doc = this;
	doc.downloadBgCheckForm = function(){
        var promise = services.downloadBackgroundForm();
    }

    $scope.getTheFiles = function ($files) {
        $scope.file=$files[0];
        console.log($scope.file);
    };
});