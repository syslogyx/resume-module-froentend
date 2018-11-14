app.controller("resumeListCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService) {

    var rlc = this;
    rlc.pageno = 0;
    rlc.limit = 0;
    rlc.skip = true;
    menuService.setMenu([
            {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
            {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
            {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"active"},
            {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-file-text", "active":"deactive"},
            {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-file-text", "active":"deactive"}
    ]);

    // rlc.resumeList = [{id:1,name:"TEST 1"},{id:2,name:"TEST 2"},{id:3,name:"TEST 3"},{id:4,name:"TEST 4"}];   
   

    /*Record limit for Candidates in pagination*/
    setTimeout(function(){
        $('#table_length').on('change',function(){
            rlc.fetchAllCandidates(-1);
        });
    },100);


    rlc.init = function(){
        rlc.fetchAllCandidates(-1);
    }


    rlc.applyPagination = function (pageData) {
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                // console.log('Page: ' + page);
                if (rlc.skip) {
                    rlc.skip = false;
                    return;
                }
                rlc.fetchAllCandidates(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }

    /*pagination for Candidates*/
    rlc.fetchAllCandidates = function(page){
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
        var requestParam = {
            page:rlc.pageno,
            limit:rlc.limit,
        }        
             
        var promise = services.getAllCandidates(requestParam);        
        promise.success(function (result) {
            if (result.data) {
                Utility.stopAnimation();
                rlc.resumeList = result.data.data; 
                rlc.applyPagination(result.data);
            }    
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
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

    rlc.downloadResumeDoc = function(id){        
        var promise = services.downloadResume(id);
    }


    rlc.init();


});

