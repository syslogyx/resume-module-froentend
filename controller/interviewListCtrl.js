app.controller('interviewListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var ilc = this;    

    var loggedInUser = JSON.parse(services.getIdentity());
    // console.log(loggedInUser.identity.role);
    ilc.logInUserRole = loggedInUser.identity.role;
    console.log(ilc.logInUserRole);

    ilc.pageno = 0;
    ilc.limit = 0;
    ilc.skip = true;
    ilc.interviewerList='';
    ilc.userId = loggedInUser.identity.role==1?null:loggedInUser.id;
    ilc.candidateId = null;

    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
        {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
        {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
        {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
        {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"active"}
    ]);

   
    ilc.search = function (id, page) {       
        ilc.userId = id;
        ilc.fetchList(page);
       
    };

    /*Record limit for Candidates in pagination*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            ilc.fetchList(-1);
        });
    },100);

    ilc.init = function(){
        ilc.fetchList(-1);
        ilc.getAllInterviewerList();
        // ilc.getActiveJd();
    }

    // ilc.getActiveJd = function(){
    //      var promise = services.getAllActiveJDList();
    //     promise.success(function (result) {
    //         Utility.stopAnimation();
    //         $scope.jobDetail = result.data; 
    //     }, function myError(r) {
    //         toastr.error(r.data.message, 'Sorry!');
    //         Utility.stopAnimation();
    //     });
    // }

    /*pagination for Candidates*/
    ilc.fetchList = function(page){
        ilc.limit = $('#table_length').val();
        if(ilc.limit == undefined){
            ilc.limit = -1;
        }
        if(page == -1){
            ilc.pageno = 1;
            //console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            ilc.pageno = page;
        }

        var req = {
            "user_id":ilc.userId
        }

        var requestParam = {
            page:ilc.pageno,
            limit:ilc.limit,
        }        
             
        var promise = services.getScheduledInterviewList(req,requestParam);        
        promise.success(function (result) { 
            // console.log(result.status_code);
            if (result.status_code == 200) {                
                ilc.interviewList = result.data.data;
                pagination.applyPagination(result.data,ilc);
            }else{
                ilc.interviewList = [];
            }
            Utility.stopAnimation();  
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }


    ilc.getAllInterviewerList = function(){        
        var promise = services.getInterviewerList();        
        promise.success(function (result) {
                // console.log(result);
            if (result.data) {
                ilc.interviewerList = result.data; 
                console.log(ilc.interviewerList);
                Utility.stopAnimation();                
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    } 


    ilc.tConvert = function(time) {
      // Check correct time format and split into components
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join (''); // return adjusted time or original string
    }

    ilc.openChangeJdStatusModel = function($candidateId){
        ilc.candidate_id = $candidateId;
        if($candidateId){
            var promise = services.getJDListByCandidateId($candidateId);
            promise.success(function (result) {
                Utility.stopAnimation();
                ilc.jobDetail = result.data; 
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
        $('#changeJdStatusModal').modal('show');
    }

    ilc.changeJobDescription = function(){
        if($("#changeJdStatusForm").valid()){
            var req = {
                "job_description_id":ilc.job_id,
                "id":ilc.candidate_id
            };
            var promise = services.changeJobDescriptionByCandidateId(req);
            promise.success(function (result) {
                Utility.stopAnimation();
                console.log(result);
                    Utility.stopAnimation();
                    try {
                        $('#changeJdStatusModal').modal('hide');
                        toastr.success(result.data.message);
                        ilc.init();
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

    ilc.init();

});