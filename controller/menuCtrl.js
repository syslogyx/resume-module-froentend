app.controller("menuCtrl", function ($scope, services, $http, $location, $cookieStore, RESOURCES,menuService) {

    //$scope.token = null;
     if(services.getIdentity()==undefined){
      return false;
    }

    var loggedInUser = JSON.parse(services.getIdentity());

    if(loggedInUser.identity.role==1){
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
            {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
            {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"},
            {"Title": "Company Management", "Link": "/company", "icon": "fa  fa-bank ", "active":"deactive"},
            {"Title": "Background Checklist", "Link": "/background_checklist", "icon": "fa  fa-bank ", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==2) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},   
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
        ];      
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==3) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==4) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
        ];
        $scope.showUpdateProfile = true;
    }else if (loggedInUser.identity.role==5) {
        $scope.menuList = [
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"}, 
            {"Title": "My Resume", "Link": "/view_resume", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "Upload Documents", "Link": "/upload_background_form", "icon": "fa fa-file", "active":"deactive"}
        ];
        $scope.showUpdateProfile = false;
    }else{

    }

    menuService.setMenu($scope.menuList);

    /*Function to active selected menu */
    $scope.menuClick=function(link){
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
            $scope.menuClick(window.location.pathname);
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
                $("#updateUserModal").modal("toggle");
                setTimeout(function(){
                    setCSS();
                },500);
            }else{
                toastr.error(result.message, 'Sorry!');
            }
        });
    }

    $scope.saveUser = function () {setCSS();
        if ($("#updateUserForm").valid()) {
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
                    toastr.error(result.data.data.email[0], 'Sorry!');
                }
            }, function myError(r) {
                toastr.error(r.data.data.email[0], 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }
});