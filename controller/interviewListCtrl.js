app.controller('interviewListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,) {

    var ilc = this;    

    var rlc = this;
    ilc.pageno = 0;
    ilc.limit = 0;
    ilc.skip = true;
    ilc.interviewerList='';
    ilc.userId = null;

    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
        {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
        {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
        {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
        {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"active"}
    ]);

   
    rlc.search = function (id, page) {       
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
    }

    ilc.applyPagination = function (pageData) {
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                // console.log('Page: ' + page);
                if (ilc.skip) {
                    ilc.skip = false;
                    return;
                }
                ilc.fetchList(page);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }

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
            'user_id':ilc.userId
        }

        var requestParam = {
            page:ilc.pageno,
            limit:ilc.limit,
        }        
             
        var promise = services.getScheduledInterviewList(req,requestParam);        
        promise.success(function (result) {
            if (result.data) {
                Utility.stopAnimation();
                ilc.interviewList = result.data.data; 
                ilc.applyPagination(result.data);
            }    
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

    ilc.init();

});