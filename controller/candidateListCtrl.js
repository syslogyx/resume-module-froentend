app.controller('candidateListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var clc = this;

    clc.id = null;
    clc.pageno = 0;
    clc.limit = 0;
    clc.skip = true;
    clc.jobList = [];
    clc.technologyList = [];

    clc.cStatusList = [
        {'id':'All','name':'All'},
        {'id':'Forwarded','name':'Shared'},
        {'id':'Pass','name':'ShortListed'},
        {'id':'Joined','name':'Joined'},
    ];

    
    var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
    clc.loggedRoleId = loggedInUser == undefined ? undefined :loggedInUser.identity.role;
    // console.log(clc.loggedRoleId);

    clc.jobStatusData = RESOURCES.JOB_STATUS;
   

    clc.searchCandidate = function(){
        clc.fetchList(-1);
    }

    /* To fetch data according table length */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            clc.fetchList(-1);
        });
    },100);

    /* Function to open add job url */
    clc.addNewJob = function(){
        $location.url('/jobs/add_job');
    }

    /* To cancle add job form */
    clc.cancelJob = function() {
        $location.url('/jobs');
    }

    clc.fetchList = function(page){
        if($("#candidatesFilterDataForm").valid()){
            clc.limit = $('#table_length').val();

            if(clc.limit == undefined){
                clc.limit = -1;
            }
            if(page == -1){
                clc.pageno = 1;
                if($('#pagination-sec').data("twbs-pagination")){
                        $('#pagination-sec').twbsPagination('destroy');
                }
            }
            else{
                clc.pageno = page;
            }

            var requestParam = {
                page:clc.pageno,
                limit:clc.limit,
            }

            // var req = {
            //     'email':email,
            //     'contact_no':mobile,
            //     "technology_id":techID
            // }
            // console.log(clc.jdId);
            var req = {
                "technology_id":clc.technologyId,
                "job_description_id":JSON.parse(clc.jdId),
                "status":clc.cStatus != null ? clc.cStatus.toString() : null
            }

            var promise = services.getfilteredCandidateList(req,requestParam);        
            promise.success(function (result) {
                // console.log(result.status_code);
                Utility.stopAnimation();
                if (result.status_code == 200) {                
                    clc.resumeList = result.data.data; 
                    pagination.applyPagination(result.data,clc);
                }else{
                    clc.resumeList = [];
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
        

    }

    /* Function to fetch all job list data */
    clc.getJDList = function(techID){
        console.log(techID);
        if(techID != ''){
            var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
            var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
                
            var requestParam = {
                page:0,
                limit:0,
            }

            var req = {
                'email':email,
                'contact_no':mobile,
                "technology_id":techID
            }

            // var promise = services.getfilteredJdList(req,requestParam);        
            var promise = services.getAllJobListByCompanyDetails(requestParam,req);       
            promise.success(function (result) {
                // console.log(result.status_code);
                Utility.stopAnimation();
                if (result.status_code == 200) {                
                    clc.jobList = result.data.data; 
                    // var jds = [];
                    // for (var ind = 0; ind < clc.jobList.length; ind++) {
                    //     clc.jdId.push(clc.jobList[ind].id);
                    // }
                    // // clc.jdId = jds;
                    // console.log(clc.jdId);
                    $scope.totalRequirement = 0;
                }else{
                    clc.jobList = [];
                    $scope.totalRequirement = 0;
                }
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                $scope.totalRequirement = 0;
                Utility.stopAnimation();
            });
        }else{
            clc.jobList = null;
            clc.technologyId == null;
        }
        // console.log(clc.technologyList);
    }

    /* Function to initialise job controller */
    clc.init = function(){
        clc.limit = $('#table_length').val();
        clc.technologyId = $location.search()["tech_id"];
        clc.getActvieTechnologyListList();
        clc.cStatus = $location.search()["status"];
        clc.getJDList(clc.technologyId);
        clc.jdId = JSON.parse($location.search()["jd_id"]); 
        // console.log(JSON.parse(clc.jdId));
        setTimeout(function(){
            $('#jobCode').trigger('change');
            $('#jobCode').valid();
        },200);
        clc.fetchList(-1);       
    }

    /*Function to set total experiance of candidate */
    clc.setTotalExperience = function(exp){
        if(exp % 1 !== '0'){
            expArray = exp.split('.');
            return expArray[0] +' Year ' + expArray[1] +' Month';
        }else{
            return exp +' Year';
        }
    }


    clc.getActvieTechnologyListList = function(){        
        var promise = services.getAllActvieTechnologyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            console.log(result.data);
            clc.technologyList = result.data;
            
        }, function myError(r) {
            clc.technologyList = [];
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to reset add job form */
    clc.resetFilter = function(){
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        clc.technologyId = null;
        clc.jobList = null;
        clc.jdId = null;
        clc.cStatus = null;
        clc.fetchList(-1);
    }

    clc.init();

});
