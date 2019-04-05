app.controller("roundDtlsCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,pagination) {

    var rdc = this; 
    rdc.companyList = null;
    rdc.jobcodeList = null;
    rdc.candidateList = null;
    rdc.techForm = null;
    rdc.interviewType = RESOURCES.INTERVIEW_TYPE;
    rdc.roundStatus = RESOURCES.RESULT_STATUS;
    rdc.clientRoundStatus = RESOURCES.CLIENT_RESULT_STATUS;
    rdc.finalRoundStatus = RESOURCES.CANDIDATE_STATUS;
    rdc.fId = null;
    rdc.feedback_received_date = null;
    rdc.company_final_status = null;
    rdc.company_final_remark = null;
    rdc.pageno = 0;
    rdc.limit = 0;
    rdc.skip = true;
    rdc.forwaredResumeList = [];
    rdc.viewRoundInfoList = [];
    rdc.cName = '';

    setTimeout(function(){
        $('#table_length').on('change',function(){
            rdc.fetchList(-1);
        });
    },100);

    /*pagination for Candidates*/
    rdc.fetchList = function(page){
        rdc.limit = $('#table_length').val();
        if(rdc.limit == undefined){
            rdc.limit = -1;
        }
        if(page == -1){
            rdc.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            rdc.pageno = page;
        }

        var req = {
            "company_id":rdc.companyId,
            "job_description_id":rdc.jobCodeId,
            "candidate_id":rdc.candidateId
        }
        // console.log(req);
        // debugger;

        var requestParam = {
            page:rdc.pageno,
            limit:rdc.limit,
        }        
             
        var promise = services.getForwardedCandidateResumesList(req,requestParam);        
        promise.success(function (result) {
            // console.log(result.status_code);
            if (result.status_code == 200) {                
                rdc.forwaredResumeList = result.data.data; 
                pagination.applyPagination(result.data,rdc);
            }else{
                rdc.forwaredResumeList = [];
            }
            Utility.stopAnimation();
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }  

    /*Function to intialise datepicker */
    rdc.datepickerInit = function(){
        var date = new Date();
        date.setDate(date.getDate());
        $('.company_round_date').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });

        $('#feedback_received_date').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });

        $('#hr_interview_on_date').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });

        $('#tentative_doj').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });

        $('#actual_doj').datepicker({
            startDate: date,
            autoclose: true,
            todayHighlight: true
        }).on('changeDate', function(selected){
             $(this).valid();
        });
    }

    

    rdc.appendTechInfoRow = function(){
        if ($("#addRoundInfoForm").valid()) {
            rdc.techForm.push({forwarded_id:rdc.fId,company_round_date:"",company_tech_status:"",company_tech_round_type:"",companies_tech_remark:""});
            setTimeout(function() { rdc.datepickerInit();}, 500);
        }
    }


    rdc.removeTechInfoRow = function(index){
        for (var i = (rdc.techForm.length - 1); i >= 0; i--) {
            if( i == index){
               rdc.techForm.splice(index, 1);
            }
        }
    }

    rdc.init = function(){
        rdc.getActiveCompanyList();
        setTimeout(function(){
            setCSS();
        },500);

        rdc.fetchList(-1);
    }

    rdc.getActiveCompanyList = function(){        
        var promise = services.getAllActvieCompanyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            rdc.companyList = result.data; 
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    rdc.getJobcodeByCompanyId = function(){
        // console.log(rdc.companyId);
        if(rdc.companyId != null){            
            var promise = services.getJobCodeListByCompanyId(rdc.companyId);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation(); 
                try {
                    if(response.data.status_code = 200){                    
                        rdc.jobCodeId = null;
                        rdc.candidateList = null;
                        rdc.candidateId = null;
                        rdc.jobcodeList = response.data.data; 
                    } 
                } catch (e) {
                    // toastr.error("No Record Found");
                    Raven.captureException(e)
                } 
            }, function myError(r) {
                rdc.jobcodeList = null;
                rdc.jobCodeId = null;
                rdc.candidateList = null;
                rdc.candidateId = null;
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }else{
            rdc.jobcodeList = null;
            rdc.jobCodeId = null;
            rdc.candidateList = null;
            rdc.candidateId = null;
        }
    }

    rdc.getCandidateListByJobcodeId = function(){
        // console.log(rdc.jobCodeId);
        if(rdc.companyId != null && rdc.jobCodeId != ''){            
            var promise = services.getCandidateListByJobcodeId(rdc.jobCodeId);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    if(response.data.status_code = 200){                    
                        rdc.candidateId = null;
                        rdc.candidateList = response.data.data; 
                    } 
                } catch (e) {
                    Raven.captureException(e)
                }
            }, function myError(r) {
                rdc.candidateList = null;
                rdc.candidateId = null;
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }else{
            rdc.candidateList = null;
            rdc.candidateId = null;
        }
    }

    rdc.setFormatteddate = function(date){
        return date.split("-").reverse().join("/");
    }    

    rdc.search =function(){    	
    	if($("#roundFilterForm").valid()){
	    	rdc.fetchList(-1);
    	}
    } 

    rdc.resetFilter = function(){           
        // if(rdc.companyId != undefined && rdc.jobCodeId != undefined && rdc.jobCodeId != undefined){
            // console.log("true");
            rdc.companyId = null;
            rdc.jobCodeId = null;
            rdc.candidateId = null;
            rdc.jobcodeList = null;
            rdc.candidateList = null;
            rdc.init();
            $("div.form-group").each(function () {
	            $(this).removeClass('has-error');
	            $('span.help-block-error').remove();
	            applySelect2();
	        }); 
        // }
    }

    rdc.openAddRoundInfoModel = function(forwardedId,clientName,candidateInfo){
        rdc.resetAllDatepicker();
        rdc.cName = clientName;
        rdc.candidateName = candidateInfo.first_name+' '+candidateInfo.middle_name+' '+candidateInfo.last_name;
        rdc.fId = forwardedId;
        rdc.techForm = [{forwarded_id:rdc.fId,company_round_date:"",company_tech_status:"",company_tech_round_type:"",companies_tech_remark:""}];
        $("#saveRoundDetailsBtn").attr('disabled',false);
        $('#addRoundInfoModal').modal('show');
        setTimeout(function(){
            setCSS();
            rdc.datepickerInit();
        },200);
    }

    rdc.saveRoundInfo = function(){
        if ($("#addRoundInfoForm").valid()) {
            $("#saveRoundDetailsBtn").attr('disabled',true);
            for (var k = 0; k < rdc.techForm.length; k++) {
                delete rdc.techForm[k]['$$hashKey'];
            }
            var req = {
                "round_info":rdc.techForm
            };
            // console.log(rdc.techForm);
            var promise = services.saveTechRoundInfo(req);
            promise.then(function mySuccess(response) {
                // console.log(response.data);
                Utility.stopAnimation();
                if(response.data.status_code == 200){                   
                    $('#addRoundInfoModal').modal('hide');
                    toastr.success(response.data.message);
                    rdc.init();
                }else{ 
                    $("#saveRoundDetailsBtn").attr('disabled',false);                   
                    toastr.error("Unable to save details.");
                }
            }, function myError(r) { 
                $("#saveRoundDetailsBtn").attr('disabled',false);
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
        
    }

    // rdc.resetAddRoundDetailsForm = function(){

    // }

    rdc.openAddFinalRoundResultModal = function(id,candidate_id,client_name,candidateInfo){
        rdc.resetAllDatepicker();
        rdc.fId = id;
        rdc.fCandidateID = candidate_id;
        rdc.cName = client_name;
        rdc.candidateName = candidateInfo.first_name+' '+candidateInfo.middle_name+' '+candidateInfo.last_name;
        $("#saveFinalRoundDetailsBtn").attr('disabled',false);
        $('#addFinalRoundResultModal').modal('show');
        setTimeout(function() { setCSS(); rdc.datepickerInit();}, 300);
    }

    rdc.saveFinalRoundDetails =function(){
        if($("#addFinalRoundResultForm").valid()){
            $("#saveFinalRoundDetailsBtn").attr('disabled',true);
            var req = {
                "forwarded_id":rdc.fId,
                "feedback_received_date":rdc.feedback_received_date.split("/").reverse().join("-"),
                "company_final_status":rdc.company_final_status,
                "company_final_remark":rdc.company_final_remark,
                "candidate_id":rdc.fCandidateID 
            }

            var promise = services.updateRoundDetails(req,rdc.fId);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                if(response.data.status_code == 200){                    
                    $('#addFinalRoundResultModal').modal('hide');
                    // rdc.feedback_received_date = null;
                    // rdc.company_final_status = null;
                    // rdc.company_final_remark = null;
                    $("#addFinalRoundResultForm")[0].reset()
                    toastr.success(response.data.message);
                    rdc.init();
                }else{ 
                    $("#saveFinalRoundDetailsBtn").attr('disabled',false);                   
                    toastr.error("Unable to save details.");
                }
            }, function myError(r) { 
                $("#saveFinalRoundDetailsBtn").attr('disabled',false);
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
    }
    
    rdc.resetFinalRoundDetailsForm = function(){

    }

    rdc.openAddHrFinalRoundResultModal = function(id,candidate_id,client_name,candidateInfo){
        rdc.resetAllDatepicker();
        rdc.fId = id;
        rdc.cId = candidate_id;
        rdc.cName = client_name;
        rdc.candidateName = candidateInfo.first_name+' '+candidateInfo.middle_name+' '+candidateInfo.last_name;
        $("#saveFinalHRRoundDetailsBtn").attr('disabled',false);
        $('#addFinalHrRoundResultModal').modal('show');
        $("#tentativeDOJDiv").show();
        $("#atualDOJDiv").show();
        setTimeout(function() { setCSS(); rdc.datepickerInit();}, 300);
    }

    rdc.saveHRRoundDetails = function(){
        console.log(rdc.tentative_doj);
        if($('#addHrRoundResultForm').valid()){
            $("#saveFinalHRRoundDetailsBtn").attr('disabled',true);
            var req = {
                "candidate_id":rdc.cId,
                "hr_interview_on_date":rdc.hr_interview_on_date.split("/").reverse().join("-"),
                "hr_status":rdc.hr_status,
                "hr_remark":rdc.hr_remark,
                "final_status":rdc.final_status,
                "tentative_doj":rdc.tentative_doj != undefined? rdc.tentative_doj.split("/").reverse().join("-"): null,
                "actual_doj":rdc.actual_doj!= undefined? rdc.actual_doj.split("/").reverse().join("-"): null
            }

            var promise = services.updateRoundDetails(req,rdc.fId);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                if(response.data.status_code == 200){                    
                    $('#addFinalHrRoundResultModal').modal('hide');
                    $('#addHrRoundResultForm')[0].reset();
                    toastr.success(response.data.message);
                    rdc.init();
                }else{
                $("#saveFinalHRRoundDetailsBtn").attr('disabled',false);                    
                    toastr.error("Unable to save details.");
                }
            }, function myError(r) { 
                $("#saveFinalHRRoundDetailsBtn").attr('disabled',false);
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
            
        }
    }

    rdc.resetHrRoundDetailsForm = function(){

    }

    rdc.openCandidateViewModel =function(data,clientName,candidateInfo){
        rdc.resetAllDatepicker();
        rdc.cName = clientName;
        rdc.candidateName = candidateInfo.first_name+' '+candidateInfo.middle_name+' '+candidateInfo.last_name;
        rdc.viewRoundInfoList = data;
        $('#viewCandidateDetailsModal').modal('show');
        setTimeout(function(){
            setCSS();
        },200);
    }

    /* Function to open change candidate status modal */
    rdc.openChangeStatusModal = function(candidateId){
        $("#changeStatusBtn").attr('disabled',false);
        rdc.change_candidate_id = candidateId;
        $('#changeStatusModel').modal('show');           
    }

    /* Function to change candidate status */
    rdc.changeStatus = function(){
        if($('#changeStatusForm').valid()){
            $("#changeStatusBtn").attr('disabled',true);
            var req = {
                "status":rdc.candidate_status,
                "id":rdc.change_candidate_id
            };
            var promise = services.updateCandidateStatus(req);
            // debugger;
            promise.then(function mySuccess(response) {
                console.log(response);
                Utility.stopAnimation();
                try {
                    $('#changeStatusModel').modal('hide');
                    toastr.success(response.data.message);
                    rdc.init();
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

    rdc.resetAllDatepicker = function(){
        $('#feedback_received_date').datepicker('setDate',null);
        $('#hr_interview_on_date').datepicker('setDate',null);
        $('#tentative_doj').datepicker('setDate',null);
        $('#actual_doj').datepicker('setDate',null);
        rdc.feedback_received_date = '';
        rdc.hr_interview_on_date = '';
        rdc.tentative_doj = '';
        rdc.actual_doj = '';
    }

    rdc.init();

});

