app.controller("resumeCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService) {

    var rsm = this;
    // menuService.setMenu([
    //         {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
    //         {"Title": "Resume", "Link": "/resume", "icon": "fa fa-plus", "active":"active"}     
    // ]);

    //Array for experience in months drop down options.
    $scope.experienceMonths = [
        {id: 0, name: "0 month"},
        {id: 1, name: "1 month"},
        {id: 2, name: "2 months"},
        {id: 3, name: "3 months"},
        {id: 4, name: "4 months"},
        {id: 5, name: "5 months"},
        {id: 6, name: "6 months"},
        {id: 7, name: "7 months"},
        {id: 8, name: "8 months"},
        {id: 9, name: "9 months"},
        {id: 10, name: "10 months"},
        {id: 11, name: "11 months"}
    ];
    //Array for experience in years drop down options.
    $scope.experienceYears = [
        {id: 0, name: "0 year"},
        {id: 1, name: "1 year"},
        {id: 2, name: "2 years"},
        {id: 3, name: "3 years"},
        {id: 4, name: "4 years"},
        {id: 5, name: "5 years"},
        {id: 6, name: "6 years"},
        {id: 7, name: "7 years"},
        {id: 8, name: "8 years"},
        {id: 9, name: "9 years"},
        {id: 10, name: "10 years"},
        {id: 11, name: "11 years"},
        {id: 12, name: "12 years"},
        {id: 13, name: "13 years"},
        {id: 14, name: "14 years"},
        {id: 15, name: "15 years"}
    ];

    $scope.technologyList =[{id:1,name:"Java"},{id:2,name:"Android"}];

    $scope.qualifications = [{qualification:"",stream:"",percentage:""}];

    $scope.achievements =[{other_achievements:""}];

    $scope.technicalSkill =[{technologyName:"",relevanceYearExperience:"",relevanceMonthExperience:""}];

    $scope.industryExperiance = [{companyName:"",projectName:"",projectRole:"",toolsUsed:"",projectDescription:""}];

    $scope.hobbyDiv = [{hobbie:""}];

    $scope.init = function(){
		/* Getting all qualification list */
        var promise = services.getAllQualificationList();
        promise.success(function (result) {
            Utility.stopAnimation();
            $scope.allQualificationList = result.data.data;
            console.log($scope.allQualificationList);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
	}

   	$scope.appendQualificationDiv = function(){

   		$scope.qualifications.push({qualification:"",stream:"",percentage:""})
    }

    $scope.appendAchievementDiv = function(){
        $scope.achievements.push({other_achievements:""});
    }

    $scope.appendTechnicalSkillDiv = function(){
        $scope.technicalSkill.push({technologyName:"",relevanceYearExperience:"",relevanceMonthExperience:""});
    }

    $scope.appendIndustrialExperienceDiv = function(){
        $scope.industryExperiance.push({companyName:"",projectName:"",projectRole:"",toolsUsed:"",projectDescription:""});
    }

    $scope.appendHobbiesDiv = function(){
         $scope.hobbyDiv.push({hobbie:""});
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
            for(var i=0;i<$scope.allQualificationList.length;i++){
                for(var j=0;j<$scope.qualifications.length;j++){
                    if($scope.allQualificationList[i].id==$scope.qualifications[j].qualification){
                       $scope.qualifications[j].qualificationName =  $scope.allQualificationList[i].name;
                    }
                }
            }
             $('#previewModal').modal('show');     
        }
    }

    $scope.changeBackground =function(index){
         // console.log("index", index);
        // console.log("Q", $scope.achivements);
        console.log("T", $scope.technicalSkill);
        // console.log("I", $scope.industryExperiance);
        // console.log("H", $scope.hobbyDiv);
       
    }

    $scope.saveResumeData = function(){
    	var myData = $("#resumeForm").serializeArray();
    	console.log("in save function");
    	console.log(myData);
    	// $("#previewModal").show();
    }

    $scope.init();
   
});

