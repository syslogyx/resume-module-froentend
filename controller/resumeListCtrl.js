app.controller("resumeListCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService) {

    var rlc = this;
    menuService.setMenu([
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"active"}
            //{"Title": "Settings", "Link": "/setting", "icon": "fa fa-gear", "active":"deactive"},
    ]);

    rlc.resumeList = [{id:1,name:"TEST 1"},{id:2,name:"TEST 2"},{id:3,name:"TEST 3"},{id:4,name:"TEST 4"}];   
   
    rlc.downloadResumePDF = function(id){
        //if(rpc.reportList.length > 0){
                // var req={
                //                 "date":rpc.filterDate !=''?rpc.filterDate:-1,
                //                 "product_id":rpc.filterProductId!=''?rpc.filterProductId:-1,
                //                 "user_id":loggedInUser.identity.role!=1?loggedInUser.id:-1,
                //                 "type":type
                // }

                // var promise = services.download(req,projectId);
                var promise = services.downloadResumePDF();
                // promise.success(function (result) {
                        // Utility.stopAnimation();
                    // if(result.status_code == 200){
                    //  Utility.stopAnimation();
                    // }else{
                    //  Utility.stopAnimation();
                    //      toastr.error(result.message, 'Sorry!');
                    // }

                // });
            // }else{
            //         toastr.error('Record not found', 'Sorry!');
            // }

    }
});

