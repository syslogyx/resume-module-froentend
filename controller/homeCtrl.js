app.controller('homeCtrl', function ($scope,menuService,services,$cookieStore) {

	var hme = this;
	hme.name = "";
   // menuService.setMenu([]);

    var loggedInUser = JSON.parse($cookieStore.get('identity'));
    hme.logInUserRole  =   loggedInUser.identity.role;
    hme.logInUserID = loggedInUser.id;
    hme.name  =  loggedInUser.identity.name;

        menuService.setMenu([
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
            {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
            {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
        ]);

    $scope.init = function(){
		$scope.$root.$broadcast("myEvent", {});
		var token = services.getAuthKey();
	}

	$scope.init();
});