app.controller('userCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore) {

    var usr = this;

    usr.id = null;
    usr.title = 'Add New User';
    usr.userName ="";
    usr.contactNo ="";
    usr.contactEmail ="";
    usr.password ="";
    usr.skip = true;
    usr.comapnyName='Syslogyx Pvt. Ltd.'

    usr.filterStatusType=[
        {id: "1", type: "Rejected"},
        {id: "2", type: "Approved"},
        {id: "3", type: "Postponed"},
        {id: "4", type: "Closed"},
        {id: "5", type:"Pending"}
    ];

    var viewPath = $location.path().split("/")[1];
    // console.log(viewPath);
     /* Getting login user info*/
    var loggedInUserName = JSON.parse($cookieStore.get('identity'));
    usr.logInUser  =  loggedInUserName.identity.name;
    usr.logInUserId  =  loggedInUserName.id;
    usr.logInUserRole  =  loggedInUserName.identity.role;
    usr.uniqueToken  =  loggedInUserName.identity.uniqueToken;


    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"active"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"}
    ]);
            
	usr.addNewUser = function () {
        $location.path('/user/add_user');   
    }
    usr.cancelUser = function() {
         $location.path('/user');
    }

    /*Record limit for Users in pagination*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            usr.fetchAllUsers(-1);
        });
    },100);

    /*pagination for Users*/
    usr.fetchAllUsers = function(page){
        usr.limit = $('#table_length').val();
        if(usr.limit == undefined){
            usr.limit = -1;
        }
        if(page == -1){
            usr.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            usr.pageno = page;
        }
        var requestParam = {
            page:usr.pageno,
            limit:usr.limit,
        }
      
        var promise = '';
        if(usr.logInUserRole==1){
            promise = services.getAllUsers(requestParam);
        }else if(usr.logInUserRole==2) {
            promise = services.getSelectedUsers(requestParam);;   
        }
        promise.success(function (result) {
            if (result.data) {
                Utility.stopAnimation();
                usr.allUsersList = result.data.data; 
                usr.applyPagination(result.data);
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }
    usr.applyPagination = function (pageData) {
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                console.log('Page: ' + page);
                if (usr.skip) {
                    usr.skip = false;
                    return;
                }
                usr.fetchAllUsers(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }

    usr.init = function () {
        usr.fetchAllUsers(-1);

        /* Getting all user roles */
        var promise = '';
        if(usr.logInUserRole==1){
            promise = services.getAllRoles();
        }else if(usr.logInUserRole==2) {
            promise = services.getSelectedRoles();   
        }
        promise.success(function (result) {
            Utility.stopAnimation();
            usr.roleList = result.data;
            // console.log( usr.roleList);    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Editing perticular user*/
        usr.id = $location.search()["id"];
        if (usr.id > 0) {
            // $('#passwordDiv').hide();
            var promise = services.getUserById(usr.id);
            promise.then(function mySuccess(response) {
                console.log(response.data);
                Utility.stopAnimation();
                usr.title = 'Update User';
                usr.userName = response.data.data.name;
                usr.contactEmail = response.data.data.email;
                usr.userType = response.data.data.role.id;
                console.log(usr.userType);
                usr.contactNo = response.data.data.mobile;
                usr.comapnyName = response.data.data.company_name;
                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    usr.init();

    usr.createUser = function(){
        if ($("#userForm").valid()) {
            var req = {
                    "name" : usr.userName,
                    "email": usr.contactEmail,
                    "password" : usr.password,
                    "role_id":usr.userType,
                    "status":"Active",
                    "company_name" :usr.comapnyName,
                    "mobile" : usr.contactNo,
                    "unique_token":usr.uniqueToken
                };
            
                var promise;
                if (usr.id) {
                    req.id = usr.id;
                    if(req.password.trim()==''){
                        delete req.password;
                    }
                    promise = services.updateUser(req);
                    var operationMessage = "updated";
                } else {
                    promise = services.saveUser(req);
                    operationMessage = "created";
                }

                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        toastr.success('User ' + operationMessage +' successfully.');
                        $location.url('/user');
                    } catch (e) {
                        toastr.error("User not saved successfully.");
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    toastr.error('Email Id already taken. Please try another.');
                   // console.log(r.data.errors.email);
                    Utility.stopAnimation();
                });
        }
    }

    usr.resetForm = function(){
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        usr.newPassword = '';
        usr.repeatPassword = '';
        usr.errMessage="";
        usr.error='';
        usr.userType='';
        setTimeout(function(){
            setCSS();
        },500);
        usr.init();
    }

    usr.sendUserId=function(id,name){
        $('#changePasswordModal').modal({backdrop: 'static', keyboard: false});
        usr.userId=id;
        usr.userName=name;
        setTimeout(function(){
            setCSS();
        },500);
    }

    usr.updatePassword=function(id){ 
        //console.log(id);
        if(usr.newPassword!=usr.repeatPassword){
            usr.errMessage="Password not matched.";
            usr.highlightcolor2="#dd4b39";
        }else{
            usr.highlightcolor2="";
        } 
 
        if($("#changePasswordForm").valid() && usr.newPassword==usr.repeatPassword){ 
            var req = {
                "user_id":id,
                "new_password": usr.newPassword,
                "old_password": usr.oldPassword
            };
            //console.log(req);
            // $("#changePasswordBtn").attr('disabled','disabled');
            var promise = services.updatePassword(req);
            promise.then(function mySuccess(response) {
                console.log(response);
                Utility.stopAnimation();
                try{
                    if(response.data){
                        toastr.success('Password changed successfully.');
                        $location.url('/user');
                    }
                    else{
                        toastr.error(response.message);
                    }
                    $("#changePasswordModal").modal('hide');
                } catch (e) {
                    toastr.error("Password not changed successfully.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    usr.refreshUserfilter = function(){
        usr.filteUsername ='';
        usr.filterDesignation = '';
        usr.filterContactEmail = '';
        applySelect2();
        usr.fetchAllUsers(-1);
    }

    usr.findFilterWithUser = function(page){
        usr.limit = $('#table_length').val();
        if(usr.limit == undefined){
            usr.limit = -1;
        }
        if(page == -1){ 
            usr.pageno = 1;
            console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            usr.pageno = page;
        }
        var requestParam = {
            page:usr.pageno,
            limit:usr.limit,
        }
        
        var req = {
            "user_id":usr.filteUsername,
            "designantions_id": usr.filterDesignation,
            "contact_email":usr.filterContactEmail
        };
        console.log(req);
        var promise = services.findUser(req,requestParam);
        promise.then(function mySuccess(response) {
            Utility.stopAnimation();
            // console.log(response);
            try {   
                if(response.data.data){
                    usr.allUsersList = response.data.data.data;
                        // toastr.success('Filtered successfully.');
                }
                else{
                    usr.allUsersList = response.data.data;
                        // toastr.error("No matching results found.", 'Sorry!');
                }
                usr.applyPaginationForUser(response.data.data);     
            } catch (e) {
                toastr.error("No matching results found.", 'Sorry!');
                Raven.captureException(e)
            }   
        }, function myError(r) {
            toastr.error(r.data.errors);
            Utility.stopAnimation();
        });
    }

    usr.applyPaginationForUser = function (pageData) {  
        //console.log(pageData);
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                if(page==-1){
                   toastr.error("No matching results found.", 'Sorry!'); 
                }
                else if(usr.filteUsername==undefined && usr.filterDesignation == undefined && usr.filterContactEmail == undefined && page==1){
                    toastr.error("Please select atleast one field.");
                }
                else if(usr.filteUsername==undefined && usr.filterDesignation == undefined && usr.filterContactEmail == undefined){
                    // toastr.error("Please, Select atleast one field.");
                }
                else{
                   toastr.success('Filtered successfully.'); 
                }
                console.log('Page: ' + page);
                if (usr.skip) {
                    usr.skip = false;
                    return;
                }
                usr.findFilterWithUser(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }
   
});

