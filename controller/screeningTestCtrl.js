app.controller('screeningTestCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var st = this;  

    st.id = null;
    st.candidateName = $location.search()["name"]; 

    var loggedInUser = services.getIdentity()==undefined?undefined:JSON.parse(services.getIdentity());
    // console.log(loggedInUser);
    st.loggedUserId = loggedInUser == undefined ? undefined :loggedInUser.id;
    // console.log(st.loggedUserId);
    st.pageno = 0;
    st.limit = 0;
    st.skip = true;
    st.questionList ='';

    st.options = RESOURCES.ANSWER_OPTIONS;
    st.statusData = RESOURCES.RESULT_STATUS;

    st.init =function(){
        var promise = services.getAllStreamList();
        promise.success(function (result) {
            // console.log(result);
            Utility.stopAnimation();
            st.streamList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        // st.fetchList();
    }

    /* Function to get all screening question list */
    st.fetchList = function(){   
        if($("#filterForm").valid()){
            st.limit = $('#no_of_question').val();  
            // console.log(st.limit);
            if(st.limit == undefined || st.limit == ''){
                st.limit = 0;
            }
            var req ={
                'stream_id':st.stream,
            };
            var requestParam = {
                page:st.pageno,
                limit:st.limit
            }
            var promise = services.getAllFilteredQuestionList(req,requestParam);
            promise.success(function (result) {
                Utility.stopAnimation();
                if(result.data != null){
                    st.questionList = result.data.data;
                }else{
                    st.questionList = [];
                }
            }, function myError(r) {
                st.questionList = null;
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();

            });
        }   
    }
   
    /* Function to reset form */
    st.resetFilterForm = function(){
        $("#filterForm")[0].reset();
        st.questionList =  null;
        st.stream =  null;
        st.init();
        $("#filterForm div.form-group").each(function (e) {
            $("#filterForm div.form-group").removeClass('has-error');
            $("#filterForm span.help-block-error").remove();
            applySelect2();
        });
    }

    /* Function to reset screening test result */
    st.resetForm = function(){
        console.log("test");
        $("#screeningTestForm div.form-group").each(function (e) {
            $('#screeningTestForm div.form-group').removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });

        st.interview_duration = '';
        st.observation = '';
        
        st.init();
    }

    /* Function to open status conformation modal */
    st.onButtonsave = function(){
        if($("#screeningTestForm").valid()){
            $('#statusConfirmationModel').modal('show');
        }
        setTimeout(function(){
            setCSS();
        },200);
    }

    /* Function to submit screening test result */
    st.submitResult = function(){  
        if($("#changeStatusForm").valid()){            
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
                    "remark":  $data[i].remark,
                    "observation":st.observation,
                    "duration_of_interview":st.interview_duration,
                    "user_id": st.loggedUserId
                }
                request.result_data.push(obj);
            }
            console.log(request);
            var promise = services.saveResult(request);
            promise.then(function mySuccess(response) {
                try {
                    // $location.path('/resume_list');
                    window.location = '/resume_list#non-selected';
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

    /* Function to cancle test form */
    st.cancelTest= function() {
         $location.url('/resume_list#non-selected');
    }

    st.init();
 
});