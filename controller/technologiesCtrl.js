app.controller('technologiesCtrl', function ($scope, $rootScope, $http, services, $location, menuService, $cookieStore, pagination, RESOURCES) {

    var tec = this;

    tec.id = null;
    tec.title = 'Add New Technology';
    tec.pageno = 0;
    tec.limit = 0;
    tec.skip = true;
    tec.technologyList = [];

    /* To fetch data according table length */
    setTimeout(function () {
        $('#table_length').on('change', function () {
            tec.fetchList(-1);
        });
    }, 100);

    /* Function to load add client view */
    tec.addNewTechnology = function () {
        $location.url('/technologies/add_technology');
    }

    /* Function to cancle client form */
    tec.cancelTechnology = function () {
        $location.url('/technologies');
    }

    /* Function to fetch client list */
    tec.fetchList = function (page) {
        tec.limit = $('#table_length').val();
        if (tec.limit == undefined) {
            tec.limit = -1;
        }
        if (page == -1) {
            tec.pageno = 1;
            if ($('#pagination-sec').data("twbs-pagination")) {
                $('#pagination-sec').twbsPagination('destroy');
            }
        }
        else {
            tec.pageno = page;
        }
        var requestParam = {
            page: tec.pageno,
            // limit:pagination.getpaginationLimit(),
            limit: tec.limit,
        }
        var promise = services.getAllTechnologyList(requestParam);
        promise.success(function (result) {
            Utility.stopAnimation();
            if (result.data != null) {
                tec.technologyList = result.data.data;
                pagination.applyPagination(result.data, tec);
            } else {
                tec.technologyList = [];
            }
        }, function myError(r) {
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();

        });
    }

    /* Function to initialise company controller */
    tec.init = function () {
        tec.limit = $('#table_length').val();
        tec.fetchList(-1);
        /* Editing perticular company*/
        tec.id = $location.search()["id"];
        if (tec.id > 0) {
            var promise = services.getTechnologyById(tec.id);
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                tec.title = 'Update Technology';
                tec.technologyName = response.data.data.name,
                    tec.description = response.data.data.description,
                    applySelect2();
            }, function myError(r) {
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    /* Function reset create Technology form */
    tec.resetForm = function () {
        $("div.form-group").each(function () {
            $(this).removeClass('has-error');
            $('span.help-block-error').remove();
            applySelect2();
        });
        tec.technologyName = '';
        tec.description = '';
    }

    /* Function to create/update new Technology */
    tec.createTechnology = function () {
        if ($("#technologyForm").valid()) {
            var req = {
                "name": tec.technologyName,
                "description": tec.description
            }

            var promise;
            if (tec.id) {
                req.id = tec.id;
                promise = services.updateTechnology(req);
                var operationMessage = "updated";
            } else {
                promise = services.saveTechnology(req);
                operationMessage = "created";
            }
            promise.then(function mySuccess(response) {
                Utility.stopAnimation();
                try {
                    toastr.success('Technology ' + operationMessage + ' successfully.');
                    $location.url('/technologies');
                } catch (e) {
                    toastr.error("Unable to save technology data.");
                    Raven.captureException(e)
                }
            }, function myError(r) {
                // var htmlerror ='<ul style="list-style:none;"><li >';
                // $.each(r.data.data, function(k, v) {
                //     if(k=='email'){
                //         htmlerror = htmlerror+v +'</li><li>';
                //     }
                //     if(k=='contact_no'){
                //         htmlerror = htmlerror+v+'</li><li>';
                //     }
                //   });
                // toastr.error(htmlerror);
                // toastr.error('Something went wrong');
                Utility.stopAnimation();
            });
        }
    }

    /* Function to change client status */
    tec.changeTechnologiesStatus = function (status, id, index) {
        var req = {
            "id": id,
            "status": status == true ? 1 : 0
        };
        swal({
            title: "Sure?",
            text: "Are you sure you want to change Technology status?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            allowOutsideClick: false,
        }).then(function (isConfirm) {
            if (isConfirm) {
                var promise = services.updateTechnologyStatus(req);
                promise.then(function mySuccess(response) {
                    Utility.stopAnimation();
                    try {
                        // console.log(response);
                        toastr.success('Technology status is changed successfully.');
                    } catch (e) {
                        toastr.error('Technology status is changed successfully.');
                        Raven.captureException(e)
                    }
                }, function myError(r) {
                    toastr.error(r.data.message, 'Sorry!');
                });
            } else {
                console.log("cancel");
            }

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                setTimeout(function () {
                    tec.init();
                }, 100);
            }
        }).catch(swal.noop);
    }

    tec.init();

});