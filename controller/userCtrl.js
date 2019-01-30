app.controller('userCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var usr = this;

    usr.id = null;
    usr.title = 'Add New User';
    usr.userName ="";
    usr.contactNo ="";
    usr.contactEmail ="";
    usr.password ="";
    usr.skip = true;
    usr.comapnyName='Syslogyx Pvt. Ltd.'

    var viewPath = $location.path().split("/")[1];
    console.log(viewPath);
    var hashPathname = window.location.hash;
    usr.hashPathId = hashPathname.substring(1, hashPathname.length);
    console.log(usr.hashPathId);

    /* Getting login user info */
    var loggedInUserName = JSON.parse($cookieStore.get('identity'));
    usr.logInUser  =  loggedInUserName.identity.name;
    usr.logInUserId  =  loggedInUserName.id;
    usr.logInUserRole  =  loggedInUserName.identity.role;
    usr.uniqueToken  =  loggedInUserName.identity.uniqueToken;

    /* Function to show view of add user */
	usr.addNewUser = function () {
        $location.url('/user/add_user');   
    }

    /*Function to cancle add user view */
    usr.cancelUser = function() {
         // $location.path('/user');
         $location.url('/user#all');
    }

    /*Record limit for Users in pagination */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            usr.fetchList(-1);
        });
    },100);

    /* Function to fetch all users list */
    usr.fetchList = function(page){
        usr.limit = $('#table_length').val();
        if(usr.limit == undefined){
            usr.limit = -1;
        }
        if(page == -1){
            usr.pageno = 1;
            if($('#pagination-sec').data("twbs-pagination")){
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            usr.pageno = page;
        }
        

        var req = {
            "role_id":usr.hashPathId
        }

        console.log(req);

        var requestParam = {
            page:usr.pageno,
            limit:usr.limit,
        }

        var promise = '';
        // if(usr.logInUserRole==1){
            // promise = services.getAllUsers(requestParam,req);
            promise = services.findUser(req,requestParam);
        // }else if(usr.logInUserRole==2) {
        //     promise = services.getSelectedUsers(requestParam);;   
        // }
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data) {
                usr.allUsersList = result.data.data;
                pagination.applyPagination(result.data,usr);
            }else{
                usr.allUsersList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to initialise user controller */
    usr.init = function () {       
        if (usr.hashPathId == 'all') {
            $("#candidate").parent().removeClass('active');
            $("#client").parent().removeClass('active');
            $("#all").parent().addClass('active');
        }else if (usr.hashPathId == 'candidate'){
            $("#all").parent().removeClass('active');
            $("#client").parent().removeClass('active');
            $("#candidate").parent().addClass('active');
        }else if(usr.hashPathId == 'client'){
            $("#all").parent().removeClass('active');
            $("#candidate").parent().removeClass('active');
            $("#client").parent().addClass('active');
        }

        if($location.path() != "/user/add_user" && $location.path() != "/user/edit"){
            usr.fetchList(-1);
        }

        /* Getting all user roles */
        var promise = '';
        //if(usr.logInUserRole==1){
            promise = services.getAllRoles();
        // }else if(usr.logInUserRole==2) {
        //     promise = services.getSelectedRoles();   
        // }
        promise.success(function (result) {
            Utility.stopAnimation();
            usr.roleList = result.data;    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Editing perticular user */
        usr.id = $location.search()["id"];
        if (usr.id > 0) {
            var promise = services.getUserById(usr.id);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                usr.title = 'Update User';
                usr.userName = response.data.data.name;
                usr.contactEmail = response.data.data.email;
                usr.userType = response.data.data.role.id;
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

    /* Function to create new user */
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
                // if(req.password.trim()==''){
                //     delete req.password;
                // }
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
                    $location.url('/user#all');
                } catch (e) {
                    toastr.error("User not saved successfully.");
                    Raven.captureException(e)
                }
            // }, function myError(r) {
            //     toastr.error(r.data.message);
            //     Utility.stopAnimation();
            // });
            }, function myError(r) {
                    var htmlerror ='<ul style="list-style:none;"><li >';
                    $.each(r.data.data, function(k, v) {
                        if(k=='email'){
                            htmlerror = htmlerror+v +'</li><li>';
                        }
                        if(k=='mobile'){
                            htmlerror = htmlerror+v+'</li><li>';
                        }
                      });
                    toastr.error(htmlerror);
                    Utility.stopAnimation();
                });
        }
    }

    /* Function to reset add user form */
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

    /* Function to show user id and name in password change modal */
    usr.sendUserId=function(id,name){
        $('#changePasswordModal').modal({backdrop: 'static', keyboard: false});
        usr.userId=id;
        usr.userName=name;
        setTimeout(function(){
            setCSS();
        },500);
    }

    /* Function to update user password */
    usr.updatePassword=function(id){ 
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
                        $location.url('/user#all');
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

    /* Function to refresh user filter form */
    usr.refreshUserfilter = function(){
        usr.filteUsername ='';
        usr.filterDesignation = '';
        usr.filterContactEmail = '';
        applySelect2();
        usr.fetchAllUsers(-1);
    }

    /* Function to filter user list */
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

    /* Pagination for filter user data */
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

