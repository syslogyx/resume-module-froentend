app.controller('settingCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore) {
	
	var stg = this;
	stg.designationTitle="Add Designation";
	stg.categoryTitle="Add Category";
	stg.designationID = null;
	stg.categoryID = null;
	stg.skip = true;

     /* Getting login user info*/
    var loggedInUserName = JSON.parse($cookieStore.get('identity'));
    stg.logInUser  =  loggedInUserName.identity.name;
    stg.logInUserId = loggedInUserName.id;
    stg.logInUserRole  =  loggedInUserName.identity.role;
    // console.log(stg.logInUserRole);

    	if (stg.logInUserRole == 1) { 
                menuService.setMenu([
                    {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
                    // {"Title": "My Approval Request", "Link": "/users/user_fund_approval_list", "icon": "fa fa fa-check-square-o", "active":"deactive"},
                    {"Title": "Fund Request", "Link": "fund", "icon": "fa fa-plus", "active":"deactive"},
                    // {"Title": "Transaction Details", "Link": "/fund/fund_inward_logs", "icon": "fa fa-newspaper-o", "active":"deactive"},
                    // {"Title": "Users", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
                    {"Title": "Settings", "Link": "/setting", "icon": "fa fa-gear", "active":"active"} 
                ]);   
		}else if(stg.logInUserRole == 2){     
                menuService.setMenu([
                    {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
                    {"Title": "My Approval Request", "Link": "/users/user_fund_approval_list", "icon": "fa fa fa-check-square-o", "active":"deactive"},
                    // {"Title": "Fund Request", "Link": "fund", "icon": "fa fa-plus", "active":"deactive"},
                    {"Title": "Transaction Details", "Link": "/fund/fund_inward_logs", "icon": "fa fa-newspaper-o", "active":"deactive"},
                    // {"Title": "Users", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
                    {"Title": "Settings", "Link": "/setting", "icon": "fa fa-gear", "active":"active"},
                    {"Title": "Particular List", "Link": "/particular_list", "icon": "fa fa-cart-plus", "active":"deactive"}  
                ]); 
		}else if(stg.logInUserRole == 3){     
		        	menuService.setMenu([
		                    {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
		                    // {"Title": "My Approval Request", "Link": "/users/user_fund_approval_list", "icon": "fa fa fa-check-square-o", "active":"deactive"},
		                    {"Title": "Fund Request", "Link": "fund", "icon": "fa fa-plus", "active":"deactive"},
		                    {"Title": "Transaction Details", "Link": "/fund/fund_inward_logs", "icon": "fa fa-newspaper-o", "active":"deactive"},
		                    {"Title": "Users", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
		                    {"Title": "Settings", "Link": "/setting", "icon": "fa fa-gear", "active":"active"},
		                    {"Title": "Particular List", "Link": "/particular_list", "icon": "fa fa-cart-plus", "active":"deactive"} 
		                ]);       
		}

	/*pagination for designation list*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            stg.fetchAllDesignation(-1);
        });
    },100);

    stg.fetchAllDesignation = function(page){
        stg.limit = $('#table_length').val();
        if(stg.limit == undefined){
            stg.limit = -1;
        }
        if(page == -1){
            stg.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            stg.pageno = page;
        }
        var requestParam = {
            page:stg.pageno,
            limit:stg.limit,
        }
        var promise = services.getAllDesignations(requestParam);
        promise.success(function(response) {
            if (response.data) {
                stg.designationList = response.data.data;
                stg.applyPagination(response.data);
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    stg.applyPagination = function (pageData) {
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                console.log('Page: ' + page);
                if (stg.skip) {
                    stg.skip = false;
                    return;
                }
                stg.fetchAllDesignation(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }

     /*pagination for category list*/

    setTimeout(function(){
        $('#table_length1').on('change',function(){
            stg.fetchAllCategories(-1);
        });
    },100);

    stg.fetchAllCategories = function(page){
        stg.limit1 = $('#table_length1').val();
        if(stg.limit1 == undefined){
            stg.limit1 = -1;
        }
        if(page == -1){
            stg.pageno1 = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec1').data("twbs-pagination")){
                    $('#pagination-sec1').twbsPagination('destroy');
            }
        }
        else{
            stg.pageno1 = page;
        }
        var requestParam = {
            page:stg.pageno1,
            limit:stg.limit1,
        }

        var promise = services.getAllCategories(requestParam);
        promise.success(function(response) {
            if (response.data) {
                stg.allCategoryList = response.data.data;
                stg.applyPagination1(response.data);
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    stg.applyPagination1 = function (pageData) {
        $('#pagination-sec1').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                console.log('Page: ' + page);
                if (stg.skip) {
                    stg.skip = false;
                    return;
                }
                stg.fetchAllCategories(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }

    stg.init = function () {
    	stg.fetchAllDesignation(-1);
    	stg.fetchAllCategories(-1);

        /* Getting fund setting*/
        var promise = services.getAllFundSetting();
        promise.success(function (result) {
            Utility.stopAnimation();
            stg.currentFundBalanceAmount= result.data.data[0].min_balance_amount_percentage;
            // console.log(stg.currentFundBalanceAmount);
        });

        //Hidding fund setting section to creator and approver
        if(stg.logInUserRole != 3){
            $('#fundSettingtab').hide();
            $('#designationSettingTab').hide();
            $('#categorySettingTab').hide();
            $('#settingTab').hide();
            $('#designationSetting').hide();
            $('#categorySetting').hide();
            $('#changePasswordSettingTab').show();   
            $('#settingPassword').addClass("active");
        }
    }

    stg.init();

    // stg.cancelChangePasswordSetting = function() {
    //     $location.path('/home');
    // }

    stg.cancelFundSetting= function() {
        stg.fundBalanceAmount = '';
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }
    
    stg.removeCollaps = function(){
    	$('.collapse').collapse('hide');
    	stg.fetchAllDesignation(-1);
    	stg.fetchAllCategories(-1);
    }

   //  stg.show = function(tabName){
   //  	if(tabName == 'designation'){
   //  		stg.designationTitle="Add Designation";
   //  		stg.designationID = null;
   //  		stg.designationName ='';
   //  	}else{
   //  		stg.categoryTitle="Add Category";
			// stg.categoryID = null;
			// stg.categoryName ='';
   //  	}
   //  }

    stg.setFundSetting = function(){
        if ($("#addFundSettingForm").valid()) {
            var req = {
                "min_balance_amount_percentage" : stg.fundBalanceAmount
            };
            if(stg.logInUserRole == 3){
                var promise = services.updateFundAmountSetting(req);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        toastr.success('Fund settings saved successfully.');
                        setTimeout(function () {
                            location.reload()
                        }, 500);
                    } catch (e) {
                        toastr.error("Fund settings not saved successfully.");
                        Raven.captureException(e)
                    }
                }, function myError(r) {    
                    toastr.error(r.data.errors);
                    Utility.stopAnimation();
                });
            }else{
                toastr.error("Unauthorised Request."); 
            }   
        }
    }

    stg.changePasswordSetting=function(id){ 
        // console.log(id);
        if(stg.newPasswordSetting!=stg.repeatPasswordSetting){
            stg.errMessage="Password not matched";
            stg.highlightcolor2="#dd4b39";
        }else{
            stg.highlightcolor2="";
        } 
 
        if($("#changePasswordSettingForm").valid() && stg.newPasswordSetting==stg.repeatPasswordSetting){
            var req = {
                "user_id":id,
                "new_password": stg.newPasswordSetting,
                "old_password": stg.oldPasswordSetting
            };
            // console.log(req);
            var promise = services.updatePassword(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    if(response.data){
                       toastr.success('Password changed successfully..');
                        setTimeout(function () {
                                location.reload()
                        }, 1000); 
                    }
                    else{
                        toastr.error(responce.data.message);
                    }
                    
                } catch (e) {
                    toastr.error("Password not changed successfully..");
                    Raven.captureException(e)
                }    
            }, function myError(r) {
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    stg.createDesignation = function(){
    	if ($("#addDesignationForm").valid()) {
	    	var req ={
	            "designation":stg.designationName
	        };
	        var promise = services.saveDesignation(req);
	        promise.then(function mySuccess(response) {
	            Utility.stopAnimation();
	            try {
	                toastr.success('Designation created successfully.');
	            } catch (e) {
	                toastr.error("Designation is not created successfully.");
	                Raven.captureException(e)
	            }
	            // var promise = services.getAllDesignations();
	            // promise.success(function(result) {
	            //     stg.designationList = result.data.data;
	            //     Utility.stopAnimation();
	            // });
	            stg.fetchAllDesignation(-1);
	            stg.designationName =''; 
	            $('#addDesignationTab').collapse("toggle");       
	        }, function myError(r) {
	        	debugger
	                toastr.error(r.data.errors , 'Designation already exist.');
	                Utility.stopAnimation();
	        });
	    }
    }

    stg.showEditDesignation = function(designationId,designationName){
    	$('#editDesignationModal').modal({backdrop: 'static', keyboard: false});
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        setTimeout(function(){
            setCSS();
        },200);
    	// stg.designationTitle="Edit Designation";
    	stg.editDesignation = designationName;
    	stg.designationID = designationId; 
    }

    stg.saveEditDesignation = function(designationId){
    	debugger
    	if ($("#editDesignationForm").valid()) {
	    	var req ={
	    		"id":designationId,
	            "designation":stg.editDesignation
	        };
	        var promise = services.updateDesignation(req);
	        promise.then(function mySuccess(response) {
	            Utility.stopAnimation();
	            try {
	                toastr.success('Designation updated successfully.');
	            } catch (e) {
	                toastr.error("Designation is not updated successfully.");
	                Raven.captureException(e)
	            }
	            // var promise = services.getAllDesignations();
	            // promise.success(function(result) {
	            //     stg.designationList = result.data.data;
	            //     Utility.stopAnimation();
	            // });
	            $('#editDesignationModal').modal('hide');
	            stg.fetchAllDesignation(-1);
	            stg.designationName ='';
	            stg.designationTitle="Add Designation";
				stg.designationID = null;
	            // $('#addDesignationTab').collapse("toggle");        
	        }, function myError(r) {
	            toastr.error(r.data.errors,'Designation already exist.');
	            Utility.stopAnimation();
	        });
	    }
    }

    stg.createCategory = function(){
    	if ($("#addCategoryForm").valid()) {
	    	var req ={
	            "name":stg.categoryName
	        };
	        var promise = services.saveCategory(req);
	        promise.then(function mySuccess(response) {
		        Utility.stopAnimation();
		        try {
		            toastr.success('Category created successfully.');
		        } catch (e) {
		            toastr.error("Category is not created successfully.");
		            Raven.captureException(e)
		        }
		        // var promise = services.getAllCategories();
	         //    promise.success(function (result) {
	         //        stg.allCategoryList = result.data.data;
	         //        Utility.stopAnimation();
	         //    });
	            stg.fetchAllCategories(-1);
	            stg.categoryName ='';
	            $('#addCategoryTab').collapse("toggle");       
	        }, function myError(r) {
	            toastr.error(r.data.errors,'Category already exist.');
	            Utility.stopAnimation();
	        });
	    }
    }

    stg.showEditCategory = function(categoryId,categoryName){
    	$('#editCategoryModal').modal({backdrop: 'static', keyboard: false});
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    	setTimeout(function(){
            setCSS();
        },200);
    	// stg.categoryTitle="Edit Category";
	    stg.editCategory = categoryName;
	    stg.categoryID = categoryId;
    }

    stg.saveEditCategory = function(categoryId){
    	if ($("#editCategoryForm").valid()) {
	    	var req ={
	    		"id":categoryId,
	            "name":stg.editCategory
	        };
	        var promise = services.updateCategory(req);
	        promise.then(function mySuccess(response) {
	            Utility.stopAnimation();
	            try {
	                toastr.success('Category updated successfully.');
	            } catch (e) {
	                toastr.error("Category is not updated successfully.");
	                Raven.captureException(e)
	            }
	            // var promise = services.getAllCategories();
	            // promise.success(function (result) {
	            //     stg.allCategoryList = result.data.data;
	            //     Utility.stopAnimation();
	            // });
	            $('#editCategoryModal').modal('hide');
	            stg.fetchAllCategories(-1);
	            stg.categoryName ='';
	            stg.categoryTitle="Add Category";
	            stg.categoryID = null;       
	        }, function myError(r) {
	                toastr.error(r.data.errors,'Category already exist.');
	                Utility.stopAnimation();
	        });
       	}
    }

    stg.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        stg.categoryName ='';
        stg.designationName ='';
        stg.errMessage ="";
        stg.fundBalanceAmount ='';
        stg.oldPasswordSetting ='';
        stg.newPasswordSetting ='';
        stg.repeatPasswordSetting ='';
        setTimeout(function(){
            setCSS();
        },200);
    }

});