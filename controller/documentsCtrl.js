app.controller('documentsCtrl', function ($scope,menuService,services,$cookieStore) {

	var doc = this;
    $scope.files = [];

	doc.downloadBgCheckForm = function(){
        var promise = services.downloadBackgroundForm();
    }

    doc.init = function(){
        $scope.file='';
        doc.fetchCandidateInfo();
    }

    doc.fetchCandidateInfo =  function(){
        var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
        var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
        var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
        if(email != undefined && mobile != undefined){
            var req ={
                "mobile":mobile,
                "email":email
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

    doc.getBackgroundCheckList = function(){
        console.log(doc.candidate_id);
        var promise = services.getAllBgCheckList(doc.candidate_id);
            promise.success(function (result) {
            Utility.stopAnimation();
            doc.backgroundCheckList = result.data;
           
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    $scope.getTheFiles = function ($files) {
        $scope.files=$files;
        // console.log($files);
    };

    

    doc.uploadBgCheckForm = function(bg_check_id,formIndex){
        // console.log(bg_check_id);
        // console.log($scope.files);
        // console.log(formIndex);
        if($("#backgroundUploadForm_"+bg_check_id).valid()){
          // console.log("True");
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
                toastr.error(r.data.message);
                Utility.stopAnimation();
            }); 
        }
    }

    doc.downloadSampleForm = function(){
        var promise = services.downloadSampleBackgroundForm();
    }

    
    doc.init();
});