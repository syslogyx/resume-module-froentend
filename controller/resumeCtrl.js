app.controller("resumeCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,$routeParams) {

    var rsm = this;

    $scope.ctcKey='Lac';

    $scope.backImgUrls=[
        'resources/img/resumeimg/1_Personal_Details_img.jpg',
        'resources/img/resumeimg/2_Educational_Details_img.jpg',
        'resources/img/resumeimg/3_Other_Achievements_img.jpg',
        'resources/img/resumeimg/4_Technical_Skills_img.jpg',
        'resources/img/resumeimg/5_Industrial_Experience_img.jpg',
        'resources/img/resumeimg/6_Hobbies_Details_img.jpg',
        'resources/img/resumeimg/7_Upload_Document_img.jpg'
    ];

    $scope.backCurrentImg=$scope.backImgUrls[0];

    console.log($routeParams.token);
    $scope.jobDetail=[
        {id: 1, name: "Android"},
        {id: 2, name: "Java"}
   ]
    //Array for experience in months drop down options.
    $scope.experienceMonths = [
        {id: 0, name: "0"},
        {id: 1, name: "1"},
        {id: 2, name: "2"},
        {id: 3, name: "3"},
        {id: 4, name: "4"},
        {id: 5, name: "5"},
        {id: 6, name: "6"},
        {id: 7, name: "7"},
        {id: 8, name: "8"},
        {id: 9, name: "9"},
        {id: 10, name: "10"},
        {id: 11, name: "11"}
    ];
    //Array for experience in years drop down options.
    $scope.experienceYears = [
        {id: 0, name: "0"},
        {id: 1, name: "1"},
        {id: 2, name: "2"},
        {id: 3, name: "3"},
        {id: 4, name: "4"},
        {id: 5, name: "5"},
        {id: 6, name: "6"},
        {id: 7, name: "7"},
        {id: 8, name: "8"},
        {id: 9, name: "9"},
        {id: 10, name: "10"},
        {id: 11, name: "11"},
        {id: 12, name: "12"},
        {id: 13, name: "13"},
        {id: 14, name: "14"},
        {id: 15, name: "15"}
    ];

    $scope.totalYearIndustryExperiance = $scope.experienceYears[0].id;
    $scope.totalMonthIndustryExperiance = $scope.experienceMonths[0].id;

    $scope.technologyList =[{id:1,name:"Java"},{id:2,name:"Android"}];

    $scope.qualifications = [{qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""}];

    $scope.achievements =[{achivement:""}];

    $scope.technicalSkill =[{technology_name:"",relevanceYearExperience:"0",relevanceMonthExperience:"0"}];

    $scope.industryExperiance = [{company_name:"",project_name:"",role_in_project:"",language_or_tools:"",project_description:""}];

    $scope.hobbyDiv = [{hobbie_name:""}];

    $scope.datepickerInit = function(){
     console.log($scope.qualifications);

        $('.start_year').datepicker({
            format: "yyyy",
            autoclose: true,
            minViewMode: "years"
        }).on('changeDate', function(selected){
             $(this).valid();
             $(this).val();
            startDate =  selected.date;
            $('.end_year').datepicker('setStartDate', startDate);
            //$scope.qualifications.start_year = $(this).val();
            //console.log($scope.qualifications);
        }).on("show", function (e) {
            $(this).valid();
        });

        $('.end_year').datepicker({
                format: "yyyy",
                autoclose: true,
                minViewMode: "years"
        }).on("changeDate", function (e) {
            $(this).valid();
            //$scope.qualifications.end_year = $(this).val();
           // console.log($scope.qualifications);
        });
    }



    $scope.init = function(){
		/* Getting all qualification list */
        $('#dob').datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            todayHighlight: true
        }).on('show', function(e){
            var date = new Date();
            $('#dob').datepicker('setEndDate', date);
        }).on("changeDate", function (e) {
            $(this).valid();
            $scope.dateOfBirth = $(this).val();
            console.log($scope.dateOfBirth);
        });

        var promise = services.getAllQualificationList();
        promise.success(function (result) {
            Utility.stopAnimation();
            $scope.allQualificationList = result.data.data;
            for (var i = 0; i < $scope.allQualificationList.length; i++) {
                $scope.allQualificationList[i].id=$scope.allQualificationList[i].id.toString();
            }
            console.log($scope.allQualificationList);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
	}



    setTimeout(function() { $scope.datepickerInit();}, 500);

   	$scope.appendQualificationDiv = function(){

   		$scope.qualifications.push({qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""})
        setTimeout(function() { $scope.datepickerInit();}, 500);
    }

    $scope.appendAchievementDiv = function(){
        $scope.achievements.push({achivement:""});
    }

    $scope.appendTechnicalSkillDiv = function(){
        $scope.technicalSkill.push({technology_name:"",relevanceYearExperience:"0",relevanceMonthExperience:"0"});
    }

    $scope.appendIndustrialExperienceDiv = function(){
        $scope.industryExperiance.push({company_name:"",project_name:"",role_in_project:"",language_or_tools:"",project_description:""});
    }

    $scope.appendHobbiesDiv = function(){
         $scope.hobbyDiv.push({hobbie_name:""});
    }

    $scope.removeQualification = function(index){
        for (var i = ($scope.qualifications.length - 1); i >= 0; i--) {
            if( i == index){
                $scope.qualifications.splice(index, 1);
            }
        }
    }

    $scope.removeAchievements = function(index){
        for (var i = ($scope.achievements.length - 1); i >= 0; i--) {
            if( i == index){
               $scope.achievements.splice(index, 1);
            }
        }
    }

    $scope.removeTechnicalSkill = function(index){
        for (var i = ($scope.technicalSkill.length - 1); i >= 0; i--) {
            if( i == index){
               $scope.technicalSkill.splice(index, 1);
            }
        }
    }

    $scope.removeIndustrialExperience = function(index){
        for (var i = ($scope.industryExperiance.length - 1); i >= 0; i--) {
            if( i == index){
               $scope.industryExperiance.splice(index, 1);
            }
        }
    }

    $scope.removeHobby = function(index){
        for (var i = ($scope.hobbyDiv.length - 1); i >= 0; i--) {
            if( i == index){
                $scope.hobbyDiv.splice(index, 1);
            }
        }
    }

    $scope.showPreview = function(){
        if($('.wizard-card form').valid()){
            $scope.qualificatinData();
            for(var i=0;i<$scope.allQualificationList.length;i++){
                for(var j=0;j<$scope.qualifications.length;j++){
                    if($scope.allQualificationList[i].id==$scope.qualifications[j].qualification_id){
                       $scope.qualifications[j].qualificationName =  $scope.allQualificationList[i].name;
                    }
                }
            }
            
            $('#previewModal').modal('show');
        }
    }

    $scope.changeBackground =function(index){


    }

    // $scope.files = [];
    // $scope.$on("seletedFile", function (event, args) {
    //     $scope.$apply(function () {
    //         $scope.files.push(args.file);
    //     });
    // });

    $scope.qualificatinData = function(){
        var json=[];

            $('html').find('.parentQualification').each(function(){
                var jsonQ={qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""};
                jsonQ.qualification_id=$(this).find('.qualification').val();
                jsonQ.stream=$(this).find('.stream').val();
                jsonQ.percentage=$(this).find('.percentage').val();
                jsonQ.university=$(this).find('.university').val();
                jsonQ.college=$(this).find('.college').val();
                jsonQ.start_year=$(this).find('.start_year').val();
                jsonQ.end_year=$(this).find('.end_year').val();

                json.push(jsonQ);
            })
            $scope.qualifications = json;
             console.log(json);
             $scope.quaData = json;
             return json;
    }



    $scope.saveResumeData = function(){
    if($('.wizard-card form').valid()){
            $('#previewModal').modal('hide');
            $("#wizardResumeSuccessmsg").css('display','none');
        	var json=$scope.qualificatinData();
            // var json=[];

            // $('html').find('.parentQualification').each(function(){
            //     var jsonQ={qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""};
            //     jsonQ.qualification_id=$(this).find('.qualification').val();
            //     jsonQ.stream=$(this).find('.stream').val();
            //     jsonQ.percentage=$(this).find('.percentage').val();
            //     jsonQ.university=$(this).find('.university').val();
            //     jsonQ.college=$(this).find('.college').val();
            //     jsonQ.start_year=$(this).find('.start_year').val();
            //     jsonQ.end_year=$(this).find('.end_year').val();

            //     json.push(jsonQ);
            // })
              console.log(json);


            // $('#parentQualification').find('.stream').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })
            // $('#parentQualification').find('.percentage').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })
            // $('#parentQualification').find('.university').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })
            // $('#parentQualification').find('.college').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })
            // $('#parentQualification').find('.start_year').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })
            // $('#parentQualification').find('.end_year').each(function(){
            //     jsonQ.qualification_id=$(this).val();
            // })


            $scope.qualifications1 = json;
            //$scope.qualifications1 = JSON.parse($scope.qualifications1);
            //console.log($scope.qualifications1);
            $scope.achievements1 = JSON.parse(angular.toJson( $scope.achievements ));
            $scope.technicalSkill1 = JSON.parse(angular.toJson( $scope.technicalSkill ));
            $scope.industryExperiance1 = JSON.parse(angular.toJson( $scope.industryExperiance ));
            $scope.hobbyDiv1 = JSON.parse(angular.toJson( $scope.hobbyDiv ));


            var req = {
                "name":$scope.name,
                "email":$scope.email,
                "mobile_no":$scope.mobileNumber,
                "date_of_birth":$scope.dateOfBirth,
                "pan_number":$scope.panNumber,
                "passport":$scope.passportNumber,
                "corresponding_address":$scope.correspondingAddr,
                "permanent_address":$scope.permanentAddr,
                "objective":$scope.objectives,
                "summary":$scope.summary,
                "status":"",
                "timestamp":"",
                "job_description_id":$scope.job_id,
                "expired_on":"",
                "unique_token":$routeParams.token,
                "total_experience":$scope.totalYearIndustryExperiance+'.'+$scope.totalMonthIndustryExperiance,
                "ctc":$scope.currentCTC,
                "educationalDetails":$scope.qualifications1,
                "achivementDetails":$scope.achievements1,
                "technicalSkill":$scope.technicalSkill1,
                "industryExperiance":$scope.industryExperiance1,
                "hobbyDetails":$scope.hobbyDiv1
            }
            // console.log(req);

                var promise = services.createCandidate(req,type='Data');
                promise.then(function mySuccess(response) {
                             var json={file:$scope.files,id:response.data.id,timestamp:response.data.timestamp}
                            // var promise = services.uploadresumeFile(json);
                            // promise.then(function mySuccess(response) {
                            // Utility.stopAnimation();
                            // try {
                            //     toastr.success('file uploaded successfully.');

                            // } catch (e) {
                            //     toastr.error("file not uploaded successfully.");
                            //     Raven.captureException(e)
                            //     }
                            // }, function myError(r) {
                            //     toastr.error('something went wrong');
                            //    // console.log(r.data.errors.email);
                            //     Utility.stopAnimation();
                            // });

                    Utility.stopAnimation();
                    try {
                        // toastr.success("Thanks for showing your interest! Will get back to you soon!");   
                        $("#wizardProfile").css('display','none');
                        $("#wizardResumeSuccessmsg").css('display','');
                    } catch (e) {
                        $("#wizardResumeSuccessmsg").css('display','none');
                        toastr.error("Profile not saved successfully.");
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    var htmlerror ='<ul style="list-style:none;"><li >';
                    $.each(r.data.data, function(k, v) {
                        if(k=='email'){
                            htmlerror = htmlerror+v +'</li><li>';
                        }
                        if(k=='mobile_no'){
                            htmlerror = htmlerror+v+'</li><li>';
                        }
                        if(k=='pan_number'){
                            htmlerror = htmlerror+v+'</li></ul>';
                        }
                      });
                     toastr.error(htmlerror);

                    Utility.stopAnimation();
                });
        }
    }

    // $scope.file=null;
    // $scope.uploadFile = function(files) {
    //     $scope.file= new FormData();
    //     $scope.file.append("file", files[0]);
    // }

    $scope.init();

});
