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
    	"status":null
    }

    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
        {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
        {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
        {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
        {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"active"}
    ]);

    res.init = function(){
    	res.getCandidateList();
    	res.getAllInterviewerList();
    	res.candidateId = parseInt($location.search()["cId"]);
	    res.userId = parseInt($location.search()["uId"]);
	    res.tecForm.technical_round = $location.search()["round"].toString();
	    res.tecForm.candidate_id = res.candidateId;
	    res.tecForm.user_id = res.userId;
	    // console.log(res.tecForm.candidate_id);
	    // console.log(res.tecForm.round);
	    // console.log(res.tecForm.user_id);
    }

    res.cancelResult = function() {
         $location.path('/interview_list');
    }
    
    res.submit = function(){
    	if($("#technicalInterviewResultForm").valid()){
    		console.log("true");
            var promise = services.saveTechnicalRoundFeedback(res.tecForm);
            promise.then(function mySuccess(response) {
                try {
                    // $location.path('/resume_list');
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
