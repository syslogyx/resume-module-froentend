var Utility = {

    // apiBaseUrl: "http://127.0.0.1:8000/api/",
    // apiBaseUrl: "http://172.16.1.97:8000/api/",
    // apiBaseUrl: "http://172.16.1.180:8000/api/",
    apiBaseUrl: "https://recruitmentapi.syslogyx.com/api/",

    formatDate: function (date, format) {
        var tDate = null;
        if (format == "Y/m/d") {
            tDate = this.toDate(date);
        } else {
            tDate = new Date(date);
        }

        var dd = tDate.getDate();
        var mm = tDate.getMonth() + 1; //January is 0!

        var yyyy = tDate.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        if (format == "Y/m/d") {
            return (yyyy + '/' + mm + '/' + dd);
        } else {
            return (dd + '/' + mm + '/' + yyyy);
        }

    },
    toDate: function (dateStr) {
        const [day, month, year] = dateStr.split("/")
                return new Date(year, month - 1, day)
    },
    startAnimation: function () {
        if ($("#loading").css('display') == 'none') {
            $('#loading').css("display", "block");
        }
    },
    stopAnimation: function () {
        $("#loading").fadeOut(1000, function () {
            $(".wrapper").css("display", "block");
        });
    },
    descriptiveFormatOfDate: function (date) {
        var m_names = new Array("Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                "Oct", "Nov", "Dec");

        var d = new Date(date);
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        var formatedDate = curr_date + "-" + m_names[curr_month]
                + "-" + curr_year;
        return formatedDate;
    },
    formatPhoneNumber: function (number) {
        var arr = number.match(/^(\d{3})(\d{3})(\d{4})$/);
        if(arr){
            arr.shift();
        }        
        return arr;
    },
    formatAadharNumber: function (number) {
//        var data = usc.data.hrmsUserInfo.aadhar_number;
        var arr = number.match(/\d{3,4}/g);
        return arr;
    }
};



var app = angular.module("myapp", ['ngRoute', 'mm.acl', 'ngCookies' , 'ui.sortable','ui.toggle']);
//  ,'uiSwitch'
/*app.directive('setHeight', function($window){
 return{
 link: function(scope, element, attrs){
 element.css('height', $window.innerHeight/3 + 'px');
 }
 }
 })*/

// app.directive('uploadFiles', function () {  
//     return {  
//         scope: true,        //create a new scope  
//         link: function (scope, el, attrs) {  
//             el.bind('change', function (event) {  
//                 var files = event.target.files;  
//                 //iterate files since 'multiple' may be specified on the element  
//                 for (var i = 0; i < files.length; i++) {  
//                     //emit event upward  
//                     scope.$emit("seletedFile", { file: files[i] });  
//                 }  
//             });  
//         }  
//     };  
// });  

app.factory("menuService", ["$rootScope", function ($rootScope) {
        "use strict";
        return {
            menu: function () {
                $rootScope.globalMenu;
            },
            setMenu: function (menu) {
                $rootScope.globalMenu = menu;
            }
        };
    }])

app.factory("sidebarFactory", ["$rootScope", function ($rootScope) {
        "use strict";
        return {
            template: null,
            setMenu: function (menu) {
                $rootScope.globalMenu = menu;
            }
        };
    }])


app.constant('RESOURCES', (function () {
    // Use the variable in your constants    
    return {
        TOKEN: "null",
       
        // SERVER_API:"http://172.16.1.155:8080/api/"
        SERVER_API: Utility.apiBaseUrl,
        CONTENT_TYPE: 'application/x-www-form-urlencoded; charset=UTF-8',
        COMPANY_NAME: 'Syslogyx Technologies Pvt. Ltd.',
        COMPANY_ID: 3,

        // defined job status constants
        JOB_STATUS: [
            {id:0, name: "Active"},
            {id: 1, name: "Inactive"}
        ],
        // defined Month constants
        MONTHS: [
            {id: 0, name: "0"},
            {id: 1, name: "1"},
            {id: 2, name: "2"},
            {id: 3, name: "3"},
            {id: 4, name: "4"},
            {id: 5, name: "5"},
            {id: 6, name: "6"},
            {id: 7, name: "7"},
            {id: 8, name: "8"},
            {id: 9, name: "9"},
            {id: 10, name: "10"},
            {id: 11, name: "11"}
        ],
        // defined Year constants
        YEARS: [
            {id: 0, name: "0"},
            {id: 1, name: "1"},
            {id: 2, name: "2"},
            {id: 3, name: "3"},
            {id: 4, name: "4"},
            {id: 5, name: "5"},
            {id: 6, name: "6"},
            {id: 7, name: "7"},
            {id: 8, name: "8"},
            {id: 9, name: "9"},
            {id: 10, name: "10"},
            {id: 11, name: "11"},
            {id: 12, name: "12"},
            {id: 13, name: "13"},
            {id: 14, name: "14"},
            {id: 15, name: "15"}
        ],

        OPPORTUNITYFOR:[
            {id: 0, name: "Experience"},
            {id: 1, name: "Fresher"}
        ],

        GENDER:[
            {id: 0, name: "Male"},
            {id: 1, name: "Female"},
            {id: 2, name: "Other"}
        ],

        MARITAL_STATUS:[
            {id: 0, name: "Unmarried"},
            {id: 1, name: "Married"},
            {id: 2, name: "Divorced"},
            {id: 3, name: "Widowed"}
        ],

        ACHIVEMENT_TYPES:[
            {id: 0, name: "Professional Training"},
            {id: 1, name: "Certification"},
            {id: 2, name: "Sports"},
            {id: 3, name: "Others"}
        ],

        // defined Technical round constants
        TECHNICAL_ROUND: [
            {id:1,name:"Round 1"},
            {id:2,name:"Round 2"}
        ],

        // defined Interview type constants
        INTERVIEW_TYPE: [
            {id:1,name:"Telephone"},
            {id:2,name:"Skype"},
            {id:3,name:"Face-to-Face"}
        ],

        // defined Answer type constants
        ANSWER_OPTIONS:[
            {'id':2,'name':'No'},
            {'id':1,'name':'Yes'}
        ],

        // defined result status constants
        RESULT_STATUS: [
            {'id':2,'name':'Fail'},
            {'id':1,'name':'Pass'}
        ],

        // defined result status constants
        CANDIDATE_STATUS: [
            {'id':1,'name':'Selected'},
            {'id':2,'name':'On Hold'},
            {'id':3,'name':'Block'},
            {'id':4,'name':'Joined'}
        ],

        //CONTENT_TYPE: 'application/json; charset=UTF-8'
    }
})());

app.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
} ]);

// app.directive('toggleCheckbox', function() {
//   // based on https://github.com/minhur/bootstrap-toggle/issues/19
  
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: function (scope, element, attributes, ngModelController) {
//       element.on('change.toggle', function(event) { // note that ".toogle" is our namespace, used further down to remove the handler again
//         var checked = element.prop('checked');
//         ngModelController.$setViewValue(checked);
//       });
                
//       ngModelController.$render = function() {
//         element.bootstrapToggle(ngModelController.$viewValue ? 'Inactive' : 'Active');
//       };
      
//       scope.$on('$destroy', function() {
//         // clean up
//         element.off('change.toggle');
//         element.bootstrapToggle('destroy');
//       });
              
//       // we set the 'checked' property once so the Bootstrap toggle is initialized to the correct value, i.e.,  without flashing the 'off' state and then switch to the 'on' state in case of an initial value of 'true';
//       // this is not needed if your markup already contains the correct 'checked' property;
//       // note that we can't use ngModelController.$viewValue since at this stage, it's still uninitialized as NaN
//       var initialValue = scope.$eval(attributes.ngModel);
//       element.prop('checked', initialValue);
//     }
//   };
// });

/**
**  This Directive used to apply check box on Pdf Setting for section modal
**/
app.directive('applyCheckBox', function () {
    return function (scope, element, attrs) {

        $('.icheckBox').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
        });

        $('.icheckBox').on('ifChecked', function (event) {
            $ele = $("#" + event.target.id);
            // console.log($ele.attr("data-index"));
            //Getting the scope of main controller where the icheck plugin is applied
            var index = parseInt($ele.attr("data-index"));
            var scope = angular.element(document.querySelector("#resumeListCtrl")).scope();
            $('#chk_'+index).attr('checked', true);
            // if ($('.icheckBox').filter(':checked').length == $('.icheckBox').length) {
            //     $('#chk_all').iCheck('check');
            // }
            scope.$apply(function () {
               scope.toggleSelection(index);
            });
        });

        $('.icheckBox').on('ifUnchecked', function (event) {
            $ele = $("#" + event.target.id);
            //Getting the scope of main controller where the icheck plugin is applied
           var scope = angular.element(document.querySelector("#resumeListCtrl")).scope();
            var index = parseInt($ele.attr("data-index"));
            console.log($('#chk_'+index));
            $('#chk_'+index).attr('checked', false);
            // $('#chk_all').iCheck('uncheck');
            scope.$apply(function () {
               scope.toggleSelection(index);
            });
        });


    }
});
// app.directive('applyCheckallBox', function () {
//     return function (scope, element, attrs) {

//         $('.icheckAllBox').iCheck({
//             checkboxClass: 'icheckbox_square-blue',
//             radioClass: 'iradio_square-blue',
//         });

//         $('.icheckAllBox').on('ifChecked', function (event) {
//             $ele = $("#" + event.target.id);
//             // console.log($ele);            
//             $('.icheckBox').parent().addClass('checked');
//             $('.icheckBox').attr('checked', true);
//             var scope = angular.element(document.querySelector("#resumeListCtrl")).scope();
//             scope.$apply(function () {
//                scope.toggleAllSelected();
//             });

//         });

//         $('.icheckAllBox').on('ifUnchecked', function (event) {
//             $ele = $("#" + event.target.id);
//             $('.icheckBox').parent().removeClass('checked');
//             $('.icheckBox').attr('checked', false);
//             var scope = angular.element(document.querySelector("#resumeListCtrl")).scope();
//             scope.$apply(function () {
//                scope.toggleUnSelected();
//             });
//         });


//     }
// });



app.service('pagination', function (RESOURCES, $http, $cookieStore, $filter) {
    //set pagination limit here
    var paginationLimit = 10;
    this.getpaginationLimit = function () {
     return paginationLimit;
    };

    //apply pagination
    this.applyPagination = function (pageData, ctrlscope, $source= null) {
        // console.log(pageData);
        // console.log(ctrlscope);
        $('#pagination-sec').twbsPagination({
            totalPages: pageData.last_page,
            visiblePages: 5,
            first: '',
            last: '',
            onPageClick: function (event, page) {
                console.log('Page: ' + page);
                //tec.pageno = page;
                if (ctrlscope.skip) {
                    ctrlscope.skip = false;
                    return;
                }
                //tec.search(page);
                if($source != null){

                }else{
                    ctrlscope.fetchList(page,$source);
                }
                
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }
});

app.service('services', function (RESOURCES, $http, $cookieStore, $filter) {
    // this.setIdentity = function (identity) {
    //     this.user = identity;
    // }

    this.setIdentity = function (identity) {
        $cookieStore.put('identity', JSON.stringify(identity));
        this.user = identity;
    }

    this.getIdentity = function (identity) {
        return $cookieStore.get('identity');
        // return this.user;
    }

    this.setAuthKey = function (authkey) {
        var date = new Date();
        var minutes = 0.5;
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        $cookieStore.put('authkey', authkey, {expires: 60 * 60 * 1000, path: '/'});
    }

    this.getAuthKey = function () {
        return $cookieStore.get('authkey');
    }

    /*Login service*/
    this.logIn = function (email, password) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "authenticate",
            dataType: 'json',
            data: $.param({"email": email, "password": password}),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveUser = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "register/user",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.getAllUsers = function (request) {
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "users?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getSelectedUsers = function (request) {
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "selected/users?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
   
    /*User data update with id*/
    this.updateUser = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getUserById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/" + id + "/view",
            dataType: 'json',
            //data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
    
    this.updatePassword = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "changePassword",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.findUser = function (req,request) {
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "user/filter?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllRoles = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "roles",
            dataType: 'json',
            //data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getSelectedRoles = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "selected/roles",
            dataType: 'json',
            //data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllQualificationList = function (request) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "qualification_details",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };
   
    this.createCandidate = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            //url: RESOURCES.SERVER_API + "create_candidate?type=data",
            url: RESOURCES.SERVER_API + "create_candidate",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE,
                //'Content-Type': RESOURCES.CONTENT_FILE_TYPE,
            }
        })
    };

    this.updateCandidate = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "candidate/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateCandidateStatus = function(req){
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "candidate/changestatus/" + req.id,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    this.changeJobDescriptionByCandidateId = function(req){
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "candidate/changeJobDescription/" + req.id,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    this.downloadResumePDF = function (id,sectionNames) {       
        window.open(RESOURCES.SERVER_API +'generate_pdf/'+id+'?section_names='+sectionNames);
    };

    this.downloadResumePDFWithoutContact = function (id) {
        // var win =
        window.open(RESOURCES.SERVER_API +'generate_pdf_without_contact/'+id);
        // win.setTimeout(function(){this.close();},1500)
        // win.focus();
    };

    this.downloadResume = function (id) {        
        window.open(RESOURCES.SERVER_API +'download/'+id);        
    };

    this.getAllCandidates = function(req,request){
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'POST',
            // url: RESOURCES.SERVER_API + "candidate_details?page=" + page + "&limit=" + limit,
            url: RESOURCES.SERVER_API + "candidate/filter?page=" + page + "&limit=" + limit,
            // url: RESOURCES.SERVER_API + "candidate_details",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };


    this.getCandidateDetailsById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "candidateInfoByID/" + id,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllJobList = function (request) {
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "job_description?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveJob = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "job/create",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.updateJob = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "job/update/" + req.id,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getJobById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "jobInfoByID/" + id + "/view",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.updateJobStatus = function(req){
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "job/changestatus/" + req.id,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    }

    // this.updateJobStatus = function (req) {
    //     Utility.startAnimation();
    //     return $http({
    //         method: 'POST',
    //         url: RESOURCES.SERVER_API + "job_status/" + req.id + "/update?_method=PUT",
    //         dataType: 'json',
    //         data: $.param(req),
    //         headers: {
    //             'Content-Type': RESOURCES.CONTENT_TYPE
    //         }
    //     })
    // };

    this.uploadresumeFile  = function(request){      
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "upload_resume",
            dataType: 'form-data',
            data: request,
            headers: {
                'Content-Type': undefined
            }
        })
    };


    this.uploadBackgroundDocFile  = function(request){      
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "upload_bgdoc",
            dataType: 'form-data',
            data: request,
            headers: {
                'Content-Type': undefined
            }
        })
    };

    this.getAllQuestionList = function (request) {
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "basic_screening_questions?page=" + page + "&limit=" + limit,
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveQuestion = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "questions/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.updateQuestion = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "questions/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getQuestionById = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "questionInfoByID/" + id + "/view",
            dataType: 'json',
            //data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllStreamList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "streams",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getAllActiveJDList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "getAllActiveJd",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveResult = function (req) {
        // console.log(req);
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "result/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.getInterviewerList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "user/getUsersByInterviewerRoleId",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.scheduleInterviewer = function(req){
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "assignInterviewer",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.rescheduleInterview = function(req){
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "reschedule_interview/" + req.id + "/update?_method=PUT",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getScheduledInterviewList = function(req,request){
        if(request == undefined){
            page = -1;
            limit = -1;
        }else{
            page = request.page;
            limit = request.limit;
        }
        Utility.startAnimation();
        return $http({
            method: 'POST',
            // url: RESOURCES.SERVER_API + "candidate_details?page=" + page + "&limit=" + limit,
            url: RESOURCES.SERVER_API + "interview/filter?page=" + page + "&limit=" + limit,
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.saveTechnicalRoundFeedback = function (req) {
        // console.log(req);
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "tech_feedback/add",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.getCandidateInfo = function (req) {
        Utility.startAnimation();
        return $http({
            method: 'POST',
            url: RESOURCES.SERVER_API + "candidate/getLoggedCandidateDetails",
            dataType: 'json',
            data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
                
            }
        })
    };

    this.getJDListByCandidateId = function (id) {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "candidate/getJDListByCandidateId/" + id,
            dataType: 'json',
            //data: $.param(req),
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.getPdfSettingList = function () {
        Utility.startAnimation();
        return $http({
            method: 'GET',
            url: RESOURCES.SERVER_API + "pdf_setting",
            dataType: 'json',
            headers: {
                'Content-Type': RESOURCES.CONTENT_TYPE
            }
        })
    };

    this.downloadBackgroundForm = function () {        
        window.open(RESOURCES.SERVER_API +'download_background_form');        
    };

    this.downloadSampleBackgroundForm = function () {        
        window.open(RESOURCES.SERVER_API +'download_sample_bgform');        
    };

});

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                controllerAs: 'hme',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'homeCtrl',
                controllerAs: 'hme',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                           // console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })
            .when('/site/login', {
                templateUrl: 'views/site/login.html',
                controller: 'loginCtrl',
                controllerAs: 'lgc',
                resolve: {
                    'acl': ['$q', 'AclService', '$cookieStore', '$location', function ($q, AclService, $cookieStore, $location) {
                            var authKey = $cookieStore.get('authkey');
                            if (authKey !== undefined) {
                                $location.path('/');
                                return true;
                            }
                        }]
                }
            })
            .when('/user', {
                templateUrl: 'views/user/user_table.html',
                controller: 'userCtrl',
                controllerAs: 'usr',
                resolve: {
                    'acl': ['$q', 'AclService', '$cookieStore', '$location', function ($q, AclService, $cookieStore, $location) {
                            // var authKey = $cookieStore.get('authkey');
                            // if (authKey == undefined) {
                            //     $location.path('/');
                            //     return true;
                            // }
                        }]
                }
            })
            .when('/user/add_user', {
                templateUrl: 'views/user/add_user.html',
                controller: 'userCtrl',
                controllerAs: 'usr',
                resolve: {
                    'acl': ['$q', 'AclService', '$cookieStore', '$location', function ($q, AclService, $cookieStore, $location) {
                            // var authKey = $cookieStore.get('authkey');
                            // if (authKey == undefined) {
                            //     $location.path('/');
                            //     return true;
                            // }
                        }]
                }
            })

            .when('/user/edit', {
                templateUrl: 'views/user/add_user.html',
                controller: 'userCtrl',
                controllerAs: 'usr',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/resume/:token', {
                templateUrl: 'views/resume/resume.html',
                controller: 'resumeCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })
            
            .when('/resume_list', {
                templateUrl: 'views/resume/resume_list.html',
                controller: 'resumeListCtrl',
                controllerAs: 'rlc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            }) 
            .when('/jobs', {
                templateUrl: 'views/job/job_list.html',
                controller: 'jobCtrl',
                controllerAs: 'jb',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/jobs/add_job', {
                templateUrl: 'views/job/create_job.html',
                controller: 'jobCtrl',
                controllerAs: 'jb',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/jobs/edit', {
                templateUrl: 'views/job/create_job.html',
                controller: 'jobCtrl',
                controllerAs: 'jb',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/questions', {
                templateUrl: 'views/screening/question_list.html',
                controller: 'screeningCtrl',
                controllerAs: 'sc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/screening/add_question', {
                templateUrl: 'views/screening/create_questions.html',
                controller: 'screeningCtrl',
                controllerAs: 'sc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/screening/edit_question', {
                templateUrl: 'views/screening/create_questions.html',
                controller: 'screeningCtrl',
                controllerAs: 'sc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })

            .when('/basic_screening_test', {
                templateUrl: 'views/screening/screening_test.html',
                controller: 'screeningTestCtrl',
                controllerAs: 'st',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            })
           
            .when('/interview_list', {
                templateUrl: 'views/interview/interview_list.html',
                controller: 'interviewListCtrl',
                controllerAs: 'ilc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            }) 

            .when('/interview_feedback', {
                templateUrl: 'views/result/technical_interview_result.html',
                controller: 'resultCtrl',
                controllerAs: 'res',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            }) 

            .when('/view_resume', {
                templateUrl: 'views/resume/resume_view.html',
                controller: 'resumeCtrl',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            }) 

            .when('/upload_background_form', {
                templateUrl: 'views/documents/upload_background_form.html',
                controller: 'documentsCtrl',
                controllerAs: 'doc',
                resolve: {
                    'acl': ['$q', 'AclService', function ($q, AclService) {
                            return true;
                            //console.log(AclService.getRoles());
                            if (AclService.can('view_dash')) {
                                // Has proper permissions
                                return true;
                            } else {
                                // Does not have permission
                                return $q.reject('LoginRequired');
                            }
                        }]
                }
            }) 

    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, AclService, $cookieStore, $location, services) {
    var authKey = services.getAuthKey();
    // console.log(authKey);
    if(window.location.pathname.search("/resume/")==0){

    }else if (authKey == undefined) {
        $location.path('/site/login');
    } else {
       
        var authPerm = JSON.parse($cookieStore.get('userPermission'));
        var authIdentity = JSON.parse($cookieStore.get('identity'));
        var role = authIdentity.identity.role;
        var aclData = {admin: authPerm};
        AclService.setAbilities(aclData);
        /* console.log(authIdentity);*/

        services.setIdentity(authIdentity);
        // Attach the member role to the current user
        AclService.attachRole(role);
    }

    // If the route change failed due to our "Unauthorized" error, redirect them
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        if (rejection === 'Unauthorized') {
            $location.path('/error');
        } else if (rejection === 'LoginRequired') {
            $location.path('/site/login');
        }
    });

    $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });

   $rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {
            $(".select2-dropdown").remove();
            $(".datepicker").remove();
            $(".sm_container").hide();
            $(".sm_container1").hide();
        }
    });
});

jQuery.validator.addMethod("customEmail", function (value, element) {
    return this.optional(element) || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
}, "Please enter a valid email address.");

app.controller('sidebarCtrl', function ($scope, $rootScope, $filter,sidebarFactory, services) {
    $scope.data = '';

    //method to change date format to dd/mm/yyyy
    convertDateStraight = function (input) {
        if (input != null) {
            return $filter('date')(new Date(input), 'dd/MM/yyyy');
        }
    }

     // $scope.template = sidebarFactory.template;
    $scope.$on('templateData', function (event, data) {
        $scope.templateData = data;

        $scope.userTechArray = data.data;

        if (data.title == 'Fund Request Info') {
            $scope.showTemp = 'fa fa-info';
        } else if (data.title == 'User') {
            $scope.showTemp = 'fa fa-users';
        } else if (data.title == 'Particular') {
            $scope.showTemp = 'fa fa-cart-plus';
        } else if (data.title == '') {
            $scope.showTemp = 'mdi mdi-view-headline';
        }

    });

    $scope.showTab = function (data) {
        $scope.showTemp = data;
    }

    //function will be called when we view specific time allocation log of a project
//     $scope.viewTimeAllocLog = function (data, index) {
//         console.log("data");
//         console.log(data);
//         $scope.endDateTimeAlloc = "";
//         $scope.updatedByTimeAlloc = "";
//         $scope.remarkTimeAlloc = "";
        
//         $("#viewTimeAllocLog_" + index).attr('disabled', 'disabled');
//         $("#viewActivityLogModal").modal('toggle');
//         setTimeout(function(){setCSS();},500);
// //        $scope.dataArray = data;
//         $scope.projectNameTimeAlloc = data.name;

//         var req = {
//             "project_id": data.id,
//             "user_id": data.user_id,
//             "domain_id": data.domain[0].id,
//         };
//         var promise = services.resourceMatrixLogs(req);
//         promise.then(function mySuccess(response) {
//             Utility.stopAnimation();
//             if (response.data.status_code == 200) {
//                 console.log("response");
//                 console.log(response);
//                 $scope.dataArray = response.data.data;
//                 $scope.endDateTimeAlloc = response.data.data.due_date;
//                 $scope.updatedByTimeAlloc = response.data.data.created_by_name;
//                 $scope.remarkTimeAlloc = response.data.data.remark;
//             }
//         }, function myError(r) {
//             toastr.error(r.data.message);
//             Utility.stopAnimation();
//         });
//     }

    $scope.dismissViewTimeAllocLogModal = function () {
        $("#viewActivityLogModal").modal('hide');
        $('*[id*=viewTimeAllocLog]:visible').each(function () {
            $(this).removeAttr('disabled');
        });
    }

    $scope.collapseDiv = function (index) {
        console.log(index);
        $scope.ind = index;
    }

})


