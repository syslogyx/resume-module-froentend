<!DOCTYPE html>
<html> 
    <head>

        <base href="/">

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
        <title>Resume Module</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <link rel="shortcut icon" href="/resources/img/favicon.ico">
        <!-- Bootstrap 3.3.6 -->    
        <link rel="stylesheet" href="/resources/plugins/bootstrap/css/bootstrap.min.css">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="/resources/lib/font-awesome-4.5.0/css/font-awesome.min.css">
        <!-- Ionicons -->
        <link rel="stylesheet" href="/resources/lib/ionicons-2.0.1/css/ionicons.min.css">
        <!--iCheck -->
        <link rel="stylesheet" href="/resources/plugins/icheck-1.x/skins/square/blue.css">

        <!-- Theme style -->
        <link rel="stylesheet" href="/resources/css/AdminLTE.min.css">
        <!-- AdminLTE Skins. Choose a skin from the css/skins
             folder instead of downloading all of them to reduce the load. -->
        <link rel="stylesheet" href="/resources/css/skins/_all-skins.css">
        <!-- css default skin: _all-skins.min.css   -->

        <link rel="stylesheet" href="/resources/lib/bootstrap-3.1.1/css/bootstrap.min.css">

        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
        <!-- Data Table -->
        <link rel="stylesheet" type="text/css" href="/resources/lib/datatables-1.10.15/css/datatables.min.css"/>  

        <!--<link rel="stylesheet" href="resources/css/style.css">-->

        <link rel="stylesheet" href="/resources/lib/angular-toggle-switch-master/angular-toggle-switch.css">
        <link rel="stylesheet" href="/resources/lib/angular-toggle-switch-master/angular-toggle-switch-bootstrap.css">
        <link rel="stylesheet" href="/resources/lib/angular-block-ui-master/dist/angular-block-ui.min.css"/>

        <link rel="stylesheet" href="/resources/plugins/datepicker/datepicker3.css">
        <!--<link rel="stylesheet" href="/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />-->
        <link rel="stylesheet" type="text/css" href="/resources/plugins/timepicker/bootstrap-timepicker.min.css" />
        <!-- Select2 -->
        <link rel="stylesheet" href="/resources/plugins/select2/select2.min.css">
        <!-- Custom common style -->
        <link rel="stylesheet" type="text/css" href="/resources/css/commonStyle.css"/> 
        <link rel="stylesheet" href="/resources/plugins/sweetalert2-6.6.0/sweetalert2.min.css">

        
        <!-- Material design icons -->
        <link rel="stylesheet" type="text/css" href="/resources/node_modules/mdi/css/materialdesignicons.min.css">

        <!-- Material design icons -->
        <link rel="stylesheet" type="text/css" href="/resources/css/animate.css">

        <!-- For toaster alert section -->
        <link rel="stylesheet" href="/resources/bower_components/toastr/toastr.min.css">
        
        <!-- <link href="/resources/bower_components/bootstrap-toggle-master/css/bootstrap2-toggle.min.css" rel="stylesheet">
        <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet"> -->
        <link href="/resources/plugins/angular-bootstrap-toggle-master/dist/angular-bootstrap-toggle.min.css" rel="stylesheet">
        <!-- <link href="https://gitcdn.github.io/bootstrap-toggle/2.1.0/css/bootstrap-toggle.min.css" rel="stylesheet"> -->
        
        <!-- For panel in fund request section -->
        <link rel="stylesheet" type="text/css" href="/resources/css/ziehharmonika.css">

        <link rel="stylesheet" type="text/css" href="/resources/css/jquery-ui.css">
        <link href="/resources/plugins/angular-ui-switch-master/angular-ui-switch.min.css" rel="stylesheet">
        <link href="/resources/plugins/lou-multi-select-e052211/css/multi-select.css" rel="stylesheet">
        <!-- pie_chart -->
        <link rel="stylesheet" href="/resources/pie_chart/jqwidgets/styles/jqx.base.css" type="text/css" />
        <style>
            [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-    ng-cloak{
                display: none !important;
            }
            .Blink {
                animation: blinker 1.5s cubic-bezier(.5, 0, 1, 1) infinite alternate;  
            }
            @keyframes blinker {  
                from { opacity: 1; }
                to { opacity: 0; }
            }

            .skin-blue .sidebar-menu > li:hover > a, .skin-blue .sidebar-menu > li.active > a {
                outline:0;
                text-decoration: none;
            }
        </style>
    </head>

    <body ng-app="myapp" class="hold-transition skin-blue sidebar-mini ng-cloak" ng-cloak="" ui-view autoscroll="false" >
        <div id="loading" ng-if="logInUserRole != 0"style="display:none;">
            <img id="loading-image" src="resources/img/loader.gif" alt="Loading..." />
        </div>
        <!-- <pre>{{token}}</pre> -->
        <!-- Site wrapper -->
        <div class="wrapper">
            <div id="menuCtrl" ng-controller="menuCtrl" >
                <!-- style="display:none;" -->
                <header class="main-header" ng-show="token">

                    <!-- Logo -->
                    <a href="/" class="logo" onclick="window.location.reload();">
                        <!-- mini logo for sidebar mini 50x50 pixels -->
                        <img src="/resources/img/syslogyx_logo_small.png" style="    padding-left: 7px; padding-top: 7px;" class="logo-mini">
                        <!-- logo for regular state and mobile devices -->
                        <img src="/resources/img/syslogyx_logo.png" style="padding-left: 35px;" class="logo-lg">
                    </a>
                    <!-- Header Navbar: style can be found in header.less -->
                    <nav class="navbar navbar-static-top" >
                        <!-- Sidebar toggle button-->
                        <div style="float:left">
                            <a class="sidebar-toggle" data-toggle="push-menu" role="button" ng-show="token" style="outline:0;text-decoration: none;">
                                <span class="sr-only">Toggle navigation</span>
                            </a>
                        </div>

                        <div class="navbar-custom-menu ">
                            <ul class="nav navbar-nav " ng-show="token">

                                <li class=" dropdown user user-menu ">
                                    <a class="dropdown-toggle userSection" data-toggle="dropdown">
                                        <img src="resources/img/default_profile.png" class="user-image" alt="User Image" >
                                    </a>
                                    <ul class="dropdown-menu" id="logout" style="margin-top: 18%;">
                                    <!-- User image -->

                                        <li class="user-header">
                                            <img src="resources/img/default_profile.png" class="img-circle" alt="User Image">
                                            <p><span ng-href="" style="color: white;">{{name}}</span>
                                            </p>
                                        </li>

                                         <!-- Menu Footer-->
                                        <li class="user-footer">
                                            <div class="pull-left">
                                                <button type="button" class="btn btn-default btn-md" title="Update Profile" data-ng-click="getUserData();setCSS();" ng-if="showUpdateProfile">Update Profile
                                                </button>
                                            </div>
                                            <div class="pull-right">
                                                <button type="button" class="btn btn-default btn-md" title="Logout" data-ng-click="clearToken()">Logout
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>

                <!-- =============================================== -->

                <!-- Left side column. contains the sidebar -->
                <aside class="main-sidebar " ng-show="token">
                    <!-- sidebar: style can be found in sidebar.less -->
                    <section class="sidebar">
                        <!-- Sidebar user panel -->
                        <div class="user-panel push-menu">
                            <div class="pull-left image">
                              <img src="resources/img/default_profile.png" class="img-circle" alt="User Image">
                            </div>
                            <div class="pull-left info" style='white-space: initial;'>
                              <p>{{name}}</p>
                            </div>
                        </div>
                      
                        <ul class="sidebar-menu" data-widget="treeview" role="menu">
                            <!-- Dashboard Menu -->
                            <li id="{{item.Title | removeSpaces}}" ng-repeat = "item in menuList" ng-click="menuClick(item.Link)" class="{{item.active}}">
                                <a href="{{item.Link}}" id="{{item.id}}" style="outline:0;text-decoration: none;">
                                    <i class="{{item.icon}}"></i> <span>{{item.Title}}</span>
                                </a>
                            </li>
                        </ul>
                    </section>
                    <!-- /.sidebar -->
                </aside>
                <!-- Modal to update user profile -->
                <div class="modal fade" id="updateUserModal" role="dialog">
                    <div class="modal-dialog modal-md">
                        <form role="form" name="updateUserForm" id="updateUserForm">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Update User Profile</h4>
                                </div>

                                <div class="modal-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="mandatory" for="">Name</label>
                                                    <input type="text" class="form-control" name="userName" ng-model="userName" placeholder="Enter user name">
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="mandatory" for="">Email</label>
                                                    <input type="text" class="form-control" name="userEmail" ng-model="userEmail" placeholder="Enter email">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="mandatory" for="">Contact No.</label>
                                                    <input type="text" class="form-control" id="mobileNo" name="mobileNo" ng-model="mobileNo" placeholder="Enter number">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="" for="">Password</label>
                                                    <input type="text" class="form-control" name="userProfilePassword"  id="userProfilePassword" ng-model="userpassword" placeholder="Enter password">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer">
                                    <div class="pull pull-right">
                                        <input type="submit" value="Save" id="updateUserProfile" data-ng-click="saveUser()" class="btn btn-success"/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- =============================================== -->
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper" id="cw">
                <div id="viewPort" data-ng-view ></div>
            </div>
            <!-- /.content-wrapper -->
            <div class="menuSec" ng-controller="menuCtrl" style="min-height: 50px;">
                <footer class="main-footer" style="height: 50px;">
                    <div class="pull-right hidden-xs">
                        <b>Version</b> 1.0.5
                    </div>
                    <strong>Copyright &copy; 2018 <a href="http://www.syslogyx.com/">Syslogyx Technologies Pvt. Ltd.</a></strong> All rights
                    reserved.
                </footer>

                <div class="pm_uploader_container pmct">
                    <div class="pm_uploader_head">
                        <h4 >Uploading 1 file</h4> 
                        <a href="" class="pm_close"><i class="mdi mdi-close"></i></a>
                    </div>
                    <div class="pm_uploader_body">
                        <div class="file_info">
                            sbfkjqhnkasnd.jpg
                        </div>
                        <div class="file_activity">
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" aria-valuenow="70"
                                     aria-valuemin="0" aria-valuemax="100" style="width:70%">
                                    <span class="sr-only">70% Complete</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- ./wrapper -->          
        </div>
       
         <!-- jQuery 3 -->
        <script src="/resources/plugins/jQuery/jquery.min.js"></script>
       
        <!-- SlimScroll -->
        <script src="/resources/plugins/slimScroll/jquery.slimscroll.min.js"></script>
        <!-- FastClick -->
        <script src="/resources/plugins/fastclick/fastclick.js"></script>
        <!-- AdminLTE for demo purposes -->
        <script src="/resources/js/demo.js"></script>
        <!--jQuery Cookies -->
        <script src="/resources/bower_components/jquery-cookie-master/src/jquery.cookie.js"></script>
        <!-- Data Table -->
        <script type="text/javascript" src="/resources/lib/datatables-1.10.15/js/datatables.min.js"></script>
        <script src="/resources/plugins/jquery-validation/dist/jquery.validate.min.js"></script>
        <script src="/resources/lib/angular-1.4.8/angular.min.js"></script>
        <script src="/resources/lib/angular-1.4.8/angular-route.js"></script>
        <script src="/resources/bower_components/angular-acl/angular-acl.js"></script>
        <script src="/resources/bower_components/angular-cookies/angular-cookies.js"></script>
        <!--<script src="/resources/plugins/jquery-validation/dist/jquery.validate.min.js"></script>-->
        <script src="/resources/plugins/icheck-1.x/icheck.js"></script>
    
        <!-- For toaster alert -->
        <script src="/resources/bower_components/toastr/toastr.min.js"></script>
        <!-- date-range-picker -->
        <script src="/resources/lib/moment/moment.min.js"></script>
        <script src="/resources/plugins/daterangepicker/daterangepicker.js"></script>
        <!--<script type="text/javascript" src="/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>-->
        <script type="text/javascript" src="/resources/plugins/timepicker/bootstrap-timepicker.min.js"></script>
        <!-- Select2 -->
        <script src="/resources/plugins/select2/select2.full.min.js"></script>
        <script src="https://cdn.ravenjs.com/3.17.0/raven.min.js" crossorigin="anonymous"></script>
        <!-- AdminLTE App -->
        <script src="/resources/plugins/sweetalert2-6.6.0/sweetalert2.min.js"></script>
        <script src="/resources/js/app.min.js"></script>
        <script src="/resources/js/adminlte.min.js"></script>
        <script type="text/javascript" src="/resources/lib/ckeditor-new/ckeditor.js"></script>
        <script type="text/javascript" src="/resources/lib/ckeditor-new/jquery.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script src="/resources/plugins/sortable/sortable.js"></script>
        <!--<script src="/resources/plugins/jQueryUI/jquery-ui.js"></script>
        <script src="/resources/plugins/jQueryUI/jquery-ui.min.js"></script>-->
        <!-- bootstrap datepicker -->
        <script src="/resources/plugins/datepicker/bootstrap-datepicker.js"></script>
        <!-- Bootstrap 3.3.6 -->
        <script src="/resources/js/bootstrap.min.js"></script>
        <!-- <script src="/resources/bower_components/bootstrap-toggle-master/js/bootstrap2-toggle.min.js"></script> -->
        <script src="/resources/plugins/angular-bootstrap-toggle-master/dist/angular-bootstrap-toggle.min.js"></script>
        <script src="/resources/plugins/angular-ui-switch-master/angular-ui-switch.min.js"></script>
        <script src="/resources/plugins/lou-multi-select-e052211/js/jquery.multi-select.js"></script>
         <!-- TwoPagination Plugin -->
         <!-- <script src="https://gitcdn.github.io/bootstrap-toggle/2.1.0/js/bootstrap-toggle.min.js"></script> -->
        <!-- <script src="/resources/plugins/jquery.twbsPagination/jquery.twbsPagination.min.js"></script> -->
        <script src="/resources/plugins/jquery.twbsPagination/jquery.twbsPagination.min.js"></script>
        <!-- <script src="/resources/plugins/Jquery-freezeheader-plugin/js/jquery.freezeheader.js"></script> -->
        <script src="/resources/js/ui-bootstrap-tpls.js"></script>

        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxcore.js"></script>
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxdraw.js"></script>
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxchart.core.js"></script>
        
        <!-- <script type="text/javascript" src="scripts/demos.js"></script> -->
        <script type="text/javascript" src="/resources/pie_chart/jqwidgets/jqxdata.js"></script>
        
        <script src="/resources/js/myapp.js"></script>  
        <script src="/controller/homeCtrl.js"></script>
        <script src="/controller/loginCtrl.js"></script>  
        <script src="/controller/menuCtrl.js"></script> 
        <script src="/controller/userCtrl.js"></script> 
        <script src="/controller/resumeCtrl.js"></script> 
        <script src="/controller/resumeListCtrl.js"></script> 
        <script src="/controller/jobCtrl.js"></script>
        <script src="/controller/screeningCtrl.js"></script>
        <script src="/controller/screeningTestCtrl.js"></script>
        <script src="/controller/interviewListCtrl.js"></script>
        <script src="/controller/resultCtrl.js"></script>
        <script src="/controller/documentsCtrl.js"></script>
        <script src="/controller/clientCtrl.js"></script>
        <script src="/controller/backgroundChecklistCtrl.js"></script>
        <script src="/controller/forwardResumeListCtrl.js"></script>
        <script src="/controller/roundDtlsCtrl.js"></script>
        <script src="/controller/techDetailsCtrl.js"></script>
        <script src="/controller/technologiesCtrl.js"></script>
        <script src="/controller/utilityCtrl.js"></script>
        <script src="/controller/jobDescriptionListCtrl.js"></script>
        <script src="/controller/candidateListCtrl.js"></script>

         <script>
                    $( window ).scroll(function() {
                        $(".date-picker").blur();
                    });

                    $(window).on('popstate', function(event) {
                        // console.log("back button clicked");
                        $(".modal").modal("hide");
                        $('.modal-backdrop').remove();
                        // $('.modal').remove();
                        $("body").removeClass("modal-open");
                        $("body").css("padding-right", "0px");
                    });
        </script>
        <script>
            var clickedOnScrollbar = function(mouseX){
                if( $(window).outerWidth() <= mouseX ){
                return true;
                }
            }

            $(document).mousedown(function(e){
                if( clickedOnScrollbar(e.clientX) ){
                    $(".date-picker").blur();
                }
            });
        </script>

        <script>
            $(document).ready(function () {
                $("html, body").animate({scrollTop: 0}, "fast");
                $('.modal').on('hidden.bs.modal', function (e) {
                    console.log("Modal is closed");
                    $('header').css('z-index', '1053');
                    $('footer').css('z-index', '1053');
                })
            });
            function setCSS(){
                if($('.modal').is(':visible') == true){
                    console.log("Modal is open");
                    $('header').css('z-index', '900');
                    $('footer').css('z-index', '900');
                }else{
                    $('header').css('z-index', '1053');
                    $('footer').css('z-index', '1053');
                }
            }
            setCSS();
        </script>
        <script>
            $(document).ready(function () {

                $.validator.addMethod('userEmailregex', function (value, element, regexp) {
                    if (regexp.constructor != RegExp)
                        regexp = new RegExp(regexp);
                    else if (regexp.global)
                        regexp.lastIndex = 0;
                    return this.optional(element) || regexp.test(value);
                }, 'Please enter a valid Email Address.');

                $.validator.addMethod("mymobilenumber", function (phone_number, element) {
                    phone_number = phone_number.replace(/\s+/g, "");
                    return this.optional(element) || phone_number.length > 9 &&
                            phone_number.match(/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/);
                }, 'Please enter a valid contact number.');

                $("#updateUserForm").validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block help-block-error',
                    errorPlacement: function (error, element) {

                        var type = $(element).attr("type");
                        if ($(element).attr("id") === "mobileNo")
                        {
                            // custom placement
                            element.parent().append(error);
                        } else {
                            error.insertAfter(element);
                        }
                    },
                    focusInvalid: true, // set focus the last invalid input
                    ignore: [], // validate all fields including form hidden input
                    rules: {
                        userName: {
                            required: true
                        },
                        userEmail: {
                            required: true,
                            userEmailregex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i
                        },
                        mobileNo: {
                            required: {
                                depends:function(){
                                    $(this).val($.trim($(this).val()).split(" ").join(""));
                                    return true;
                                }
                            },
                            mymobilenumber: true,
                            minlength: 10,
                            maxlength: 12,
                        },
                    },
                    messages: {
                        userName: {
                            required: "User name is required."
                        },
                        userEmail: {
                            required: "Email is required."
                        },
                        mobileNo: {
                            required: "Contact number is required."
                        }
                    },
                    highlight: function (element) { // hightlight error inputs
                        $(element)
                                .closest('.form-group').addClass('has-error');
                        $(element)
                                .next().children().children().attr('style', 'border-color:#dd4b39!important');
                        // set error class to the control group
                    },
                    unhighlight: function (element) { // revert the change done by hightlight
                        $(element)
                                .closest('.form-group').removeClass('has-error');
                        $(element)
                                .next().children().children().attr('style', 'border-color:'); // set error class to the control group
                    },
                    success: function (label) {
                        label
                                .closest('.form-group').removeClass('has-error'); // set success class to the control group
                    }
                });
            });
        </script>
    </body>
</html>
