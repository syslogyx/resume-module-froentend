app.controller('forwardResumeListCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var frlc = this;    
    frlc.companyList = null;
    frlc.jobcodeList = null;
    frlc.jobCodeId = null;
    frlc.companyId = null;
    frlc.candiadteList = null;
    frlc.pageno = 0;
    frlc.limit = 0;
    frlc.skip = true;
    frlc.checkall = false;

    frlc.init = function(){
        // if(window.location.pathname == '/forward_resumes'){
        //     $("#ForwardResumes").addClass('active');
        // }else if(window.location.pathname == '/round_details'){
        //     $("#ForwardResumes").addClass('active');
        // }
        frlc.getActiveCompanyList();
    }

    frlc.getActiveCompanyList = function(){        
        var promise = services.getAllActvieCompanyList();
        promise.success(function (result) {
            Utility.stopAnimation();
            frlc.companyList = result.data; 
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    frlc.getJobcodeByCompanyId = function(){
        if(frlc.companyId != null){            
            var promise = services.getJobCodeListByCompanyId(frlc.companyId);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation(); 
                try {
                    if(response.data.status_code = 200){                    
                        frlc.jobCodeId = null;
                        frlc.jobcodeList = response.data.data;  
                    } 
                } catch (e) {
                    Raven.captureException(e)
                } 
            }, function myError(r) {
                frlc.jobCodeId = null;
                frlc.jobcodeList = null;
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }else{
            frlc.jobcodeList = null;
            frlc.jobCodeId = null;
        }
    }


    frlc.search = function(){ 
        if($("#forwardResumeFilterForm").valid()){            
            var req = {
                "company_id":frlc.companyId,
                "job_description_id":frlc.jobCodeId
            }
            console.log(req);
            var requestParam = {
                page:frlc.pageno,
                limit:frlc.limit,
            } 
            var promise = services.getNotForwardedCandidateList(req,requestParam);     
            promise.then(function mySuccess(response) {
                Utility.stopAnimation(); 
                try {
                    if(response.data.status_code = 200){
                        frlc.checkall = null;
                        frlc.candiadteList = response.data.data;  
                        console.log(frlc.candiadteList);
                    } else{
                        frlc.candiadteList = [];
                    }
                } catch (e) {
                    Raven.captureException(e)
                } 
            }, function myError(r) {
                frlc.candiadteList = null;
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });      
        }       
    } 

    frlc.resetFilter = function(){           
        // if(frlc.companyId != undefined && frlc.jobCodeId != undefined){
            // console.log("true");
            frlc.companyId = null;
            frlc.jobCodeId = null;
            frlc.jobcodeList = null;
            frlc.candiadteList = null;
            frlc.checkall = null;
            frlc.init();
            $("div.form-group").each(function () {
                $(this).removeClass('has-error');
                $('span.help-block-error').remove();
                applySelect2();
            }); 
        // }
    }


    frlc.checkUncheckAll = function () {
       if (frlc.checkall) {
        frlc.checkall = true;
       } else {
        frlc.checkall = false;
       }
       angular.forEach(frlc.candiadteList, function (candidate) {
        candidate.checked = frlc.checkall;
       });
    };

    frlc.updateCheckall = function($index,user){
               
        var candidateTotal = frlc.candiadteList.length;
        var count = 0;
        angular.forEach(frlc.candiadteList, function (item) {
           if(item.checked){
             count++;
           }
        });

        if(candidateTotal == count){
           frlc.checkall = true;
        }else{
           frlc.checkall = false;
        }
    };

    frlc.saveForwardResume = function(){
        var cdata = frlc.candiadteList;
        var request = {
            "data":[]
        }

        for (var i = 0; i < cdata.length; i++) {
            if(cdata[i].checked == true){                    
                var obj= {
                    "company_id": cdata[i].job_description.company_id,
                    "job_description_id":cdata[i].job_description_id,
                    "candidate_id": cdata[i].id,
                    "cv_received_on_date":cdata[i].created_at.split(" ", 1).toString()
                }
                request.data.push(obj);
            }
        }
        
        if(request.data.length > 0){
            var promise = services.saveForwardedCandidateResumes(request);
            promise.then(function mySuccess(response) {
                console.log(response);
                Utility.stopAnimation();
                try {
                    toastr.success(response.data.message);
                    // frlc.resetFilter();
                    $location.url('/round_details');
                } catch (e) {
                    toastr.error(response.data.message, 'Sorry!');
                    Raven.captureException(e)
                }
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }else{
           toastr.error('Please select at least one candidate.'); 
        }
    }


    frlc.init();

});