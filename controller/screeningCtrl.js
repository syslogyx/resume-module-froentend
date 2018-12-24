app.controller('screeningCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore,pagination) {

    var sc = this;  

    sc.id = null;
    sc.title = 'Add New Question';  
    sc.pageno = 0;
    sc.limit = 0;
    sc.questionList ='';    

    setTimeout(function(){
        $('#table_length').on('change',function(){
            sc.fetchList(-1);
        });
    },100);

    sc.addNewJob = function(){
    	$location.path('/screening/add_question');
    }

    sc.cancelQuestion= function() {
         $location.path('/questions');
    }

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

    sc.init = function(){

        sc.limit = $('#table_length').val();
        sc.fetchList(-1);

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

    sc.resetForm = function(){
    	$("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            // applySelect2();
        });
    }

    sc.createQuestion = function(){
        if ($("#questionForm").valid()) {
            var req ={
                "stream_id":sc.stream,
                "question":sc.question
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
    
    sc.init();

});