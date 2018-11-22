app.controller("resumeListCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,pagination) {

    var rlc = this;
    rlc.pageno = 0;
    rlc.limit = 0;
    rlc.skip = true;
    rlc.interviewerList='';
    rlc.candidateId = null;
    menuService.setMenu([
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"active"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
            {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
            {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
    ]);

    rlc.round = RESOURCES.TECHNICAL_ROUND;   

    rlc.interviewType = RESOURCES.INTERVIEW_TYPE;

    rlc.jobCodeId = null;
   
    rlc.searchCandidate = function (id, page) {       
        rlc.jobCodeId = id;
        rlc.fetchList(page);
       
    };

    rlc.getActiveJd = function(){
         var promise = services.getAllActiveJDList();
        promise.success(function (result) {
            Utility.stopAnimation();
            rlc.jobDetail = result.data; 
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /*Record limit for Candidates in pagination*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            rlc.fetchList(-1);
        });
    },100);


    


    // rlc.applyPagination = function (pageData) {
    //     $('#pagination-sec').twbsPagination({
    //         totalPages: pageData.last_page,
    //         visiblePages: 5,
    //         first: '',
    //         last: '',
    //         onPageClick: function (event, page) {
    //             // console.log('Page: ' + page);
    //             if (rlc.skip) {
    //                 rlc.skip = false;
    //                 return;
    //             }
    //             rlc.fetchAllCandidates(page);
    //             $("html, body").animate({ scrollTop: 0 }, "slow");
    //         }
    //     });
    // }

    /*pagination for Candidates*/
    rlc.fetchList = function(page){
        rlc.limit = $('#table_length').val();
        if(rlc.limit == undefined){
            rlc.limit = -1;
        }
        if(page == -1){
            rlc.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            rlc.pageno = page;
        }

        var req = {
            'job_description_id':rlc.jobCodeId
        }

        var requestParam = {
            page:rlc.pageno,
            limit:rlc.limit,
        }        
             
        var promise = services.getAllCandidates(req,requestParam);        
        promise.success(function (result) {
            console.log(result.status_code);
            if (result.status_code == 200) {                
                rlc.resumeList = result.data.data; 
                pagination.applyPagination(result.data,rlc);
            }else{
                rlc.resumeList = [];
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }    

    rlc.init = function(){
        rlc.fetchList(-1);
        rlc.getAllInterviewerList();
        rlc.getActiveJd();
    }

    rlc.setTotalExperience = function(exp){
        if(exp % 1 !== 0){
            expArray = exp.split('.');
            return expArray[0] +' Year ' + expArray[1] +' Month'
        }else{
            return exp +' Year';
        }
    }

    rlc.downloadResumePDF = function(id){        
        var promise = services.downloadResumePDF(id);
    }

    rlc.downloadResumePDFWithoutContact = function(id){        
        var promise = services.downloadResumePDFWithoutContact(id);
    }

    rlc.downloadResumeDoc = function(id){        
        var promise = services.downloadResume(id);
    }

    rlc.getAllInterviewerList = function(){        
        var promise = services.getInterviewerList();        
        promise.success(function (result) {
                // console.log(result);
            if (result.data) {
                rlc.interviewerList = result.data; 
                // console.log(rlc.interviewerList);
                Utility.stopAnimation();                
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }    

    rlc.openAssignInterviewerModal =function($candidateId){
        rlc.candidateId = $candidateId;
        $scope.scheduleTime = '';
        $('#assignStatusModel').modal('show');
    }

    rlc.assignedInterviewer = function(){
        // console.log(rlc.interviewer);
        // console.log(rlc.candidateId);
        if ($("#assignStatusForm").valid()) {
            var req = {
                "candidate_id":rlc.candidateId,
                "technical_round":$scope.round,
                "mode_of_interview":$scope.interviewType,
                "schedule_date":$scope.scheduleDate.split("/").reverse().join("-"),
                "schedule_time":$scope.scheduleTime,
                "users_list":rlc.interviewer
            };
            var promise = services.assignInterviewer(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $('#assignStatusModel').modal('hide');
                    toastr.success(response.data.message);
                    rlc.init();
                } catch (e) {
                    toastr.error("User not saved successfully.");
                    Raven.captureException(e)
                }
            }, function myError(r) { 
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    rlc.resetForm = function(){
        $("#assignStatusForm")[0].reset();
        rlc.interviewerList = '';
        rlc.getAllInterviewerList();
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    rlc.init();


});

