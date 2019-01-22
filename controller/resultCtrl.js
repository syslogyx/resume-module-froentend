app.controller("resultCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,$routeParams) {

    var res = this;
    res.title = 'Feedback';    
    res.interviewerList='';
    res.round = RESOURCES.TECHNICAL_ROUND;  
    res.statusData = RESOURCES.RESULT_STATUS;

    res.tecForm = {
    	"candidate_id":null,
    	"user_id":null,
    	"feedback":null,
    	"technical_round":null,
        "duration_of_interview":null,
        "observation":null,
        "status":null
    }

    /* Function to initialise result controller */
    res.init = function(){
    	res.getCandidateList();
    	res.getAllInterviewerList();
    	res.tecForm.candidate_id = $location.search()["cId"];
        res.tecForm.user_id = parseInt($location.search()["uId"]);
	    res.tecForm.job_description_id = parseInt($location.search()["jd_id"]);
	    res.tecForm.technical_round = $location.search()["round"].toString();
    }

    /* Function to cancle interview result form */
    res.cancelResult = function() {
         $location.path('/interview_list');
    }
    
    /* Function to submit interviewer result feedback form */
    res.submit = function(){
    	if($("#technicalInterviewResultForm").valid()){
    		console.log("true");
            var promise = services.saveTechnicalRoundFeedback(res.tecForm);
            promise.then(function mySuccess(response) {
                try {
                    // $location.path('/resume_list#non-selected');
                    window.location = '/interview_list';
                    toastr.success(response.data.message);
                } catch (e) {
                    toastr.error(response.data.message, 'Sorry!');
                    Raven.captureException(e)
                }
                $('#statusConfirmationModel').modal('hide');
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
    	}
    }

    /* Function to get all interviewer list data */
    res.getAllInterviewerList = function(){        
        var promise = services.getInterviewerList();        
        promise.success(function (result) {
                // console.log(result);
            if (result.data) {
                res.interviewerList = result.data; 
                // console.log(res.interviewerList);
                Utility.stopAnimation();                
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    } 

    /* Function to get all candidate list */
    res.getCandidateList = function(){
    	var req = {
    		"page":0,
            "limit":0
    	};
    	var promise = services.getAllCandidates(req);  
        promise.success(function (result) {
                // console.log(result);
            if (result.data) {
                res.candidateList = result.data.data; 
                // console.log(res.interviewerList);
                Utility.stopAnimation();                
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to reset form */
    res.resetForm = function(){
    	res.getAllInterviewerList();
    	res.getCandidateList();
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });
    } 
    
    res.init();

});
