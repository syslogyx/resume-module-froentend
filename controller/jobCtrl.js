app.controller('jobCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore) {

    var jb = this;

    jb.id = null;
    jb.title = 'Add New Job';
    jb.jobList ='';

    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"active"},
        {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
        {"Title": "Job List", "Link": "/job_list", "icon": "fa fa-file-text", "active":"deactive"}
    ]);

    jb.addNewJob = function(){
    	$location.path('/job/add_job');
    }

    jb.cancelJob = function() {
         $location.path('/job_list');
    }

    jb.init = function(){
        // var promise = services.getAllJobList();
        //     promise.success(function (result) {
        //     Utility.stopAnimation();
        //     jb.jobList = result.data;
        //      //console.log( jb.jobList);    
        // }, function myError(r) {
        //     toastr.error(r.data.message, 'Sorry!');
        //     Utility.stopAnimation();
        // });
    }

    jb.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    jb.createJob = function(){
        if ($("#jobForm").valid()) {

            var req ={
                "title":jb.jobTitle,
                "sub_title":jb.subTitle,
                "description":jb.description,
                "no_of_requiremet":jb.requirementNo,
                "experience":jb.experiance,
                "skills_required":jb.requiredSkill,
                "additional_skills":jb.additionalSkill,
                "roles_and_responsibility":jb.roleResponsibility,
                "job_location":jb.jobLocation,
                "job_type":jb.jobType,
                "ctc":jb.ctc,
                "notice_period":jb.noticePeroid,
                "status":jb.status
            }

        }
    }

    jb.init();

});