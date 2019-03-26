app.controller('homeCtrl', function ($scope,RESOURCES,$rootScope,menuService,services,$cookieStore) {

	var hme = this;
	hme.name = "";
   // menuService.setMenu([]);

   /* Fetch login candidate info from cookies*/
    var loggedInUser = JSON.parse($cookieStore.get('identity'));
    console.log(loggedInUser);
    hme.logInUserRole  =   loggedInUser.identity.role;
    hme.logInUserID = loggedInUser.id;
    hme.name  =  loggedInUser.identity.name;
    hme.loginUserEmail = loggedInUser.identity.email;
    hme.loginUserMobile = loggedInUser.identity.mobile;

    hme.role_admin = RESOURCES.ROLE_ADMIN;
    hme.role_hr = RESOURCES.ROLE_HR;
    hme.role_client = RESOURCES.ROLE_CLIENT;

    /* Set menues in menu service */
    // menuService.setMenu([
    //     {"Title": "Dashboard", "Link": "/home", "icon": "fa fa-dashboard", "active":"active"},
    //     {"Title": "User Management", "Link": "user", "icon": "fa fa-user-plus", "active":"deactive"},
    //     {"Title": "Resume Management", "Link": "/resume_list", "icon": "fa fa-file-text", "active":"deactive"},
    //     {"Title": "JD Management", "Link": "/jobs", "icon": "fa fa-tasks", "active":"deactive"},
    //     {"Title": "Screening Questions", "Link": "/questions", "icon": "fa fa-list", "active":"deactive"},
    //     {"Title": "Scheduled interview", "Link": "/interview_list", "icon": "fa fa-calendar", "active":"deactive"}
    // ]);

    /* Function to intialise controller */
    $scope.init = function(){
		$scope.$root.$broadcast("myEvent", {});
		var token = services.getAuthKey();

        if(hme.role_client == hme.logInUserRole){
            hme.getTechnologies();
            hme.getPieChartforClientDashboard();
        }else if(hme.logInUserRole == hme.role_hr){
            hme.getPieChartforHrDashboard();
        }else if(hme.logInUserRole == hme.role_admin){
            hme.getPieChartforAdminDashboard();    
        }
	}

    hme.getTechnologies = function(){
        var email = loggedInUser == undefined ? undefined :loggedInUser.identity.email;
        var mobile = loggedInUser == undefined ? undefined :loggedInUser.identity.mobile;
        var req = {
            'email':email,
            'contact_no':mobile,
        }
        var promise = services.getActiveTechnologyDetails(req);
        promise.success(function (result) {
            Utility.stopAnimation();
            // console.log(result.data);
            hme.technologyList = result.data;
        }, function myError(r) {
            hme.technologyList = [];
            toastr.error(r.data.message, 'Sorry!');
            Utility.stopAnimation();
        });
    }

    /* Function to get data for Admin dashboard*/
    hme.getPieChartforAdminDashboard = function(){
        var promise = services.getAdminDashboardDetails();
          promise.then(function mySuccess(response) {  
            Utility.stopAnimation();
            try {
                if(response.data.status_code == 200){
                    hme.adminDashboradRecord = response.data.data;
                    hme.drawPieChartForAdminOverallcandidates(response.data.data.technology_details);
                    hme.drawPieChartForAdminJoinedcandidates(response.data.data.technology_details);
                }
                else{  
                    hme.adminDashboradRecord = [];  
                }
            } catch (e) { 
                toastr.error('Sorry!');
                Raven.captureException(e)
            }
        }, function myError(r) {
            toastr.error(r.data.errors);
            Utility.stopAnimation();
        });
    }
    /* Function to draw piechart of overall candidates for admin dashboard*/
    hme.drawPieChartForAdminOverallcandidates = function(adminDashboradRecord){
        if(adminDashboradRecord != null){
            var PieData = [];
            for (var i = 0; i < adminDashboradRecord.length; i++) {               
                obj = {
                    value    : adminDashboradRecord[i].total_overall_candidate_count,
                    color    : '#0d5aba',
                    highlight: '#0d5aba',
                    Browser  :  adminDashboradRecord[i].name,
                    label :  adminDashboradRecord[i].total_overall_candidate_count,
                };
                PieData.push(obj);
            }
            
            // hme.chart_data = PieData;
            var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                var dataItem = PieData[itemIndex];
                return "<div style='text-align:center'>"+dataItem.label+"</div>";
            };

            var settings = {
                title: "Overall Candidates",
                showToolTips: true,               
                enableAnimations: true,
                showLegend: true,
                showBorderLine: true,
                legendLayout: { left: 320, top: 200, width: 150, height: 300, flow: 'vertical' },
                padding: { left:5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 20, right: 0, bottom: 10 },
                source: PieData,
                colorScheme: 'scheme02',
                seriesGroups:
                [{
                    type: 'donut',
                    offsetX: 150,
                    showLabels: true,
                    // toolTipFormatFunction: toolTipCustomFormatFn,
                    series:
                    [{
                        dataField: 'value',
                        displayText: 'Browser',
                        labelRadius: 90,
                        initialAngle: 15,
                        radius: 120,
                        innerRadius: 60,
                        centerOffset: 0,
                        formatSettings: {  decimalPlaces: 0 }
                    }]
                }]
            };
            // setup the chart
            $('#adminOverallChartContainer').jqxChart(settings);
        } 
    }
    /* Function to draw piechart of joined candidates for admin dashboard*/
    hme.drawPieChartForAdminJoinedcandidates = function(adminDashboradRecord){
        if(adminDashboradRecord != null){
            var PieData = [];
            for (var i = 0; i < adminDashboradRecord.length; i++) {               
                obj = {
                    value    : adminDashboradRecord[i].total_joined_candidate_count,
                    color    : '#f56954',
                    highlight: '#f56954',
                    Browser  :  adminDashboradRecord[i].name,
                    label :  adminDashboradRecord[i].total_joined_candidate_count,
                };
                PieData.push(obj);
            }
            
            // hme.chart_data = PieData;
            var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                var dataItem = PieData[itemIndex];
                return "<div style='text-align:center'>"+dataItem.label+"</div>";
            };

            var settings = {
                title: "Joined Candidates",
                showToolTips: true,               
                enableAnimations: true,
                showLegend: true,
                showBorderLine: true,
                legendLayout: { left: 320, top: 200, width: 150, height: 300, flow: 'vertical' },
                padding: { left:5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 20, right: 0, bottom: 10 },
                source: PieData,
                colorScheme: 'scheme02',
                seriesGroups:
                [{
                    type: 'donut',
                    offsetX: 150,
                    showLabels: true,
                    // toolTipFormatFunction: toolTipCustomFormatFn,
                    series:
                    [{
                        dataField: 'value',
                        displayText: 'Browser',
                        labelRadius: 90,
                        initialAngle: 15,
                        radius: 120,
                        innerRadius: 60,
                        centerOffset: 0,
                        formatSettings: {  decimalPlaces: 0 }
                    }]
                }]
            };
            // setup the chart
            $('#adminJoinedchartContainer').jqxChart(settings);
        } 
    }

    /* Function to get data for HR dashboard*/
    hme.getPieChartforHrDashboard = function(){
        var promise = services.getHrDashboardDetails();
        promise.then(function mySuccess(response) {  
            Utility.stopAnimation();
            try {
                if(response.data.status_code == 200){
                    hme.hrDashboradRecord = response.data.data;
                    hme.drawPieChartForHrOverallcandidates(response.data.data.technology_details);
                    hme.drawPieChartForHrJoinedcandidates(response.data.data.technology_details);
                }
                else{  
                    hme.hrDashboradRecord = [];  
                }
            } catch (e) { 
                toastr.error('Sorry!');
                Raven.captureException(e)
            }
        }, function myError(r) {
            toastr.error(r.data.errors);
            Utility.stopAnimation();
        });
    }
    /* Function to draw piechart of overall candidates for HR dashboard*/
    hme.drawPieChartForHrOverallcandidates = function(hrDashboradTechlRecord){
        console.log(hrDashboradTechlRecord);
        if(hrDashboradTechlRecord != null){
            var PieData = [];
            for (var i = 0; i < hrDashboradTechlRecord.length; i++) {               
                obj = {
                    value    : hrDashboradTechlRecord[i].total_overall_candidate_count,
                    color    : '#f56954',
                    highlight: '#f56954',
                    Browser  :  hrDashboradTechlRecord[i].name,
                    label :  hrDashboradTechlRecord[i].total_overall_candidate_count,
                };
                PieData.push(obj);
            } 
            // hme.chart_data = PieData;
            var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                var dataItem = PieData[itemIndex];
                return "<div style='text-align:center'>"+dataItem.label+"</div>";
            };

            var settings = {
                title: "Overall Candidates",
                showToolTips: true,               
                enableAnimations: true,
                showLegend: true,
                showBorderLine: true,
                legendLayout: { left: 320, top: 200, width: 150, height: 300, flow: 'vertical' },
                padding: { left:5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 20, right: 0, bottom: 10 },
                source: PieData,
                colorScheme: 'scheme02',
                seriesGroups:
                [{
                    type: 'donut',
                    offsetX: 150,
                    showLabels: true,
                    // toolTipFormatFunction: toolTipCustomFormatFn,
                    series:
                    [{
                        dataField: 'value',
                        displayText: 'Browser',
                        labelRadius: 90,
                        initialAngle: 15,
                        radius: 120,
                        innerRadius: 60,
                        centerOffset: 0,
                        formatSettings: {  decimalPlaces: 0 }
                    }]
                }]
            };
            // setup the chart
            $('#hrOverallChartContainer').jqxChart(settings);
        } 
    }
    /* Function to draw piechart of joined candidates for HR dashboard*/
    hme.drawPieChartForHrJoinedcandidates = function(hrDashboradTechRecord){
      if(hrDashboradTechRecord != null){
            var PieData = [];
            for (var i = 0; i < hrDashboradTechRecord.length; i++) {               
                obj = {
                    value    : hrDashboradTechRecord[i].total_joined_candidate_count,
                    color    : '#f56954',
                    highlight: '#f56954',
                    Browser  :  hrDashboradTechRecord[i].name,
                    label :  hrDashboradTechRecord[i].total_joined_candidate_count,
                };
                PieData.push(obj);
            }
            // hme.chart_data = PieData;
            var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                var dataItem = PieData[itemIndex];
                return "<div style='text-align:center'>"+dataItem.label+"</div>";
            };

            var settings = {
                title: "Joined Candidates",
                showToolTips: true,               
                enableAnimations: true,
                showLegend: true,
                showBorderLine: true,
                legendLayout: { left: 320, top: 200, width: 150, height: 300, flow: 'vertical' },
                padding: { left:5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 20, right: 0, bottom: 10 },
                source: PieData,
                colorScheme: 'scheme02',
                seriesGroups:
                [{
                    type: 'donut',
                    offsetX: 150,
                    showLabels: true,
                    // toolTipFormatFunction: toolTipCustomFormatFn,
                    series:
                    [{
                        dataField: 'value',
                        displayText: 'Browser',
                        labelRadius: 90,
                        initialAngle: 15,
                        radius: 120,
                        innerRadius: 60,
                        centerOffset: 0,
                        formatSettings: {  decimalPlaces: 0 }
                    }]
                }]
            };
            // setup the chart
            $('#hrJoinedChartContainer').jqxChart(settings);
        } 
    }

    /* Function to get data for client dashboard*/
    hme.getPieChartforClientDashboard = function(){
        var req={
            "email": hme.loginUserEmail,
            "contact_no": hme.loginUserMobile
        }
        var promise = services.getClientDashboardDetails(req);
          promise.then(function mySuccess(response) {  
            Utility.stopAnimation();
            try {
                if(response.data.status_code == 200){
                    hme.clientDashboradRecord = response.data.data;
                    hme.drawPieChartForClientSharedCandidates(response.data.data.technology_details);
                }
                else{  
                    hme.clientDashboradRecord = [];  
                }
            } catch (e) { 
                toastr.error('Sorry!');
                Raven.captureException(e)
            }
        }, function myError(r) {
            toastr.error(r.data.errors);
            Utility.stopAnimation();
        });
    }
    /* Function to draw piechart of overall candidates for client dashboard*/
    hme.drawPieChartForClientSharedCandidates = function(clientDashboradSharedRecord){
        if(clientDashboradSharedRecord != null){
            var PieData = [];
            for (var i = 0; i < clientDashboradSharedRecord.length; i++) {               
                obj = {
                    value    : clientDashboradSharedRecord[i].total_candidate_count,
                    color    : '#0d5aba',
                    highlight: '#0d5aba',
                    Browser  :  clientDashboradSharedRecord[i].name,
                    label :  clientDashboradSharedRecord[i].total_candidate_count,
                };
                PieData.push(obj);
            }
            // hme.chart_data = PieData;
            var toolTipCustomFormatFn = function (value, itemIndex, serie, group, xAxisValue, xAxis) {
                var dataItem = PieData[itemIndex];
                return "<div style='text-align:center'>"+dataItem.label+"</div>";
            };

            var settings = {
                title: "Shared CV",
                showToolTips: true,               
                enableAnimations: true,
                showLegend: true,
                showBorderLine: false,
                legendLayout: { left: 350, top: 200, width: 150, height: 300, flow: 'vertical' },
                padding: { left:5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 0, top: 20, right: 0, bottom: 10 },
                source: PieData,
                colorScheme: 'scheme02',
                // borderLineColor: 'white',
                seriesGroups:
                [{
                    type: 'donut',
                    offsetX: 150,
                    showLabels: true,
                    // toolTipFormatFunction: toolTipCustomFormatFn,
                    series:
                    [{
                        dataField: 'value',
                        displayText: 'Browser',
                        labelRadius: 90,
                        initialAngle: 15,
                        radius: 120,
                        innerRadius: 60,
                        centerOffset: 0,
                        formatSettings: {  decimalPlaces: 0 }
                    }]
                }]
            };
            // setup the chart
            $('#clientSharedChartContainer').jqxChart(settings);
        } 
    }

	$scope.init();
});