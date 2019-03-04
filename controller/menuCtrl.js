app.controller("menuCtrl", function ($scope, services, $http, $location, $cookieStore, RESOURCES,menuService) {

    //$scope.token = null;
     if(services.getIdentity()==undefined){
      return false;
    }

    /* Fetch login candidate info from cookies*/
    var loggedInUser = JSON.parse(services.getIdentity());

    /* Menu selection according to user role */
    if(loggedInUser.identity.role==RESOURCES.ROLE_ADMIN){
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
            {"Title": "Client Management", "Link": "/client", "icon": "fa fa-bank ", "active":"deactive"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
            {"Title": "Candidate Management", "Link": "/resume_list#non-selected", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "Screening", "Link": "/questions", "icon": "fa fa-question-circle", "active":"deactive"},
            {"Title": "Scheduled Interviews", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"},
            {"Title": "Forward Resumes", "Link": "/forward_resumes", "icon": "fa fa-circle-o", "active":"deactive"},
            {"Title": "Background Checklist", "Link": "/background_checklist", "icon": "fa fa-check-square-o", "active":"deactive"},
            {"Title": "User Management", "Link": "/user#all", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Technology", "Link": "/technologies", "icon": "fa fa-plus", "active":"deactive"},
            {"Title": "Import Details", "Link": "/import_excel", "icon": "fa fa-upload", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==RESOURCES.ROLE_HR) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "Candidate Management", "Link": "/resume_list#non-selected", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "Screening", "Link": "/questions", "icon": "fa fa-question-circle", "active":"deactive"},
            {"Title": "Scheduled Interviews", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"},
            {"Title": "Forward Resumes", "Link": "/forward_resumes", "icon": "fa fa-circle-o", "active":"deactive"},
            {"Title": "Background Checklist", "Link": "/background_checklist", "icon": "fa fa-check-square-o", "active":"deactive"},
            // {"Title": "User Management", "Link": "/user#all", "icon": "fa fa-user-plus", "active":"deactive"}
        ];      
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==RESOURCES.ROLE_COLLEGUE) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "Candidate Management", "Link": "/resume_list#non-selected", "icon": "fa fa-file-text", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==RESOURCES.ROLE_INTERVIWER) {
        $scope.menuList = [
            // {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "Today's Interviews", "Link": "/today_interviews", "icon": "fa fa-calendar", "active":"active"},
            {"Title": "Scheduled Interviews", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==RESOURCES.ROLE_CANDIDATE) {
        $scope.menuList = [
            // {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "My Resume", "Link": "/view_resume", "icon": "fa fa-file-text", "active":"active"},
            {"Title": "Documents", "Link": "/upload_background_form", "icon": "fa fa-file", "active":"deactive"}
            // {"Title": "Update Profile", "Link": "/resume/", "icon": "fa fa-file", "active":"deactive"}
        ];
        $scope.showUpdateProfile = false;
    }else if (loggedInUser.identity.role==RESOURCES.ROLE_CLIENT) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
            {"Title": "Candidate Management", "Link": "/resume_list#non-selected", "icon": "fa fa-file-text", "active":"deactive"}
        ];
        $scope.showUpdateProfile = false;
    }else{

    }

    menuService.setMenu($scope.menuList);

    /*Function to active selected menu */
    $scope.menuClick=function(link){
        console.log(link);
      for (var i = 0; i < $scope.menuList.length; i++) {
        if(link==$scope.menuList[i].Link){
          $scope.menuList[i].active='active';
        }else{
          $scope.menuList[i].active='deactive';
        }
      }
    }

    $scope.$on("myEvent", function (event, args) {
        projectId = $location.path().split("/")[2] || "Unknown";
        $scope.token = services.getAuthKey();
        if (projectId != "Unknown") {
            $scope.projectName = args.projectName;
        } else {
            $scope.projectName = "";
        }

    });

    $scope.$on("myIdEvent", function (event, args) {
        //projectId = $location.path().split("/")[2] || "Unknown";
        $scope.token = services.getAuthKey();

        if (projectId != "Unknown") {
            $scope.projectId = args.projectId;
        } else {
            $scope.projectId = "";
        }
    });

    /*Function to initialise menu controller */
    $scope.init = function () {
        $scope.token = services.getAuthKey();
        if ($scope.token != undefined) {
            $scope.user = JSON.parse($cookieStore.get('identity'));
            /*console.log("sdfsdfsdfsd  "+$scope.user.identity.name);*/
            $scope.name = $scope.user.identity.name;
            $scope.userId = $scope.user.id;
            $scope.name = $scope.user.identity.name;
            $scope.logInUserRole  =   $scope.user.identity.role;
            //console.log( $scope.logInUserRole);
            // $scope.menuClick(window.location.pathname);
            var pathUrl = window.location.pathname+(window.location.hash !=''?window.location.hash:'')
            $scope.menuClick(pathUrl);
        }

    };

    $scope.init();

    /*Function to clear token*/
    $scope.clearToken = function () {

        // $.removeCookie("authKey", { path: '/' });
        $cookieStore.remove('authkey');
        $cookieStore.remove('identity');
        $scope.init();
        window.location.href = "/site/login";
    }
   
    //function to show menu as active on click
   /* $scope.selectedIndex=0;*/
    // $scope.select= function(i) {
    //   $scope.selectedIndex=i;
    // };
    $scope.select= function(i) {
      $scope.selectedIndex=i;
    };

    /*Function to get login user data */
    $scope.getUserData = function () {
        $scope.userpassword = '';
        var promise = services.getUserById($scope.userId);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.status_code == 200){
                $scope.id = result.data.id;
                $scope.userName = result.data.name;
                $scope.userRole = result.data.role_id;
                $scope.userEmail = result.data.email;
                $scope.mobileNo = result.data.mobile;
                $scope.comapnyName = result.data.company_name;
                $scope.status =result.data.status;
                $("#updateUserProfile").attr('disabled',false);
                $("#updateUserModal").modal("toggle");
                setTimeout(function(){
                    setCSS();
                },500);
            }else{
                toastr.error(result.message, 'Sorry!');
            }
        });
    }

    /*Function to update login user profile data */
    $scope.saveUser = function () {setCSS();
        if ($("#updateUserForm").valid()) {
            $("#updateUserProfile").attr('disabled',true);
            var req = {
                "name": $scope.userName,
                "email": $scope.userEmail,
                "password":$scope.userpassword,
                "role_id": $scope.userRole,
                "mobile": $scope.mobileNo,
                "status":$scope.status,
                "company_name" :$scope.comapnyName,
            }
            req.id = $scope.id;

            var promise = services.updateUser(req);

            promise.then(function mySuccess(result) {
                
                Utility.stopAnimation();
                if(result.data.status_code == 200){
                    $("#updateUserModal").modal("toggle");
                    toastr.success('User profile updated successfully..');
                }else{
                    $("#updateUserProfile").attr('disabled',false);
                    toastr.error(result.data.data.email[0], 'Sorry!');
                }
            }, function myError(r) {
                $("#updateUserProfile").attr('disabled',false);
                toastr.error(r.data.data.email[0], 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }
});