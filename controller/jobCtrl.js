app.controller('jobCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var jb = this;

    jb.id = null;
    jb.title = 'Add New Job';
    jb.pageno = 0;
    jb.limit = 0;
    jb.skip = true;
    jb.jobList ='';
    jb.jobTypeData =[
        {id: "Permanent-full time", name: "Permanent-full time"},
        {id: "Permanent-part time", name: "Permanent-part time"},
        {id: "Contract basis-full time", name: "Contract basis-full time"},
        {id: "Contract basis-part time", name: "Contract basis-part time"},
        {id: "Freelancer-full time", name: "Freelancer-full time"},
        {id: "Freelancer-part time", name: "Freelancer-part time"}
    ];
    jb.jobType ="Permanent-full time";

    jb.jobStatusData = RESOURCES.JOB_STATUS;
   // jb.changeStatus = 0;
   // jb.changeStatus = jb.jobStatusData[0].id;   

    setTimeout(function(){
        $('#table_length').on('change',function(){
            jb.fetchList(-1);
        });
    },100);

    jb.addNewJob = function(){
    	$location.path('/jobs/add_job');
    }

    jb.cancelJob = function() {
         $location.path('/jobs');
    }

    jb.fetchList = function(page){
        jb.limit = $('#table_length').val();
        if(jb.limit == undefined){
            jb.limit = -1;
        }
        if(page == -1){
            jb.pageno = 1;
            // console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            jb.pageno = page;
        }
        var requestParam = {
            page:jb.pageno,
            // limit:pagination.getpaginationLimit(),
            limit:jb.limit,
        }

        var promise = services.getAllJobList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.data != null){
                jb.jobList = result.data.data;
                pagination.applyPagination(result.data,jb);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    jb.init = function(){

        jb.limit = $('#table_length').val();
        jb.fetchList(-1);        

        /* Editing perticular job*/
        jb.id = $location.search()["id"];
        if (jb.id > 0) {
            var promise = services.getJobById(jb.id);
            promise.then(function mySuccess(response) {
                // console.log(response.data);
                Utility.stopAnimation();
                jb.title = 'Update Job';
                jb.jobTitle = response.data.data.title,
                jb.subTitle = response.data.data.sub_title,
                jb.description = response.data.data.description,
                jb.requirementNo = response.data.data.no_of_requiremet,
                jb.experiance = response.data.data.experience,
                jb.requiredSkill = response.data.data.skills_required,
                jb.additionalSkill = response.data.data.additional_skills,
                jb.roleResponsibility = response.data.data.roles_and_responsibility,
                jb.jobLocation = response.data.data.job_location,
                jb.jobType = response.data.data.job_type,
                jb.ctc = response.data.data.ctc,
                jb.noticePeroid = response.data.data.notice_period,
                jb.status = response.data.data.status,                
                jb.job_code = response.data.data.job_code,                

                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    jb.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        jb.changeStatus ='';
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
                "notice_period":jb.noticePeroid
                //"status":jb.status
            }

            var promise;
            if (jb.id) {
                // console.log(jb);
                req.id = jb.id;
                req.job_code = jb.job_code;
                promise = services.updateJob(req);
                var operationMessage = "updated";
            } else {
                promise = services.saveJob(req);
                operationMessage = "created";
            }
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Job ' + operationMessage +' successfully.');
                    $location.url('/jobs');
                } catch (e) {
                    toastr.error("Job not saved successfully.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    // jb.changeStatus = function(jobId){
    //     $("#changeStatusModal").modal("toggle");
    // }

    // jb.updateStatus = function(jobId){
    //     if ($("#changeStatusForm").valid()) {
    //         var req ={
    //             "id":jobId,
    //             "status":jb.changeStatus
    //         }
    //         console.log(req);
    //         var promise = services.updateJobStatus(req);
    //         promise.then(function mySuccess(response) {
    //             Utility.stopAnimation();
    //             try {
    //                 toastr.success('Job status successfully.');
    //             } catch (e) {
    //                 toastr.error("Job status not saved successfully.");
    //                 Raven.captureException(e)
    //             }
    //         }, function myError(r) {
    //             toastr.error('Something went wrong');
    //             Utility.stopAnimation();
    //         });
    //     }
    // }

    jb.changeJobStatus = function(status,id){
        // console.log(status);
        // console.log(id); 
        swal({
            title: "Sure?",
            text: "Are you sure you want to change job status?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            confirmButtonText: "Yes",
        }).then(function () {
            var req = {
                "id":id,
                "status": status == true ? 1:0
            };
            console.log(req);
            var promise = services.updateJobStatus(req);
            promise.then(function mySuccess(response) {
                //console.log(response.data.status_code);
                if(response.data.status_code == 200){
                    toastr.success(response.data.message);
                }else{
                    toastr.error(response.data.message, 'Sorry!');
                }
                jb.fetchList(-1);
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });            
        }, function (dismiss) {
            jb.fetchList(-1);
        });
    }

    jb.init();

});