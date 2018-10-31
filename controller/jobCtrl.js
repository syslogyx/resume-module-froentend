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
    jb.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    jb.createJob = function(){
        if ($("#jobForm").valid()) {

        }
     }

});