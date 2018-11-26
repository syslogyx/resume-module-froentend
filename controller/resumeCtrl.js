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
    $scope.currentCTC = null;

    // console.log($routeParams.token);
    // $scope.jobDetail=[
    //     {id: 1, name: "Android"},
    //     {id: 2, name: "Java"}
    // ];

    $scope.getActiveJd = function(){
         var promise = services.getAllActiveJDList();
        promise.success(function (result) {
            Utility.stopAnimation();
            $scope.jobDetail = result.data; 
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    //Array for experience in months drop down options.
    $scope.experienceMonths = RESOURCES.MONTHS;

    //Array for experience in years drop down options.
    $scope.experienceYears = RESOURCES.YEARS;

     //Array for job oppoertunities drop down options.
    $scope.jobOpportunityFor = RESOURCES.OPPORTUNITYFOR;

    $scope.genderOptions = RESOURCES.GENDER;
    $scope.martialStatusOptions = RESOURCES.MARITAL_STATUS;
    $scope.achivementTypesOptions = RESOURCES.ACHIVEMENT_TYPES;

    $scope.totalYearIndustryExperiance = $scope.experienceYears[0].id;
    $scope.totalMonthIndustryExperiance = $scope.experienceMonths[0].id;

    $scope.technologyList =[{id:1,name:"Java"},{id:2,name:"Android"}];

    $scope.qualifications = [{qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""}];

    $scope.achievements =[{achivement:"",achievement_type:""}];

    $scope.technicalSkill =[{technology_name:"",relevanceYearExperience:"0",relevanceMonthExperience:"0"}];

    $scope.industryExperiance = [{company_name:"",project_name:"",role_in_project:"",language_or_tools:"",project_description:""}];

    $scope.hobbyDiv = [{hobbie_name:""}];

    $scope.summaryDiv = [{summary:""}];
    $scope.objectiveDiv = [{objective:""}];

    $scope.datepickerInit = function(){
     // console.log($scope.qualifications);

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

    $('#opportunity_for').on('change',function(){
        console.log($(this).val());
        //if user select freshers (1 is constant for fresher)
        if($(this).val() == 'Fresher'){
            $scope.currentCTC = 0;
            $scope.totalYearIndustryExperiance = $scope.experienceYears[0].id;
            $scope.totalMonthIndustryExperiance = $scope.experienceMonths[0].id;
            $scope.industryExperiance[0].company_name = "NA";
            $scope.industryExperiance[0].project_name = "NA";
            $scope.industryExperiance[0].role_in_project = "NA";
            $scope.industryExperiance[0].language_or_tools = "NA";
            $scope.industryExperiance[0].project_description = "NA";
            $(".addDisabledProperty").each(function() {
              $(this).prop('disabled', true);
            });
        }else{
            $scope.currentCTC = null;
            $scope.totalYearIndustryExperiance = $scope.experienceYears[0].id;
            $scope.totalMonthIndustryExperiance = $scope.experienceMonths[0].id;
            $scope.industryExperiance[0].company_name = "";
            $scope.industryExperiance[0].project_name = "";
            $scope.industryExperiance[0].role_in_project = "";
            $scope.industryExperiance[0].language_or_tools = "";
            $scope.industryExperiance[0].project_description = "";
            $(".addDisabledProperty").each(function() {
              $(this).prop('disabled', false);
            });
        }        
    });



    $scope.init = function(){
		/* Getting all qualification list */
        $('#dob').datepicker({
            // format: "yyyy-mm-dd",
            autoclose: true,
            todayHighlight: true
        }).on('show', function(e){
            var date = new Date();
            $('#dob').datepicker('setEndDate', date);
        }).on("changeDate", function (e) {
            $(this).valid();
            $scope.dateOfBirth = $(this).val();
            // console.log($scope.dateOfBirth);
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

        $scope.getActiveJd();
	}



    setTimeout(function() { $scope.datepickerInit();}, 500);

    $scope.appendSummaryDiv = function(){
        $scope.summaryDiv.push({summary:""});
    }

    $scope.appendObjectiveDiv = function(){
        $scope.objectiveDiv.push({objective:""});
    }

   	$scope.appendQualificationDiv = function(){

   		$scope.qualifications.push({qualification_id:"",stream:"",percentage:"",university:"",college:"",start_year:"",end_year:""})
        setTimeout(function() { $scope.datepickerInit();}, 500);
    }

    $scope.appendAchievementDiv = function(){
        $scope.achievements.push({achivement:"",achievement_type:""});
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

    $scope.removeSummary = function(index){
        for (var i = ($scope.summaryDiv.length - 1); i >= 0; i--) {
            if( i == index){
                $scope.summaryDiv.splice(index, 1);
            }
        }
    }

    $scope.removeObjective = function(index){
        for (var i = ($scope.objectiveDiv.length - 1); i >= 0; i--) {
            if( i == index){
                $scope.objectiveDiv.splice(index, 1);
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
             // console.log(json);
             $scope.quaData = json;
             return json;
    }

    $scope.getTheFiles = function ($files) {
        
            $scope.file=$files[0];
            // console.log($scope.file);
    };

    $scope.saveResumeData = function(){
        console.log($scope.summaryDiv);
    if($('.wizard-card form').valid()){
            $('#previewModal').modal('hide');
            $("#wizardResumeSuccessmsg").css('display','none');

            var cSummaryArray = [];           
            for (var i = 0; i < $scope.summaryDiv.length; i++) {
                cSummaryArray.push($scope.summaryDiv[i].summary);
            }

            var cObjectivesArray = [];           
            for (var i = 0; i < $scope.objectiveDiv.length; i++) {
                cObjectivesArray.push($scope.objectiveDiv[i].objective);
            }
            // console.log(summaryArray);
            //to remove $$hashkey from array        	
            for (var i = 0; i < $scope.quaData.length; i++) {
                delete $scope.quaData[i]['$$hashKey'];
            }

            $scope.achievements1 = JSON.parse(angular.toJson( $scope.achievements ));
            $scope.technicalSkill1 = JSON.parse(angular.toJson( $scope.technicalSkill ));
            $scope.industryExperiance1 = JSON.parse(angular.toJson( $scope.industryExperiance ));
            $scope.hobbyDiv1 = JSON.parse(angular.toJson( $scope.hobbyDiv ));


            var req = {
                "first_name":$scope.firstName,
                "middle_name":$scope.middleName,
                "last_name":$scope.lastName,
                "email":$scope.email,
                "gender":$scope.gender,
                "marital_status":$scope.martialStatus,
                "mobile_no":$scope.mobileNumber,
                "date_of_birth":$scope.dateOfBirth.split("/").reverse().join("-"),
                "pan_number":$scope.panNumber,
                "passport":$scope.passportNumber,
                "corresponding_address":$scope.correspondingAddr,
                "permanent_address":$scope.permanentAddr,
                "objective":JSON.stringify(cObjectivesArray),
                "summary":JSON.stringify(cSummaryArray),
                "status":"",
                "timestamp":"",
                "job_description_id":$scope.job_id,
                "opprtunity_for":$scope.opportunityFor,
                "expired_on":"",
                "unique_token":$routeParams.token,
                "total_experience":$scope.totalYearIndustryExperiance+'.'+$scope.totalMonthIndustryExperiance,
                "ctc":$scope.currentCTC,
                "educationalDetails":$scope.quaData,
                "achivementDetails":$scope.achievements1,
                "technicalSkill":$scope.technicalSkill1,
                "industryExperiance":$scope.industryExperiance1,
                "hobbyDetails":$scope.hobbyDiv1,
                "foreign_languages":$scope.foreignLang,
                "indian_languages":$scope.indianLang
            }
           
            console.log(req);
            debugger;
                var promise = services.createCandidate(req,type='Data');
                promise.then(function mySuccess(response) {
                    if(response.data.status_code == 200){
                        // debugger;
                        var json= new FormData();
                        json.append("file_name",$scope.file);
                        json.append("candidate_id",response.data.data.id);
                        json.append("timestamp",response.data.data.timestamp);
                        
                        var promise2 = services.uploadresumeFile(json);
                        promise2.then(function mySuccess(response) {
                        Utility.stopAnimation();
                        try {
                            toastr.success('file uploaded successfully.');

                        } catch (e) {
                            toastr.error("file not uploaded successfully.");
                            Raven.captureException(e)
                            }
                        }, function myError(r) {
                            toastr.error('something went wrong');
                            Utility.stopAnimation();
                        });                                    
                    }

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

    $scope.setSpellcheckMsg = function(i,type){
        // console.log("index >>"+i);
        if(type == 'project'){
            $Spelling.SpellCheckInWindow('projectDescription_'+i); 
        }else if(type == 'objective'){
            $Spelling.SpellCheckInWindow('objective_'+i); 
        }else if(type == 'summary'){
            $Spelling.SpellCheckInWindow('summary_'+i); 
        }
        return false;
    }

    $scope.callSpellchecker = function(index,type){
        console.log("index >>"+index);
        console.log("type >>"+type);
        if(type == 'project'){
            $Spelling.LiveFormValidation  ('projectDescription_'+index, 'project_msg'+index );
        }else if(type == 'summary'){
            $Spelling.LiveFormValidation  ('summary_'+index, 'summary_msg'+index );
        }else if(type == 'objective'){
            $Spelling.LiveFormValidation  ('objective_'+index, 'objective_msg'+index );
        }
    }



    $scope.init();

});
