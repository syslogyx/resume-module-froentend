app.controller('documentsCtrl', function ($scope,menuService,services,$cookieStore) {

	var doc = this;
    $scope.files = [];

	doc.downloadBgCheckForm = function(){
        var promise = services.downloadBackgroundForm();
    }

    doc.init = function(){
        $scope.file='';
        doc.backgroundCheckList = [
            {
                "id": 1,
                "name": "BA BGC Form",
                "type": "file",
                "mandatory": "1",
                "status": "Active",
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 2,
                "name": "Address Proof",
                "type": "file",
                "mandatory": "1",
                "status": "Active",
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 3,
                "name": "Intermediate",
                "type": "file",
                "mandatory": "1",
                "status": "Active",
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 4,
                "name": "Graduation",
                "type": "file",
                "mandatory": "1",
                "status": "Active",
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 5,
                "name": "Post-graduation",
                "type": "file",
                "mandatory": "1",
                "status": "Active",
                "created_at": null,
                "updated_at": null
            }
        ];
    }

    $scope.getTheFiles = function ($files) {
        $scope.files=$files;
        // console.log($scope.files);
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

    doc.uploadBgCheckForm = function(bg_check_id,formIndex){
        // console.log(bg_check_id);
        // console.log($scope.files);
        // if($("#backgroundUploadForm").valid()){
          
            var form = document.forms[formIndex];
            var json = new FormData(form);
            
            json.append("file_name",$scope.files);
            json.append("candidate_id",doc.candidate_id);
            json.append("bg_checklist_id",bg_check_id);
            json.append("timestamp",doc.timestamp);
            console.log(json);
            
            var promise2 = services.uploadBackgroundDocFile(json);
            // promise2.then(function mySuccess(response) {
            //     Utility.stopAnimation();
            //     // console.log(response.data.message);
            //     if(response.data.status_code == 200){
            //         toastr.success(response.data.message);
            //     }else{
            //         toastr.error(response.data.message);
            //     }
            //     $('#file').val('');
            // }, function myError(r) {
            //     toastr.error(r.data.message);
            //     Utility.stopAnimation();
            // }); 
        // }
    }

    doc.downloadSampleForm = function(){
        var promise = services.downloadSampleBackgroundForm();
    }

    doc.fetchCandidateInfo();
    doc.init();
});