app.controller('jobDescriptionListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var jdc = this;

    jdc.id = null;
    jdc.pageno = 0;
    jdc.limit = 0;
    jdc.skip = true;
    jdc.jobList = [];
    jdc.technologyList = [];

    
    var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
    jdc.loggedRoleId = loggedInUser == undefined ? undefined :loggedInUser.identity.role;
    // console.log(jdc.loggedRoleId);

    jdc.jobStatusData = RESOURCES.JOB_STATUS;
   

    jdc.searchJobDescription = function(){
        jdc.fetchList(-1);
    }

    /* To fetch data according table length */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            jdc.fetchList(-1);
        });
    },100);

    /* To cancle add job form */
    jdc.cancelJob = function() {
        $location.url('/jobs');
    }

    /* Function to fetch all job list data */
    jdc.fetchList = function(page){
        jdc.limit = $('#table_length').val();
        if(jdc.limit == undefined){
            jdc.limit = -1;
        }
        if(page == -1){
            jdc.pageno = 1;
            // console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            jdc.pageno = page;
        }

        var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
        var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
            
        var requestParam = {
            page:jdc.pageno,
            limit:jdc.limit,
        }

        var req = {
            'email':email,
            'contact_no':mobile,
            "technology_id":jdc.technologyId
        }

        // var promise = services.getfilteredJdList(req,requestParam);        
        var promise = services.getAllJobListByCompanyDetails(requestParam,req);       
        promise.success(function (result) {
            // console.log(result.status_code);
            Utility.stopAnimation();
            if (result.status_code == 200) {                
                jdc.jobList = result.data.data; 
                $scope.totalRequirement = 0;
                pagination.applyPagination(result.data,jdc);
            }else{
                jdc.jobList = [];
                $scope.totalRequirement = 0;
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            $scope.totalRequirement = 0;
            Utility.stopAnimation();
        });
        
    }

    /* Function to initialise job controller */
    jdc.init = function(){
        jdc.limit = $('#table_length').val();
        jdc.technologyId = $location.search()["tech_id"];
        jdc.fetchList(-1);
        // jdc.getActiveCompanyList();
        jdc.getActvieTechnologyListList();
    }


    // jdc.getActiveCompanyList = function(){        
    //     var promise = services.getAllActvieCompanyList();
    //     promise.success(function (result) {
    //         Utility.stopAnimation();
    //         console.log(result.data);
    //         jdc.companyList = result.data; 
    //     }, function myError(r) {
    //         toastr.error(r.data.message, 'Sorry!');
    //         Utility.stopAnimation();
    //     });
    // }

    jdc.getActvieTechnologyListList = function(){        
        var promise = services.getAllActvieTechnologyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            console.log(result.data);
            jdc.technologyList = result.data;
        }, function myError(r) {
            jdc.technologyList = [];
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to reset add job form */
    jdc.resetFilter = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        jdc.technologyId ='';
        jdc.fetchList(-1);
    }

    jdc.init();

});