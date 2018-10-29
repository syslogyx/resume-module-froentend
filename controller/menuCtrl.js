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
        $scope.init();
        window.location.href = "/site/login";
    }
   
    //function to show menu as active on click
   /* $scope.selectedIndex=0;*/
    $scope.select= function(i) {
      $scope.selectedIndex=i;
    };

});