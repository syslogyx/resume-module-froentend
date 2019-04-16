app.controller('utilityCtrl', function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore, menuService, $routeParams) {

    var ucl = this;
    ucl.saveBtnStatus = false;
    ucl.candidateDetailsList = [];
    ucl.checkstatus = false;

    $scope.getTheFiles = function ($files) {
        $scope.file = $files[0];
    };

    var authKey = services.getIdentity() == undefined ? undefined : JSON.parse(services.getIdentity());

    ucl.checkUncheckAll = function () {
        if (ucl.checkall) {
            ucl.checkall = true;
        } else {
            ucl.checkall = false;
        }
        angular.forEach(ucl.candidateDetailsList, function (candidate) {
            if (candidate.is_record_exist != 'true') {
                candidate.checked = ucl.checkall;
            } else {
                candidate.checked = false;
            }
        });
    };

    ucl.updateCheckall = function () {
        // var candidateTotal = ucl.candidateDetailsList.length;
        canCount = 0;
        for (var i = 0; i < ucl.candidateDetailsList.length; i++) {
            if (ucl.candidateDetailsList[i].is_record_exist != 'true') {
                canCount++;
            }
        }
        var count = 0;
        angular.forEach(ucl.candidateDetailsList, function (item) {
            if (item.checked) {
                count++;
            }
        });
        // if(candidateTotal == count){
        if (canCount == count) {
            ucl.checkall = true;
        } else {
            ucl.checkall = false;
        }
    };

    ucl.readExcelDetailsForm = function () {
        if ($("#UploadExcelForm").valid()) {
            var form = document.forms[1];
            var json = new FormData(form);
            json.append("file_name", $scope.file);
            var promise = services.readCSVFile(json);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                if (response.data.status_code == 200) {
                    ucl.candidateDetailsList = response.data.data;
                    angular.forEach(ucl.candidateDetailsList, function (candidate) {
                        if (candidate.is_record_exist != 'true') {
                            ucl.checkstatus = false;
                        } else {
                            ucl.checkstatus = true;
                        }
                    });

                    ucl.saveBtnStatus = true;
                    // toastr.success(response.data.message);
                } else {
                    ucl.candidateDetailsList = [];
                    toastr.error(response.data.message);
                }
            }, function myError(r) {
                ucl.candidateDetailsList = [];
                ucl.saveBtnStatus = false;
                toastr.error(r.data.message);
                Utility.stopAnimation();
            });
        }
        ucl.checkUncheckAll();
    }

    /*Function to set total experiance of candidate */
    ucl.setTotalExperience = function (exp) {
        exp = exp.toString();
        if (exp % 1 !== '0') {
            expArray = exp.split('.');
            return expArray[0] + ' Year ' + expArray[1] + ' Month';
        } else {
            return exp + ' Year';
        }
    }

    ucl.saveCandidateDetails = function () {
        var cdata = ucl.candidateDetailsList;

        if (cdata.length > 0) {

            var request = {
                "data": [],
                "send_mails": false
            }

            for (var i = 0; i < cdata.length; i++) {
                if (cdata[i].checked == true) {
                    var obj = {
                        "ctc": cdata[i].ctc,
                        "email": cdata[i].email,
                        "first_name": cdata[i].first_name,
                        "middle_name": cdata[i].middle_name,
                        "last_name": cdata[i].last_name,
                        "mobile_no": cdata[i].mobile_no,
                        "pan_number": cdata[i].pan_no,
                        "status": cdata[i].status,
                        "total_experience": cdata[i].total_experience,
                        // "expired_on":"",
                        "unique_token": authKey.identity.uniqueToken,
                        "timestamp": "",
                        "created_at": cdata[i].cv_received_date.split("/").reverse().join("-"),
                        "job_description_id":cdata[i].job_description_id
                    }
                    request.data.push(obj);
                }
            }

            if (request.data.length > 0) {

                // console.log(request);
                // var promise = services.importCandidatesDetails(request);
                // promise.then(function mySuccess(response) {
                //     console.log(response);
                //     Utility.stopAnimation();
                //     if(response.data.status_code == 200){
                //         toastr.success(response.data.message);
                //         ucl.resetFileData();
                //     }
                // }, function myError(r) {
                //     toastr.error('Something went wrong');
                //     Utility.stopAnimation();
                // });
                swal({
                    title: "Confirm?",
                    // text: "Are you sure you want to change job status?",
                    html: '<input type="checkbox" name="send_mails" id="send_mails"/>' +
                        ' Check if you wish to send the mail to all candidates',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: "Cancel",
                    confirmButtonText: "Save",
                    allowOutsideClick: false,
                }).then(function () {
                    console.log($('#send_mails').is(":checked"));
                    if ($('#send_mails').is(":checked")) {
                        request.send_mails = true;
                    }

                    console.log(request);
                    var promise = services.importCandidatesDetails(request);
                    promise.then(function mySuccess(response) {
                        console.log(response);
                        Utility.stopAnimation();
                        if (response.data.status_code == 200) {
                            toastr.success(response.data.message);
                            ucl.resetFileData();
                        }
                    }, function myError(r) {
                        toastr.error('Something went wrong');
                        Utility.stopAnimation();
                    });
                }, function (dismiss) {
                    // jb.fetchList(-1);
                });
            } else {
                toastr.error('Please select at least one candidate.');
            }
        }
    }


    ucl.resetFileData = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        ucl.checkall = false;
        ucl.saveBtnStatus = false;
        $('#file').val('');
        ucl.candidateDetailsList = [];
    }

});

