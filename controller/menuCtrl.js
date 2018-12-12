app.controller("menuCtrl", function ($scope, services, $http, $location, $cookieStore, RESOURCES) {

    //$scope.token = null;
    $scope.menuList = []; 

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
    $scope.select= function(i) {
      $scope.selectedIndex=i;
    };

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