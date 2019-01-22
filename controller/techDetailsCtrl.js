app.controller("techDetailsCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore,menuService,pagination) {

    var tdc = this; 

    tdc.technicalDetailsList = [];
    tdc.companiesTechnicalDetailsList = [];

    tdc.init = function(){
        tdc.id = $location.search()["id"];
        console.log(tdc.id);
        if (tdc.id > 0) {
            var promise = services.getCandidateTechRoundDtls(tdc.id);
            promise.then(function mySuccess(response) {
                console.log(response.data);
                Utility.stopAnimation();
                tdc.candidateName = response.data.data.first_name+" "+response.data.data.middle_name+" "+response.data.data.last_name;
                tdc.technicalDetailsList = response.data.data.candidate_technical_result;           
                tdc.companiesTechnicalDetailsList = response.data.data.forwarded_resumes_data;
            }, function myError(r) {
                tdc.technicalDetailsList = [];
                tdc.companiesTechnicalDetailsList = [];
                toastr.error(r.data.message, 'Sorry!');
                Utility.stopAnimation();
            });
        }
    }

    tdc.init();

});

