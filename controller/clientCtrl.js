app.controller('clientCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var cmp = this;

    cmp.id = null;
    cmp.title = 'Add New Client';
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

    /* Function to load add client view */
    cmp.addNewClient = function(){
    	$location.url('/client/add_client');
    }

    /* Function to cancle client form */
    cmp.cancelClient = function() {
        $location.url('/client');
    }

    /* Function to fetch client list */
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
                cmp.clientList = result.data.data;
                pagination.applyPagination(result.data,cmp);
            }else{
                cmp.clientList = null;
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
                cmp.title = 'Update Client';
                cmp.clientName = response.data.data.name,
                cmp.contactNo = response.data.data.contact_no,
                cmp.address = response.data.data.address,
                cmp.clientEmail = response.data.data.email,
                cmp.status = response.data.data.status                
                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function reset create client form */
    cmp.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        cmp.clientName ='';
        cmp.contactNo ='';
        cmp.address ='';
    }

    /* Function to create/update new client */
    cmp.createClient = function(){
        if ($("#companyForm").valid()) {
            var req ={
                "name":cmp.clientName,
                "contact_no":cmp.contactNo,
                "address":cmp.address,
                "email":cmp.clientEmail
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
                    toastr.success('Client ' + operationMessage +' successfully.');
                    $location.url('/client');
                } catch (e) {
                    toastr.error("Unable to save client data.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                var htmlerror ='<ul style="list-style:none;"><li >';
                $.each(r.data.data, function(k, v) {
                    if(k=='email'){
                        htmlerror = htmlerror+v +'</li><li>';
                    }
                    if(k=='contact_no'){
                        htmlerror = htmlerror+v+'</li><li>';
                    }
                  });
                toastr.error(htmlerror);
                // toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to change client status */
    cmp.changeClientStatus = function(status,id,index){
        var req = {
            "id":id,
            "status": status == true ? 1 : 0
        };
        swal({
                title: "Sure?",
                text: "Are you sure you want to change client status?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes",
                allowOutsideClick: false,
            }).then(function(isConfirm) {
                console.log(isConfirm);
                if (isConfirm) {
                    var promise = services.updateCompanyStatus(req);
                        promise.then(function mySuccess(response) {
                        Utility.stopAnimation();
                        try {
                            console.log(response);
                            toastr.success('Client status is changed successfully.');
                         } catch (e) {
                            toastr.error('Client status is changed successfully.');
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