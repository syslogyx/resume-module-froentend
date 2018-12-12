app.controller("resumeListCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,pagination) {

    var rlc = this;
    rlc.pageno = 0;
    rlc.limit = 0;
    rlc.skip = true;
    rlc.interviewerList=null;
    rlc.candidateId = null;
    rlc.seletedSection = [];
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

     //Array for experience in months drop down options.
    rlc.experienceMonths = RESOURCES.MONTHS;

    //Array for experience in years drop down options.
    rlc.experienceYears = RESOURCES.YEARS;
    rlc.candidateStatusOptions = RESOURCES.CANDIDATE_STATUS;

    rlc.totalYearExperiance = "";
    rlc.totalMonthExperiance = "";

    rlc.jobCodeId = null;
    rlc.ctcFrom = null;
    rlc.ctcTo = null;
   
    rlc.searchCandidate = function () {
        if($('#candidateResumeFilterForm').valid()){
            rlc.fetchList(-1);       
        }
    };
    

    rlc.datepickerInit = function(){
        var date = new Date();
        date.setDate(date.getDate());
        $('#schedule_date').datepicker({
            startDate: date,
            autoclose: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });
        $('#schedule_time').timepicker({
            showInputs: false
        });

        var date = new Date();
        date.setDate(date.getDate());
        $('#reschedule_date').datepicker({
            startDate: date,
            autoclose: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });
        $('#reschedule_time').timepicker({
            showInputs: false
        });
    }

    rlc.resetFilter = function(){
        rlc.jobCodeId = null;
        rlc.ctcFrom = null;
        rlc.ctcTo = null;
        rlc.total_experience = null;
        rlc.totalYearExperiance = "";
        rlc.totalMonthExperiance = "";
        rlc.fetchList(-1);
    }

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

    setTimeout(function() { rlc.datepickerInit();}, 500);
    


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

        if((rlc.totalYearExperiance != '') && (rlc.totalMonthExperiance != '')){
            $total_Exp = rlc.totalYearExperiance+'.'+rlc.totalMonthExperiance;
        }else if(rlc.totalYearExperiance == '0' && rlc.totalMonthExperiance == '0'){
            $total_Exp = '0.0'; 
        }else{
           $total_Exp = ''; 
        }

        var req = {
            'job_description_id':rlc.jobCodeId,
            // 'ctc':rlc.ctcKey,
            'from_ctc':rlc.ctcFrom,
            'to_ctc':rlc.ctcTo,
            'total_experience':$total_Exp
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
        rlc.getPdfSetting();
    }

    rlc.setTotalExperience = function(exp){
        if(exp % 1 !== '0'){
            expArray = exp.split('.');
            return expArray[0] +' Year ' + expArray[1] +' Month';
        }else{
            return exp +' Year';
        }
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

    rlc.openAssignInterviewerModal =function($candidateId,$status){
        rlc.candidateId = $candidateId;
        rlc.candidateStatus = $status;
        $scope.round = $status == 'Clear' ? 'Round 1' : 'Round 2';
        $scope.scheduleTime = '';
        $('#assignStatusModel').modal('show');
    }

    rlc.scheduleInterview = function(){
        if ($("#assignStatusForm").valid()) {
            var req = {
                "candidate_id":rlc.candidateId,
                "technical_round":$scope.round,
                "mode_of_interview":$scope.interviewType,
                "schedule_date":$scope.scheduleDate.split("/").reverse().join("-"),
                "schedule_time":$scope.scheduleTime,
                // "users_list":rlc.interviewer
                "user_id":rlc.interviewer
            };
            var promise = services.scheduleInterviewer(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $('#assignStatusModel').modal('hide');
                    toastr.success(response.data.message);
                    rlc.init();
                } catch (e) {
                    toastr.error("Unable to schedule Interview.");
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
        rlc.interviewerList = null;
        rlc.getAllInterviewerList();
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    rlc.openRescheduleModal = function(data){
        $scope.interviewRescheduleData = data;
        if($scope.interviewRescheduleData.length != null){
            rlc.interviewer = $scope.interviewRescheduleData[0].user_id;
            rlc.candidateId = $scope.interviewRescheduleData[0].candidate_id;
            $scope.round = $scope.interviewRescheduleData[0].technical_round;
            $scope.scheduleDate = $scope.interviewRescheduleData[0].schedule_date.split("-").reverse().join("/");;
            $scope.scheduleTime = $scope.interviewRescheduleData[0].schedule_time;
            $scope.interviewType = $scope.interviewRescheduleData[0].mode_of_interview;
            $scope.assoc_id = $scope.interviewRescheduleData[0].id;
            $('#rescheduleModel').modal('show');
            setTimeout(function() { rlc.datepickerInit();}, 500);
        }

    }


    rlc.reScheduleInterview = function(){
        if ($("#rescheduleForm").valid()) {
            var req = {
                "id":$scope.assoc_id,
                "candidate_id":rlc.candidateId,
                "technical_round":$scope.round,
                "mode_of_interview":$scope.interviewType,
                "schedule_date":$scope.scheduleDate.split("/").reverse().join("-"),
                "schedule_time":$scope.scheduleTime,
                "user_id":rlc.interviewer
            };
            var promise = services.rescheduleInterview(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $('#rescheduleModel').modal('hide');
                    toastr.success(response.data.message);
                    rlc.init();
                } catch (e) {
                    toastr.error("Unable to reschedule Interview");
                    Raven.captureException(e)
                }
            }, function myError(r) { 
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    rlc.openChangeStatusModal = function(data){
        // $('#changeStatusModel').modal('show');
        // console.log(data['candidate_technical_result']);
        if(data['candidate_technical_result'].length > 0){
            rlc.interviewer_name = data['candidate_user_assocs'][0]['users']['name'];
            rlc.roundDetails = data['candidate_user_assocs'][0]['technical_round'];
            rlc.change_candidate_id = data.id;
            // rlc.candidate_status = data['status'];
            $('#changeStatusModel').modal('show');
            setTimeout(function() { rlc.datepickerInit();}, 500);
        }
    }

    rlc.changeStatus = function(){
        if($('#changeStatusForm').valid()){
            var req = {
                "status":rlc.candidate_status,
                "id":rlc.change_candidate_id
            };
            var promise = services.updateCandidateStatus(req);
            // debugger;
            promise.then(function mySuccess(response) {
                console.log(response);
                Utility.stopAnimation();
                try {
                    $('#changeStatusModel').modal('hide');
                    toastr.success(response.data.message);
                    rlc.init();
                    // $("#changeStatusForm")[0].reset();
                } catch (e) {
                    toastr.error("Unable to save data");
                    Raven.captureException(e)
                }
            }, function myError(r) { 
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    rlc.downloadResumePDF = function(id){        
        // var promise = services.downloadResumePDF(id);
        rlc.Cid = id;
        $('#pdfSettingModel').modal('show');
    }

    

    rlc.getPdfSetting = function(){
        rlc.seletedSection=[];
        var promise = services.getPdfSettingList();
        promise.success(function (result) {
            Utility.stopAnimation();
            rlc.pdfSectionsNameList = result.data.data;

            for(var i=0;i<rlc.pdfSectionsNameList.length;i++){
                rlc.seletedSection.push(rlc.pdfSectionsNameList[i].id);
            }
            console.log(rlc.pdfSectionsNameList);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }


    // Toggle selection for a given fruit by name
    $scope.toggleSelection = function(sectionName) {
        console.log(sectionName);        
        var idx = rlc.seletedSection.indexOf(sectionName);
        // Is currently selected
        if (idx > -1) {
          rlc.seletedSection.splice(idx, 1);
        }

        // Is newly selected
        else {
          rlc.seletedSection.push(sectionName);
        }
    };

    rlc.downloadPdfWithSectionSetting = function(){
        if($('#pdfSettingForm').valid()){
            console.log(rlc.seletedSection.toString());
            var promise = services.downloadResumePDF(rlc.Cid,rlc.seletedSection.toString());
        }
        $('#pdfSettingModel').modal('hide');
    }

    rlc.init();


});

