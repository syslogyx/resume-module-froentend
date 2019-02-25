app.controller('homeCtrl', function ($scope,RESOURCES,$rootScope,menuService,services,$cookieStore) {

	var hme = this;
	hme.name = "";
   // menuService.setMenu([]);

   /* Fetch login candidate info from cookies*/
    var loggedInUser = JSON.parse($cookieStore.get('identity'));
    hme.logInUserRole  =   loggedInUser.identity.role;
    hme.logInUserID = loggedInUser.id;
    hme.name  =  loggedInUser.identity.name;

    hme.role_admin = RESOURCES.ROLE_ADMIN;
    hme.role_hr = RESOURCES.ROLE_HR;
    hme.role_client = RESOURCES.ROLE_CLIENT;
    console.log(hme.role_admin);

    /* Set menues in menu service */
    // menuService.setMenu([
    //     {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
    //     {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
    //     {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
    //     {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
    //     {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
    //     {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
    // ]);

    /* Function to intialise controller */
    $scope.init = function(){
		$scope.$root.$broadcast("myEvent", {});
		var token = services.getAuthKey();

        if(hme.role_client == hme.logInUserRole){
            hme.getTechnologies();
        }

	}

    hme.getTechnologies = function(){
        var promise = services.getActiveTechnologyDetails();
        promise.success(function (result) {
            Utility.stopAnimation();
            console.log(result.data);
            hme.technologyList = result.data;
        }, function myError(r) {
            hme.technologyList = [];
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }



	$scope.init();
});