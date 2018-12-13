app.controller('screeningTestCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination,RESOURCES) {

    var st = this;  

    st.id = null;
    st.candidateName = $location.search()["name"]; 
    st.pageno = -1;
    st.limit = -1;
    st.questionList ='';

    st.options = RESOURCES.ANSWER_OPTIONS;
    st.statusData = RESOURCES.RESULT_STATUS;

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
        if($("#screeningTestForm").valid()){
            $('#statusConfirmationModel').modal('show');
        }
    }

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
                    "duration_of_interview":st.interview_duration
                }
                request.result_data.push(obj);
            }
            console.log(request);
            var promise = services.saveResult(request);
            promise.then(function mySuccess(response) {
                // console.log(response);
                // console.log(response.data.message);
                // debugger;
                try {
                    // $location.path('/resume_list');
                    window.location = '/resume_list';
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

    st.cancelTest= function() {
         $location.path('/resume_list');
    }

    
});