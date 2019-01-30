app.controller('backgroundChecklistCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var bcl = this;

    bcl.id = null;
    bcl.title = 'Add New Background Checklist';
    bcl.pageno = 0;
    bcl.limit = 0;
    bcl.skip = true;
    bcl.backgroundCheckList =[];

    // bcl.mandatoryFieldData =[{id: 1, name: "True"},{id: 2, name: "False"}];

    /* To fetch data according table length */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            bcl.fetchList(-1);
        });
    },100);

    /* Function to load add background checklist view */
    bcl.addNewBackgroundChecklist = function(){
    	$location.url('/background_checklist/add_background_checklist');
    }

    /* Function to cancle background checklist form */
    bcl.cancelBackgroundChecklist = function() {
        $location.url('/background_checklist');
    }

    /* Function to fetch background checklist list */
    bcl.fetchList = function(page){
        bcl.limit = $('#table_length').val();
        if(bcl.limit == undefined){
            bcl.limit = -1;
        }
        if(page == -1){
            bcl.pageno = 1;
            if($('#pagination-sec').data("twbs-pagination")){
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            bcl.pageno = page;
        }
        var requestParam = {
            page:bcl.pageno,
            // limit:pagination.getpaginationLimit(),
            limit:bcl.limit,
        }
        var promise = services.getAllBackgroundCheckList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.data != null){
                bcl.backgroundCheckList = result.data.data;
                pagination.applyPagination(result.data,bcl);
            }else{
                bcl.backgroundCheckList = null;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    /* Function to initialise background checklist controller */
    bcl.init = function(){
        bcl.limit = $('#table_length').val();
        bcl.fetchList(-1);        
        /* Editing perticular background checklist*/
        bcl.id = $location.search()["id"];
        if (bcl.id > 0) {
            var promise = services.getBackgroundChecklistById(bcl.id);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                bcl.title = 'Update Background Checklist';
                bcl.bgChecklistName = response.data.data.name,
                // bcl.mandatoryField = response.data.data.mandatory==1?"True":"False",
                bcl.status = response.data.data.status,
                bcl.fieldType = response.data.data.type             
                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function reset create background checklist form */
    bcl.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        bcl.bgChecklistName ='';
        // bcl.mandatoryField ='';
    }

    /* Function to create/update new background checklist */
    bcl.createBackgroundChecklist = function(){
        if ($("#backgroundChecklistForm").valid()) {
            var req ={
                "name":bcl.bgChecklistName,
                // "mandatory":bcl.mandatoryField=='True'?1:0,
                "mandatory":1,
                "type":bcl.fieldType
            }

            var promise;
            if (bcl.id) {
                req.id = bcl.id;
                promise = services.updateBackgroundChecklist(req);
                var operationMessage = "updated";
            } else {
                promise = services.saveBackgroundChecklist(req);
                operationMessage = "created";
            }
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Background checklist ' + operationMessage +' successfully.');
                    $location.url('/background_checklist');
                } catch (e) {
                    toastr.error("Background checklist is not saved successfully.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to change background checklist status */
    bcl.changeBgChecklistStatus = function(status,id,index){
        var req = {
            "id":id,
            "status": status == true ? 1 : 0
        };
        swal({
                title: "Sure?",
                text: "Are you sure you want to change background checklist status?",
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
                    var promise = services.updateBackgroundChecklistStatus(req);
                        promise.then(function mySuccess(response) {
                        Utility.stopAnimation();
                        try {
                            console.log(response);
                            toastr.success('Background checklist status is changed successfully.');
                         } catch (e) {
                            toastr.error('Background checklist status is changed successfully.');
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
                        bcl.init();
                    },100);  
                }
            }).catch(swal.noop);
    }

    bcl.init();

});
