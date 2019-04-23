app.controller('jobCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore, pagination, RESOURCES) {

    var jb = this;

    jb.id = null;
    jb.title = 'Add New Job';
    jb.pageno = 0;
    jb.limit = 0;
    jb.skip = true;
    jb.jobList = [];
    jb.technologyList = [];
    jb.jobTypeData = [
        { id: "Permanent-full time", name: "Permanent-full time" },
        { id: "Permanent-part time", name: "Permanent-part time" },
        { id: "Contract basis-full time", name: "Contract basis-full time" },
        { id: "Contract basis-part time", name: "Contract basis-part time" },
        { id: "Freelancer-full time", name: "Freelancer-full time" },
        { id: "Freelancer-part time", name: "Freelancer-part time" }
    ];

    jb.jobType = "Permanent-full time";
    var loggedInUser = services.getIdentity() == undefined ? undefined : JSON.parse(services.getIdentity());
    jb.loggedRoleId = loggedInUser == undefined ? undefined : loggedInUser.identity.role;

    jb.jobStatusData = RESOURCES.JOB_STATUS;
    // jb.changeStatus = 0;
    // jb.changeStatus = jb.jobStatusData[0].id; 

    jb.searchJobDescription = function () {
        jb.fetchList(-1);
    }

    /* To fetch data according table length */
    setTimeout(function () {
        $('#table_length').on('change', function () {
            jb.fetchList(-1);
        });
    }, 100);

    /* Function to open add-job url */
    jb.addNewJob = function () {
        $location.url('/jobs/add_job');
    }

    /* To cancle add-job form */
    jb.cancelJob = function () {
        $location.url('/jobs');
    }

    /* Function to fetch all job list data */
    jb.fetchList = function (page) {
        jb.limit = $('#table_length').val();
        if (jb.limit == undefined) {
            jb.limit = -1;
        }
        if (page == -1) {
            jb.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            jb.pageno = page;
        }
        var requestParam = {
            page: jb.pageno,
            limit: jb.limit,
        }

        if (jb.loggedRoleId != 6) {
            var promise = services.getAllJobList(requestParam);
            promise.success(function (result) {
                Utility.stopAnimation();
                if (result.data != null) {
                    jb.jobList = result.data.data;
                    $scope.totalRequirement = 0;
                    pagination.applyPagination(result.data, jb);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        } else {
            var email = loggedInUser == undefined ? undefined : loggedInUser.identity.email;
            var mobile = loggedInUser == undefined ? undefined : loggedInUser.identity.mobile;

            var req = {
                'email': email,
                'contact_no': mobile,
                // "technology_id":jb.technologyId
            }
            var promise = services.getAllJobListByCompanyDetails(requestParam, req);
            promise.success(function (result) {
                Utility.stopAnimation();
                if (result.data != null) {
                    jb.jobList = result.data.data;
                    $scope.totalRequirement = 0;
                    pagination.applyPagination(result.data, jb);
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        }
    }

    /* Function to initialise job controller */
    jb.init = function () {
        jb.limit = $('#table_length').val();

        /* Editing perticular job*/
        jb.id = $location.search()["id"];
        jb.technologyId = $location.search()["tech_id"];
        if (jb.id > 0) {
            var promise = services.getJobById(jb.id);
            promise.then(function mySuccess(response) {
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
                jb.companyId = response.data.data.company_id,
                jb.companyName = response.data.data.companies.name,
                jb.project_title = response.data.data.project_title,
                jb.technology = response.data.data.technology_id,
                jb.technologyName = response.data.data.technologies.name,
                jb.valid_till_date = response.data.data.valid_till_date != null ? response.data.data.valid_till_date.split("-").reverse().join("/") : ''
                applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        } else {
            jb.fetchList(-1);
        }

        jb.getActiveCompanyList();
        jb.getActvieTechnologyListList();
    }

    jb.resetFilter = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        jb.technologyId = '';
        jb.fetchList(-1);
    }


    jb.getActiveCompanyList = function () {
        var promise = services.getAllActvieCompanyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            jb.companyList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    jb.getActvieTechnologyListList = function () {
        var promise = services.getAllActvieTechnologyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            jb.technologyList = result.data;
        }, function myError(r) {
            jb.technologyList = [];
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to reset add job form */
    jb.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        jb.changeStatus = '';
        $('#valid_till_date').datepicker('setDate', null);
    }

    /* Function to create/update job */
    jb.createJob = function () {
        if ($("#jobForm").valid()) {
            var req = {
                "title": jb.jobTitle,
                "sub_title": jb.subTitle,
                "description": jb.description,
                "no_of_requiremet": jb.requirementNo,
                "experience": jb.experiance,
                "skills_required": jb.requiredSkill,
                "additional_skills": jb.additionalSkill,
                "roles_and_responsibility": jb.roleResponsibility,
                "job_location": jb.jobLocation,
                "job_type": jb.jobType,
                "ctc": jb.ctc,
                "notice_period": jb.noticePeroid,
                "company_id": jb.companyId,
                "project_title": jb.project_title,
                "technology_id": jb.technology,
                "valid_till_date": jb.valid_till_date.split("/").reverse().join("-"),
                //"status":jb.status
            }
            var promise;
            if (jb.id) {
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
                    toastr.success('Job ' + operationMessage + ' successfully.');
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

    /* Function to change job status by job id */
    jb.changeJobStatus = function (status, id) {
        swal({
            title: "Sure?",
            text: "Are you sure you want to change job status?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            allowOutsideClick: false,
        }).then(function () {
            var req = {
                "id": id,
                "status": status == true ? 1 : 0
            };
            var promise = services.updateJobStatus(req);
            promise.then(function mySuccess(response) {
                if (response.data.status_code == 200) {
                    toastr.success(response.data.message);
                } else {
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