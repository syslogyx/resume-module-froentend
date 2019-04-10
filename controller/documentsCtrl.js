app.controller('documentsCtrl', function ($scope,menuService,services,$cookieStore,RESOURCES) {

	var doc = this;
    $scope.files = [];

    /* Fetch login candidate info from cookies*/
    var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
    doc.email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
    doc.mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
    doc.name = loggedInUser == undefined ? undefined :loggedInUser.identity.name;
    console.log(loggedInUser);
    // console.log(doc.name);
    /* Function to download background_checklist form */
	doc.downloadBgCheckForm = function(){
        var promise = services.downloadBackgroundForm();
    }

    /* Function to intialise controller */
    doc.init = function(){
        $scope.file='';
        doc.fetchCandidateInfo();
    }

    /* Function to fetch login candidate info */
    doc.fetchCandidateInfo =  function(){        
        if(doc.email != undefined && doc.mobile != undefined){
            var req ={
                "mobile":doc.mobile,
                "email":doc.email
            };
            var promise = services.getCandidateInfo(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                var res = response.data;
                if(res.status_code == 200){
                    doc.candidate_id = res.data.id;
                    doc.timestamp = res.data.timestamp;
                    doc.getBackgroundCheckList();
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to get all bg_checklist data */
    doc.getBackgroundCheckList = function(){
        console.log(doc.candidate_id);
        var promise = services.getAllBgCheckList(doc.candidate_id,'candidate_view');
            promise.success(function (result) {
            Utility.stopAnimation();
            doc.backgroundCheckList = result.data;
            for (var i = 0; i < doc.backgroundCheckList.length; i++) {
                   doc.backgroundCheckList[i]['alias'] = doc.backgroundCheckList[i].name.replace(/[\s]/g, '').replace(/[^a-zA-Z ]/g, '');
            }   
            console.log(doc.backgroundCheckList);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to get selected file of bg_checklist */
    $scope.getTheFiles = function ($files) {
        $scope.files=$files;
    };

    /* Function to upload documents for each bg_checklist */
    doc.uploadBgCheckForm = function(bg_check_id,formIndex,alias){
        var candiate_name = doc.name.replace(/[\s]/g, '');
        if($("#backgroundUploadForm_"+bg_check_id).valid()){
            var form = document.forms[formIndex];
            var json = new FormData(form);
            console.log($scope.files);
            for (var i = 0; i < $scope.files.length; i++) {
                var file = $scope.files[i];
                // Add the file to the request.
                json.append('file_name[]', file, file.name);
            }
            json.append("candidate_id",doc.candidate_id);
            json.append("bg_checklist_id",bg_check_id);
            json.append("timestamp",doc.timestamp);            
            json.append("bg_name",alias);            
            json.append("candidate_name",candiate_name);            
            var promise2 = services.uploadBackgroundDocFile(json);
            promise2.then(function mySuccess(response) {
                Utility.stopAnimation();
                if(response.data.status_code == 200){
                    toastr.success(response.data.message);
                }else{
                    toastr.error(response.data.message);
                }
                $('#file').val('');
                doc.init();
            }, function myError(r) {
                if(r.status_code == 500){
                    toastr.error(r.message);
                }else{
                    toastr.error(r.data.message);
                }
                Utility.stopAnimation();
            }); 
        }
    }

    /* Function to download sample backgroud form */
    doc.downloadSampleForm = function(){
        var promise = services.downloadSampleBackgroundForm();
    }

    doc.downloadCandidateUploadFile =  function(documentId){
        var promise = services.downloadBgFileByFileID(documentId);
    }

    doc.deleteDocumentByID = function(documentId){
        swal({
            title: "Sure?",
            text: "Do you want to delete file?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            animation: false,
            customClass: 'animated tada',
            allowOutsideClick: false,
        }).then(function(isConfirm) {
            if (isConfirm) {
                var promise = services.deleteCandidateBgFileByID(documentId);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        if(response.data.status_code == 200){
                            toastr.success('File is deleted successfully.');
                            setTimeout(function(){
                                doc.init();
                            },100);    
                        }else if(response.data.status_code == 201){
                            toastr.error(response.data.message, 'Sorry!');
                        }
                    } catch (e) {
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            } else { 
                console.log("cancel");
            }      
        }).catch(swal.noop);
    }

    doc.init();
});