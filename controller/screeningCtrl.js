app.controller('screeningCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var sc = this;  

    sc.id = null;
    sc.title = 'Add New Question';  
    sc.pageno = 0;
    sc.limit = 0;
    sc.questionList =''; 

    /*Record limit for screening questions in pagination */
    setTimeout(function(){
        $('#table_length').on('change',function(){
            sc.fetchList(-1);
        });
    },100);

    /* Function to show add screening question view */
    sc.addNewJob = function(){
    	$location.url('/screening/add_question');
    }

    /* Function to cancle add screening question view */
    sc.cancelQuestion= function() {
         $location.url('/questions');
    }

    /* Function to fetch screening question list */
    sc.fetchList = function(page){
        sc.limit = $('#table_length').val();
        if(sc.limit == undefined){
            sc.limit = -1;
        }
        if(page == -1){
            sc.pageno = 1;
            // console.log($('#pagination-sec').data("twbs-pagination"));
            if($('#pagination-sec').data("twbs-pagination")){
                    $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else{
            sc.pageno = page;
        }
        var requestParam = {
            page:sc.pageno,
            limit:sc.limit,
        }

        var promise = services.getAllQuestionList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if(result.data != null){
                // console.log(result.data);
                sc.questionList = result.data.data;
                pagination.applyPagination(result.data, sc);
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    /* Function to initialise screening controller */
    sc.init = function(){
        // debugger
        sc.limit = $('#table_length').val();
        sc.fetchList(-1);
        /* To fetch get all strem list */
        var promise = services.getAllStreamList();
        promise.success(function (result) {
            Utility.stopAnimation();
            sc.streamList = result.data;
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });

        /* Editing perticular job*/
        sc.id = $location.search()["id"];
        if (sc.id > 0) {
            var promise = services.getQuestionById(sc.id);
            promise.then(function mySuccess(response) {
                // console.log(response.data);
                Utility.stopAnimation();
                if(response.data.status_code == 200){
                    sc.title = 'Update Question';
                    sc.stream = response.data.data.stream_id;
                    sc.question = response.data.data.question; 
                    sc.expected_answer = response.data.data.expected_answer;           
                }else{
                    toastr.error(response.data.message, 'Sorry!');
                }
                applySelect2();   
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to reset add new screening form */
    sc.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });
    }

    /* Function to create new screening question */
    sc.createQuestion = function(){
        if ($("#questionForm").valid()) {
            var req ={
                "stream_id":sc.stream,
                "question":sc.question,
                "expected_answer":sc.expected_answer
            }
            var promise;
            if (sc.id) {
                req.id = sc.id;
                promise = services.updateQuestion(req);
                var operationMessage = "updated";
            } else {
                promise = services.saveQuestion(req);
                operationMessage = "created";
            }
            promise.then(function mySuccess(response) {
                try {
                    toastr.success('Question ' + operationMessage +' successfully.');
                    $location.url('/questions');
                } catch (e) {
                    toastr.error("Question not saved successfully.");
                    Raven.captureException(e)
                }
                Utility.stopAnimation();
            }, function myError(r) {
                toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to change status */
    sc.changeQuestionStatus = function(status,id,index){
        console.log("hello");
        var req = {
            "id":id,
            "status": status == true ? 1 : 0
        };
        swal({
                title: "Sure?",
                text: "Are you sure you want to change status?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes",
            }).then(function(isConfirm) {
                console.log(isConfirm);
                if (isConfirm) {
                    var promise = services.updateQuestionStatus(req);
                        promise.then(function mySuccess(response) {
                        Utility.stopAnimation();
                        try {
                            console.log(response);
                            toastr.success('Status is changed successfully.');
                         } catch (e) {
                            toastr.error('Status is changed successfully.');
                            Raven.captureException(e)
                        }
                    }, function myError(r) {
                        toastr.error(r.data.message, 'Sorry!');
                    });
                  } else { 
                    console.log("cancel");
                }
                    
            }, function(dismiss) {
                if (dismiss === 'cancel') {
                    setTimeout(function(){
                        bcl.init();
                    },100);  
                }
            }).catch(swal.noop);
    }
    
    sc.init();

});