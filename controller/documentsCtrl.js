app.controller('documentsCtrl', function ($scope,menuService,services,$cookieStore) {

	var doc = this;
	doc.downloadBgCheckForm = function(){
        var promise = services.downloadBackgroundForm();
    }

    doc.init = function(){
        $scope.file='';
    }

    $scope.getTheFiles = function ($files) {
        $scope.file=$files[0];
    };

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
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    doc.uploadBgCheckForm = function(){
        if($("#backgroundUploadForm").valid()){
            var json= new FormData();
            json.append("file_name",$scope.file);
            json.append("candidate_id",doc.candidate_id);
            json.append("timestamp",doc.timestamp);
            json.append("file_type","background_check");
            
            var promise2 = services.uploadBackgroundDocFile(json);
            promise2.then(function mySuccess(response) {
                Utility.stopAnimation();
                // console.log(response.data.message);
                if(response.data.status_code == 200){
                    toastr.success(response.data.message);
                }else{
                    toastr.error(response.data.message);
                }
                $('#file').val('');
            }, function myError(r) {
                toastr.error(r.data.message);
                Utility.stopAnimation();
            }); 
        }
    }

    doc.downloadSampleForm = function(){
        var promise = services.downloadSampleBackgroundForm();
    }

    doc.fetchCandidateInfo();
});