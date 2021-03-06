app.controller('interviewListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore, pagination) {

    var ilc = this;

    /* Fetch login candidate info from cookies*/
    var loggedInUser = services.getIdentity() == undefined ? undefined : JSON.parse(services.getIdentity());
    ilc.logInUserRole = loggedInUser.identity.role;

    ilc.pageno = 0;
    ilc.limit = 0;
    ilc.skip = true;
    ilc.interviewerList = '';
    ilc.userId = loggedInUser.identity.role == 1 ? null : loggedInUser.id;
    ilc.candidateId = null;
    ilc.currentInterviewList = [];
    ilc.scheduledDate = '';
    ilc.jobDetail = null;
    ilc.candidate = null;

    ilc.resetFilter = function () {
        ilc.jobCodeId = null;
        ilc.scheduledDate = '';
        ilc.candidate = null;
        // ilc.userId = null;
        $('#scheduled_date').datepicker('setDate', null);
        if (ilc.logInUserRole != 4) {
            // ilc.userId = null;
        } else {
            ilc.interviewList = null;
            ilc.currentInterviewList = [];
        }
        ilc.fetchList(-1);
    }

    /*Record limit for Candidates in pagination */
    setTimeout(function () {
        $('#table_length').on('change', function () {
            ilc.fetchList(-1);
        });
    }, 100);

    /* Function to initialise interview list controller */
    ilc.init = function () {
        // if(ilc.logInUserRole != 4){
        ilc.fetchList(-1);
        // }
        ilc.getAllInterviewerList();
        ilc.getActiveJd();
        ilc.getAllCandidatesList();
        // if(ilc.logInUserRole == 4){
        //     ilc.getTodaysScheduledInterviewList();
        // }

        /* Redirect from dashbord to shows todays interview list*/
        ilc.todayStatus = $location.search()["status"];
        if (ilc.todayStatus == 'today') {
            ilc.scheduledDate = Utility.formatDate(new Date());
            ilc.userId = null;
            ilc.fetchList(-1);
        }
    }

    ilc.getAllCandidatesList = function () {
        var promise = services.getAllCandidatesList();
        promise.success(function (result) {
            if (result.data) {
                ilc.candidateList = result.data;
                Utility.stopAnimation();
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }


    /*Function to get all active job description list */
    ilc.getActiveJd = function () {
        var promise = services.getAllActiveJDList();
        promise.success(function (result) {
            Utility.stopAnimation();
            ilc.activeJobDetail = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }


    /*pagination for Candidates*/
    ilc.fetchList = function (page) {
        ilc.limit = $('#table_length').val();
        if (ilc.limit == undefined) {
            ilc.limit = -1;
        }
        if (page == -1) {
            ilc.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            ilc.pageno = page;
        }
        var sdate = '';
        if (ilc.scheduledDate != '') {
            sdate = ilc.scheduledDate.split("/").reverse().join("-");
        }
        var req = {
            "user_id": ilc.userId,
            "job_description_id": ilc.jobCodeId,
            "schedule_date": sdate,
            "candidate_id": ilc.candidate
        }

        var requestParam = {
            page: ilc.pageno,
            limit: ilc.limit
        }

        var promise = services.getScheduledInterviewList(req, requestParam);
        promise.success(function (result) {
            if (result.status_code == 200) {
                ilc.interviewList = result.data.data;
                pagination.applyPagination(result.data, ilc);
            } else {
                ilc.interviewList = [];
                // toastr.error(result.message, 'Sorry!');
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* function to get all interviewer list*/
    ilc.getAllInterviewerList = function () {
        var promise = services.getInterviewerList();
        promise.success(function (result) {
            if (result.data) {
                ilc.interviewerList = result.data;
                Utility.stopAnimation();
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to convert time */
    ilc.tConvert = function (time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }

    /* Function to reset form */
    ilc.resetForm = function () {
        $("#changeJdStatusForm")[0].reset();
        ilc.job_id = null;
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    /* function to open jd list status modal */
    ilc.openChangeJdStatusModel = function ($candidateId) {
        ilc.candidate_id = $candidateId;
        if ($candidateId) {
            var promise = services.getJDListByCandidateId($candidateId);
            promise.success(function (result) {
                Utility.stopAnimation();
                ilc.jobDetail = result.data;
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        } else {
            ilc.jobDetail = null;
        }
        ilc.resetForm();
        $('#changeJdStatusModal').modal('show');
        setTimeout(function () {
            setCSS();
        }, 200);
    }

    /* function to change job description by candidate id */
    ilc.changeJobDescription = function () {
        if ($("#changeJdStatusForm").valid()) {
            var req = {
                "job_description_id": ilc.job_id,
                "id": ilc.candidate_id
            };
            var promise = services.changeJobDescriptionByCandidateId(req);
            promise.success(function (result) {
                Utility.stopAnimation();
                Utility.stopAnimation();
                try {
                    $('#changeJdStatusModal').modal('hide');
                    toastr.success(result.data.message);
                    // ilc.init();
                    ilc.fetchList(-1);
                    // $("#changeStatusForm")[0].reset();
                } catch (e) {
                    toastr.error("Unable to save data");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    ilc.getTodaysScheduledInterviewList = function () {
        if ($("#todayInterviewFilterForm").valid()) {
            var req = {
                "user_id": ilc.userId,
                "job_description_id": ilc.jobCodeId
            }

            var requestParam = {
                page: ilc.pageno,
                limit: ilc.limit
            }

            var promise = services.getTodaysScheduledInterviewList(req, requestParam);
            promise.success(function (result) {
                if (result.status_code == 200) {
                    ilc.currentInterviewList = result.data.data;
                    pagination.applyPagination(result.data, ilc);
                } else {
                    ilc.currentInterviewList = [];
                }
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    ilc.init();

});