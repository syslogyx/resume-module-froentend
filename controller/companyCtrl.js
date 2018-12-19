app.controller('companyCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var cmp = this;

    cmp.id = null;
    cmp.title = 'Add New Company';
    cmp.pageno = 0;
    cmp.limit = 0;
    cmp.skip = true;
    cmp.comapnyList =[];

    /* To fetch data according table length */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            cmp.fetchList(-1);
        });
    },100);

    /* Function to load add company view */
    cmp.addNewCompany = function(){
    	$location.path('/company/add_company');
    }

    /* Function to cancle company form */
    cmp.cancelCompany = function() {
        $location.path('/company');
    }

    /* Function to fetch company list */
    cmp.fetchList = function(page){
        cmp.limit = $('#table_length').val();
        if(cmp.limit == undefined){
            cmp.limit = -1;
        }
        if(page == -1){
            cmp.pageno = 1;
            if($('#pagination-sec').data("twbs-pagination")){
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            cmp.pageno = page;
        }
        var requestParam = {
            page:cmp.pageno,
            // limit:pagination.getpaginationLimit(),
            limit:cmp.limit,
        }
        var promise = services.getAllCompanyList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.data != null){
                cmp.companyList = result.data.data;
                pagination.applyPagination(result.data,cmp);
            }else{
                cmp.companyList = null;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    /* Function to initialise company controller */
    cmp.init = function(){
        cmp.limit = $('#table_length').val();
        cmp.fetchList(-1);        
        /* Editing perticular company*/
        cmp.id = $location.search()["id"];
        if (cmp.id > 0) {
            var promise = services.getCompanyById(cmp.id);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                cmp.title = 'Update Company';
                cmp.companyName = response.data.data.name,
                cmp.contactNo = response.data.data.contact_no,
                cmp.address = response.data.data.address,
                cmp.status = response.data.data.status                
                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function reset create company form */
    cmp.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        cmp.companyName ='';
        cmp.contactNo ='';
        cmp.address ='';
    }

    /* Function to create/update new company */
    cmp.createCompany = function(){
        if ($("#companyForm").valid()) {
            var req ={
                "name":cmp.companyName,
                "contact_no":cmp.contactNo,
                "address":cmp.address
            }

            var promise;
            if (cmp.id) {
                req.id = cmp.id;
                promise = services.updateCompany(req);
                var operationMessage = "updated";
            } else {
                promise = services.saveCompany(req);
                operationMessage = "created";
            }
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Company ' + operationMessage +' successfully.');
                    $location.url('/company');
                } catch (e) {
                    toastr.error("Company not saved successfully.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to change company status */
    cmp.changeCompanyStatus = function(status,id,index){
        var req = {
            "id":id,
            "status": status == true ? 1 : 0
        };
        swal({
                title: "Sure?",
                text: "Are you sure you want to change company status?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes",
            }).then(function(isConfirm) {
                console.log(isConfirm);
                if (isConfirm) {
                    var promise = services.updateCompanyStatus(req);
                        promise.then(function mySuccess(response) {
                        Utility.stopAnimation();
                        try {
                            console.log(response);
                            toastr.success('Company status is changed successfully.');
                         } catch (e) {
                            toastr.error('Company status is changed successfully.');
                            Raven.captureException(e)
                        }
                    }, function myError(r) {
                        toastr.error(r.data.message, 'Sorry!');
                    });
                  } else { 
                    console.log("cancel");
                }
                    
            }, function(dismiss) {
                if (dismiss === 'cancel') {
                    setTimeout(function(){
                        cmp.init();
                    },100);  
                }
            }).catch(swal.noop);
    }

    cmp.init();

});