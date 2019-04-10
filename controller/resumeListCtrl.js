app.controller("resumeListCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,pagination) {

    var rlc = this;
    rlc.pageno = 0;
    rlc.limit = 0;
    rlc.skip = true;
    rlc.interviewerList=null;
    rlc.candidateId = null;
    rlc.seletedSection = [];
    rlc.bgChecklistDocList = [];
    rlc.waiting=false;
    rlc.jdId = null;
    rlc.notSameInterviewerList = null;

    rlc.defaultSelectSectionList =[
        {"id":1,"section_name":"Name"},
        {"id":2,"section_name":"Email"},
        {"id":3,"section_name":"Phone"}
    ];

    var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
    console.log(loggedInUser);
    

    var hashPathname = window.location.hash;
    rlc.hashPathId = hashPathname.substring(1, hashPathname.length);
    // console.log(rlc.hashPathId);
    
    rlc.round = RESOURCES.TECHNICAL_ROUND;   

    rlc.interviewType = RESOURCES.INTERVIEW_TYPE;

     //Array for experience in months drop down options.
    rlc.experienceMonths = RESOURCES.MONTHS;

    //Array for experience in years drop down options.
    rlc.experienceYears = RESOURCES.YEARS;
    rlc.candidateStatusOptions = RESOURCES.CANDIDATE_STATUS;

    rlc.fromTotalYearExperiance = "";
    rlc.fromTotalMonthExperiance = "";
    rlc.toTotalYearExperiance = "";
    rlc.toTotalMonthExperiance = "";

    rlc.jobCodeId = null;
    rlc.ctcFrom = null;
    rlc.ctcTo = null;

    rlc.alphabet = ['All'];

    // function genCharArray(charA, charZ) {
    //     i = charA.charCodeAt(0), 
    //     j = charZ.charCodeAt(0);
    //     for (; i <= j; ++i) {
    //         rlc.alphabet.push(String.fromCharCode(i));
    //     }
    //     return rlc.alphabet;
    // }

    // genCharArray('A', 'Z');

    function genCharArray() {
        var promise = services.getListOfAlphabets(rlc.hashPathId);
        promise.success(function (result) {
            Utility.stopAnimation();
            for (var i = 0; i < result.length; i++) {
                rlc.alphabet.push(result[i]);
            }
            console.log(rlc.alphabet);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    

    rlc.onAlphabetClick = function(data,index){       
        rlc.alpha = data;
        // console.log(rlc.alpha);
        rlc.fetchList(-1);
        $('.alpabet-list').each(function(e){
            // console.log($(this).find('li a')[0].id);
            if($(this).find('li a')[0].id == $('#alpabet_'+index)[0].id){
                $('#alpabet_'+index).addClass('red');
            }else{
                $(this).find('li a').removeClass('red');
                $(this).find('li a').addClass('blue');
            }
        });
    }
   
   /*Function to filter candidate */
    rlc.searchCandidate = function () {
        if($('#candidateResumeFilterForm').valid()){
            rlc.onAlphabetClick("All","0");
            rlc.fetchList(-1);       
        }
    };
    
    /*Function to intialise datepicker */
    rlc.datepickerInit = function(){
        var date = new Date();
        date.setDate(date.getDate());
        $('#schedule_date').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });

        $('#schedule_time').timepicker({
            showInputs: false
        }).on('change', function(){
             $(this).valid();
        });

        var date = new Date();
        date.setDate(date.getDate());
        $('#reschedule_date').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });
        $('#reschedule_time').timepicker({
            showInputs: false
        }).on('change', function(){
             $(this).valid();
        });

        // $('#my-select').multiSelect({
        //     // selectableFooter: "<a class='text-center' href='#' id='select-all'>select all</a>",
        //     // selectionFooter: "<a class='text-center' href='#' id='deselect-all'>deselect all</a>"
        // });
    }

    /*Function to reset resume list filter */
    rlc.resetFilter = function(){
        rlc.jobCodeId = null;
        rlc.ctcFrom = null;
        rlc.ctcTo = null;
        // rlc.total_experience = null;
        rlc.fromTotalYearExperiance = "";
        // rlc.fromTotalMonthExperiance = "";
        rlc.toTotalYearExperiance = "";
        // rlc.toTotalMonthExperiance = "";   
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        }); 
        rlc.onAlphabetClick("All","0");
        rlc.fetchList(-1);
    }

    /*Function to get all active job description list */
    rlc.getActiveJd = function(){
        rlc.loggedRoleId = loggedInUser == undefined ? undefined :loggedInUser.identity.role;
        if(rlc.loggedRoleId != 6){            
            var promise = services.getAllActiveJDList();
            promise.success(function (result) {
                Utility.stopAnimation();
                rlc.jobDetail = result.data; 
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }else{
            var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
            var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
            var requestParam = {
                page:0,
                limit:0,
            }
            var req = {
                'email':email,
                'contact_no':mobile,
                // "technology_id":jb.technologyId
            }
            var promise = services.getAllJobListByCompanyDetails(requestParam,req);
            promise.success(function (result) {
                Utility.stopAnimation();
                if(result.data != null){
                    rlc.jobDetail = result.data.data;
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        }
    }

    /*Record limit for Candidates in pagination*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            rlc.fetchList(-1);
        });

        $('#alphabetic_sort').on('change',function(){
            rlc.fetchList(-1);
        });
    },100);

    setTimeout(function() { rlc.datepickerInit();}, 1000);

    /*pagination for Candidates*/
    rlc.fetchList = function(page){
        rlc.limit = $('#table_length').val();
        console.log(rlc.alpha);
        if(rlc.limit == undefined){
            rlc.limit = -1;
        }
        if(page == -1){
            rlc.pageno = 1;
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            rlc.pageno = page;
        }


        // if((rlc.fromTotalYearExperiance != '') && (rlc.fromTotalMonthExperiance != '')){
        //     $fromTotal_Exp = rlc.fromTotalYearExperiance+'.'+rlc.fromTotalMonthExperiance;
        // }else if(rlc.fromTotalYearExperiance == '0' && rlc.fromTotalMonthExperiance == '0'){
        //     $fromTotal_Exp = '0.0'; 
        // }else if(rlc.fromTotalYearExperiance != '' && rlc.fromTotalMonthExperiance == '0'){
        //     $fromTotal_Exp = rlc.fromTotalYearExperiance+'.0';
        // }else if(rlc.fromTotalYearExperiance == '0' && rlc.fromTotalMonthExperiance != ''){
        //     $fromTotal_Exp = '0.'+rlc.fromTotalMonthExperiance;
        // }else{
        //    $fromTotal_Exp = ''; 
        // }

        // if((rlc.toTotalYearExperiance != '') && (rlc.toTotalMonthExperiance != '')){
        //     $toTotal_Exp = rlc.toTotalYearExperiance+'.'+rlc.toTotalMonthExperiance;
        // }else if(rlc.toTotalYearExperiance == '0' && rlc.toTotalMonthExperiance == '0'){
        //     $toTotal_Exp = '0.0'; 
        // }else if(rlc.toTotalYearExperiance != '' && rlc.toTotalMonthExperiance == '0'){
        //     $toTotal_Exp = rlc.toTotalYearExperiance+'.0';
        // }else if(rlc.toTotalYearExperiance == '0' && rlc.toTotalMonthExperiance != ''){
        //     $toTotal_Exp = '0.'+rlc.toTotalMonthExperiance;
        // }else{
        //    $toTotal_Exp = ''; 
        // }

        // console.log(rlc.alpha);
        var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
        var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
        var role_id = loggedInUser == undefined ? undefined :loggedInUser.identity.role;

        var req = {
            'job_description_id':rlc.jobCodeId,
            // 'ctc':rlc.ctcKey,
            'from_ctc':rlc.ctcFrom,
            'to_ctc':rlc.ctcTo,
            // 'from_total_experience':$fromTotal_Exp,
            // 'to_total_experience':$toTotal_Exp 
            'from_total_experience':rlc.fromTotalYearExperiance,
            'to_total_experience':rlc.toTotalYearExperiance,
            // 'search_alphabet':alphabet
            'search_alphabet':rlc.alpha,
            'status':rlc.hashPathId,
            'role_id':role_id
        }

        if(email != undefined && mobile != undefined && role_id == 6){
            req.email = email;
            req.contact_no = mobile;
        }

        var requestParam = {
            page:rlc.pageno,
            limit:rlc.limit,
        }        
             
        var promise = services.getAllCandidates(req,requestParam);        
        promise.success(function (result) {
            // console.log(result.status_code);
            Utility.stopAnimation();
            if (result.status_code == 200) {                
                rlc.resumeList = result.data.data; 
                pagination.applyPagination(result.data,rlc);
            }else{
                rlc.resumeList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }    

    genCharArray();
    
    /*Function to initialise controller */
    rlc.init = function(){
        // debugger;
        // console.log(rlc.alphabet);
        // console.log();
        // if(window.location.pathname == '/resume_list' && window.location.hash == '#selected'){
        //     $("#CandidateManagement").addClass('active');
        //     // console.log("true");
        // }
        if (rlc.hashPathId === 'non-selected') {
            $("#selected").parent().removeClass('active');
            $("#non-selected").parent().addClass('active');
            // $("#CandidateManagement").addClass('active');
        }else if (rlc.hashPathId === 'selected'){
            $("#non-selected").parent().removeClass('active');
            $("#selected").parent().addClass('active');
        }
        rlc.fetchList(-1);
        rlc.getAllInterviewerList();
        rlc.getActiveJd();
    }

    /*Function to set total experiance of candidate */
    rlc.setTotalExperience = function(exp){
        if(exp % 1 !== '0'){
            expArray = exp.split('.');
            return expArray[0] +' Year ' + expArray[1] +' Month';
        }else{
            return exp +' Year';
        }
    }

    /*Function to download resume pdf without contact */
    rlc.downloadResumePDFWithoutContact = function(id){        
        var promise = services.downloadResumePDFWithoutContact(id);
    }

    /*Function to download resume document */
    rlc.downloadResumeDoc = function(id){        
        var promise = services.downloadResume(id);
    }

    /*Function to get all interviewer list */
    rlc.getAllInterviewerList = function(){  
        var promise = services.getInterviewerList();        
        promise.then(function mySuccess(result) {
            Utility.stopAnimation(); 
            try {
                if(result.data.status_code = 200){                    
                    rlc.interviewerList = result.data.data;  
                } 
            } catch (e) {
                // toastr.error("No Record Found");
                Raven.captureException(e)
            } 
        }, function myError(r) {
            rlc.interviewerList = null;
            // toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }    

    /*Function to get all interviewer list */
    rlc.getAllInterviewerListNotPresentInAssoc = function(candidateId,jdId){   
        var request = {
            "candidate_id":candidateId,
            "job_description_id":jdId
        }      
        var promise = services.getInterviewerListByJdIdAndCandidateId(request);        
        promise.then(function mySuccess(result) {
            Utility.stopAnimation(); 
            try {
                if(result.data.status_code = 200){                    
                    rlc.notSameInterviewerList = result.data.data;  
                } 
            } catch (e) {
                // toastr.error("No Record Found");
                Raven.captureException(e)
            } 
        }, function myError(r) {
            rlc.interviewerList = null;
            // toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }    


    /*Function to open assign interviewer modal */
    rlc.openAssignInterviewerModal =function($cdata){
        $('#schedule_date').datepicker('setDate',null);
        // $('#assignStatusForm')[0].reset();
        // rlc.interviewer = null;
        rlc.assignCandidateName = $cdata.first_name+' '+$cdata.middle_name+' '+$cdata.last_name;
        rlc.candidateId = $cdata.id;
        rlc.jdId = $cdata.job_description_id;
        rlc.getAllInterviewerListNotPresentInAssoc($cdata.id,$cdata.job_description_id);
        rlc.candidateStatus = $cdata.status;
        $scope.round = ($cdata.status == 'Clear' ? 'Round 1' : 'Round 2');
        $scope.scheduleTime = '';
        rlc.resetForm();
        $("#assignStatusBtn").attr('disabled',false);
        $('#assignStatusModel').modal('show');
    }

    /* Function to schedule candidate interview */
    rlc.scheduleInterview = function(){
        if ($("#assignStatusForm").valid()) {
            $("#assignStatusBtn").attr('disabled',true);
            var req = {
                "candidate_id":rlc.candidateId,
                "technical_round":$scope.round,
                "mode_of_interview":$scope.interviewType,
                "schedule_date":$scope.scheduleDate.split("/").reverse().join("-"),
                "schedule_time":$scope.scheduleTime,
                // "users_list":rlc.interviewer
                "user_id":rlc.interviewer,
                "job_description_id":rlc.jdId
            };
            var promise = services.scheduleInterviewer(req);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    $('#assignStatusModel').modal('hide');
                    toastr.success(response.data.message);
                    rlc.init();
                } catch (e) {
                    $("#assignStatusBtn").attr('disabled',false);
                    toastr.error("Unable to schedule Interview.");
                    Raven.captureException(e)
                }
            }, function myError(r) { 
                $("#assignStatusBtn").attr('disabled',false);
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });

        }
    }

    /* Function to reset form */
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

    /* Function to reset PDF form */
    rlc.resetPdfForm = function(){
        $("#pdfSettingForm")[0].reset();
        $('#ms-my-select').find('.ms-selectable > span').remove();
        $('#ms-my-select').find('.ms-selection > span').remove();
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    /* Function to open interview reshedule modal */
    rlc.openRescheduleModal = function(cdata,data){
        $scope.interviewRescheduleData = data;
        console.log(data);
        if($scope.interviewRescheduleData.length != null){
            rlc.interviewer = $scope.interviewRescheduleData[0].user_id;
            rlc.candidateId = $scope.interviewRescheduleData[0].candidate_id;
            $scope.round = $scope.interviewRescheduleData[0].technical_round;
            $scope.scheduleDate = $scope.interviewRescheduleData[0].schedule_date.split("-").reverse().join("/");;
            $scope.scheduleTime = $scope.interviewRescheduleData[0].schedule_time;
            $scope.interviewType = $scope.interviewRescheduleData[0].mode_of_interview;
            $scope.assoc_id = $scope.interviewRescheduleData[0].id;
            $scope.job_description_id = $scope.interviewRescheduleData[0].job_description_id;
            $scope.reassignCandidateName = cdata.first_name+' '+cdata.middle_name+' '+cdata.last_name;
            $("#reScheduleInterviewBtn").attr('disabled',false);
            $('#rescheduleModel').modal('show');
            setTimeout(function() { rlc.datepickerInit();}, 500);
        }

    }

    /* Function to reschedule candidate interview */
    rlc.reScheduleInterview = function(){
        if ($("#rescheduleForm").valid()) {
            $("#reScheduleInterviewBtn").attr('disabled',true);
            var req = {
                "id":$scope.assoc_id,
                "candidate_id":rlc.candidateId,
                "technical_round":$scope.round,
                "mode_of_interview":$scope.interviewType,
                "schedule_date":$scope.scheduleDate.split("/").reverse().join("-"),
                "schedule_time":$scope.scheduleTime,
                "job_description_id":$scope.job_description_id,
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
                    $("#reScheduleInterviewBtn").attr('disabled',false);
                    toastr.error("Unable to reschedule Interview");
                    Raven.captureException(e)
                }
            }, function myError(r) { 
                $("#reScheduleInterviewBtn").attr('disabled',false);
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    /* Function to open change candidate status modal */
    rlc.openChangeStatusModal = function(data){
        // $('#changeStatusModel').modal('show');
        // console.log(data['candidate_technical_result']);
        if(data['candidate_technical_result'].length > 0){
            rlc.interviewer_name = data['candidate_user_assocs'][0]['users']['name'];
            rlc.roundDetails = data['candidate_user_assocs'][0]['technical_round'];
            rlc.change_candidate_id = data.id;
            // rlc.candidate_status = data['status'];
            $("#changeStatusBtn").attr('disabled',false);
            $('#changeStatusModel').modal('show');
            setTimeout(function() { rlc.datepickerInit();}, 500);
        }
    }

    /* Function to change candidate status */
    rlc.changeStatus = function(){
        if($('#changeStatusForm').valid()){
            $("#changeStatusBtn").attr('disabled',true);
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
                    $("#changeStatusBtn").attr('disabled',false);
                    toastr.error("Unable to save data");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                $("#changeStatusBtn").attr('disabled',false); 
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }

    /* Function to get Pdf setting */
    rlc.downloadResumePDF = function(id){        
        // var promise = services.downloadResumePDF(id);
        rlc.Cid = id;
        rlc.getPdfSetting();
    }

    /* Function to open pdf setting modal and get Pdf setting list */
    rlc.getPdfSetting = function(){
        rlc.seletedSection=[];
        var promise = services.getPdfSettingList();
        promise.success(function (result) {
            Utility.stopAnimation();
            rlc.pdfSectionsNameList = result.data;
            setTimeout(function(){
                $('#my-select').multiSelect();
                $('#ms-my-select').find('.ms-selectable').prepend("<span><strong>Non-Selected Sections</strong></span>");
                $('#ms-my-select').find('.ms-selection').prepend("<span><strong>Selected Sections</strong></span>");
            },200)
            $('#pdfSettingModel').modal('show');
            setTimeout(function(){
                setCSS();
            },200);
            
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

     /* Toggle selection for a given fruit by name
    $scope.toggleSelection = function(sectionName) {
        console.log(sectionName);        
        var idx = rlc.seletedSection.indexOf(sectionName);
        // Is currently selected
        if (idx > -1) {
          rlc.seletedSection.splice(idx, 1);
        }

        // if(rlc.seletedSection.length > 0){
        //     $('#pdfSettingForm')[0].reset();
        // }

        // Is newly selected
        else {
          rlc.seletedSection.push(sectionName);
        }
    };
    */

    /* Function to download PDF with section selection setting */
    rlc.downloadPdfWithSectionSetting = function(){
        if($('#pdfSettingForm').valid()){
            //to add default name, emial and phone section to download pdf
            var selectSectionListStr = "1,2,3,"+$('#my-select').val().toString();
            var promise = services.downloadResumePDF(rlc.Cid,selectSectionListStr);
            $('#pdfSettingModel').modal('hide');
        }
    }

     /* Function to show bg checklist modal and get all bg checklist */
    rlc.viewBgChecklistModal = function(candidateData){
        $('#cv_selection_list_li.active').removeClass('active');
        $('#cv_selection_list.active').removeClass('active');
        $('#bg_checklist_li').addClass('active');
        $('#bg_checklist').addClass('active');

        rlc.bgChecklistDocList = [];
        rlc.pdfSectionsNameList =[];
        rlc.candidateID = candidateData.id;
        var candidate_name = candidateData.first_name+'_'+candidateData.middle_name+'_'+candidateData.last_name;
        rlc.candidateName =candidate_name.split(" ").join("_");
        // rlc.candidateBgDocumentsDataLength = candidateData.candidate_bg_documents.length;
        var promise = services.getAllBgCheckList(rlc.candidateID,'resume_view');      
        promise.success(function (result) {
            if (result.data) {
                rlc.bgChecklistDocList = result.data;          
            }else{
                rlc.bgChecklistDocList = []; 
            }    
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        var promise = services.getPdfSettingList();
        promise.success(function (result) {
            if (result.data) {
                rlc.pdfSectionsNameList = result.data;   
            }else{
                rlc.pdfSectionsNameList = [];
            }
            Utility.stopAnimation();   
            setTimeout(function(){
                $('#my-select_for_zip').multiSelect();
                $('#ms-my-select_for_zip').find('.ms-selectable').prepend("<span><strong>Non-Selected Sections</strong></span>");
                $('#ms-my-select_for_zip').find('.ms-selection').prepend("<span><strong>Selected Sections</strong></span>");
            },1000);
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
        rlc.candidateNameToShowOnModal = candidateData.first_name+' '+candidateData.middle_name+' '+candidateData.last_name;
        // $("#downloadZipBtn").attr('disabled',false);
        $("#bgChecklistDocsModal").modal("show");

        // if(rlc.candidateBgDocumentsDataLength <= 0){
        //     $("#downloadZipBtn").attr('disabled',true);
        // }
        setTimeout(function(){
            setCSS();
        },200);   
    }

     /* Function to download zip file of all bg checklist doc */
    rlc.downloadBgChecklistDocsZip = function(){
        // console.log($('#my-select_for_zip').val());
        if($('#pdfSettingFormForZip').valid()){
            if($('#my-select_for_zip').val().toString() != ''){ 
                // $("#downloadZipBtn").attr('disabled',true);
                rlc.waiting=true;
                rlc.timer();
                var selectSectionListStr = "1,2,3,"+$('#my-select_for_zip').val().toString();
                var promise = services.createBgCheckListDocZip(rlc.candidateID,selectSectionListStr);        
                promise.success(function (result) {  
                    Utility.stopAnimation();
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                    Utility.stopAnimation();
                }); 

            }
        }
    }
    rlc.second=15;
    rlc.timer=function(){                  
        rlc.x = setInterval(function() {
            $scope.$apply(rlc.clock);   
        }, 1000);
    }
    
    rlc.clock=function(){
        rlc.second--;             
        if (rlc.second == 0) {
            rlc.second=15;
            clearInterval(rlc.x);
            rlc.waiting=false;
            var promise = services.downloadBgCheckListDocZip(rlc.candidateName);
            $("#bgChecklistDocsModal").modal("hide");
        }
    }

    /* Function to reset form */
    rlc.resetChangeJdForm = function(){
        $("#changeJdStatusForm")[0].reset();
        rlc.job_id=null;
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
    }

    /* function to open jd list status modal */
    rlc.openChangeJdStatusModel = function($candidateId){
        rlc.candidate_id = $candidateId;
        if($candidateId){
            var promise = services.getJDListByCandidateId($candidateId);
            promise.success(function (result) {
                Utility.stopAnimation();
                rlc.jdList = result.data; 
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }else{
            rlc.jobDetail=null;
        }
        rlc.resetChangeJdForm();
        $("#changeJobCodeBtn").attr('disabled',false);
        $('#changeJdStatusModal').modal('show');
        setTimeout(function(){
            setCSS();
        },200);
    }

    /* function to change job description by candidate id */
    rlc.changeJobDescription = function(){
        if($("#changeJdStatusForm").valid()){
            $("#changeJobCodeBtn").attr('disabled',true);
            var req = {
                "job_description_id":rlc.job_id,
                "id":rlc.candidate_id
            };
            var promise = services.changeJobDescriptionByCandidateId(req);
            promise.success(function (result) {
                Utility.stopAnimation();
                try {
                    $('#changeJdStatusModal').modal('hide');
                    toastr.success(result.message);
                    // ilc.init();
                    rlc.fetchList(-1);
                    // $("#changeStatusForm")[0].reset();
                } catch (e) {
                    $("#changeJobCodeBtn").attr('disabled',false);
                    toastr.error("Unable to save data");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                $("#changeJobCodeBtn").attr('disabled',false);
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    rlc.init();

});
