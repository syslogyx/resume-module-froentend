app.controller('screeningTestCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var st = this;  

    st.id = null;
    st.title = 'Add New Question';  
    st.pageno = -1;
    st.limit = -1;
    st.questionList ='';

    menuService.setMenu([
        {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"deactive"},
        {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
        {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"active"},
        {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
        {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
        {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
    ]);

    st.options = [
        {'id':2,'name':'No'},
        {'id':1,'name':'Yes'}
    ];
    st.statusData = [
            {'id':2,'name':'Fail'},
            {'id':1,'name':'Pass'}
    ];

    st.getScreeningQuestion = function(){        
        var requestParam = {
            page:st.pageno,
            limit:st.limit,
        }

        var promise = services.getAllQuestionList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.data != null){
                // console.log(result.data);
                st.questionList = result.data.data;
                // st.startIndnx = st.questionList[0];
                // console.log(st.questionList);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    st.getScreeningQuestion();
   
    st.resetForm = function(){
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });
    }

    st.onButtonsave = function(){
        $('#statusConfirmationModel').modal('show');
    }

    st.submitResult = function(){       
    
        $data = st.questionList;
        st.candidateId = $location.search()["candidate_id"];
        st.refereralToken = $location.search()["token"];
        
        var request = {
            "result_data":[]
        };
        for (var i = 0; i < $data.length; i++) {
            var obj= {
                "candidate_id": st.candidateId,
                "refereral_token":st.refereralToken,
                "status": st.status,
                "question_id": $data[i].id,
                "answer": $data[i].option,
                // "remark":  $data[i].remark == undefined ? '':$data[i].remark
                "remark":  $data[i].remark
            }
            request.result_data.push(obj);
        }
        console.log(request);
        var promise = services.saveResult(request);
        promise.then(function mySuccess(response) {
            try {
                toastr.success(response.data.message);
                 $location.path('/resume_list');
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

    st.cancelTest= function() {
         $location.path('/resume_list');
    }

    st.resetForm = function(){
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });
    }
});