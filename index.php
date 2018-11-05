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

        <link rel="stylesheet" href="/resources/lib/sweetalert2-6.6.0/sweetalert2.min.css">
        <!--iCheck -->
        <link rel="stylesheet" href="/resources/plugins/iCheck/square/blue.css">

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

        <link rel="stylesheet" type="text/css" href="/resources/css/sweetalert-master/dist/sweetalert.css">

        <script src="/resources/js/sweetalert-master/dist/sweetalert.min.js"></script>
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
            <pre>{{token}}</pre>
            <img id="loading-image" src="resources/img/loader.gif" alt="Loading..." />
        </div>
        <!-- Site wrapper -->
        <div class="wrapper">
            <div ng-controller="menuCtrl" >
                <!-- style="display:none;" -->
                <header class="main-header" ng-show="token">

                    <!-- Logo -->
                    <a href="/" class="logo">
                        <!-- mini logo for sidebar mini 50x50 pixels -->
                        <img src="/resources/img/syslogyx_logo_small.png" style="    padding-left: 7px; padding-top: 7px;" class="logo-mini">
                        <!-- logo for regular state and mobile devices -->
                        <img src="/resources/img/syslogyx_logo.png" style="padding-left: 35px;" class="logo-lg">
                    </a>
                    <!-- Header Navbar: style can be found in header.less -->
                    <nav class="navbar navbar-static-top" >
                        <!-- Sidebar toggle button-->
                        <div style="float:left">
                            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button" ng-show="token" style="outline:0;text-decoration: none;">
                                <span class="sr-only">Toggle navigation</span>
                            </a>
                        </div>

                        <div class="navbar-custom-menu ">
                            <ul class="nav navbar-nav " ng-show="token">

                                <li class=" dropdown user user-menu ">
                                    <a href="#" class="dropdown-toggle userSection" data-toggle="dropdown">
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
                            <li ng-repeat = "item in globalMenu" ng-click="select($index)" class="{{item.active}}">
                                
                                <a href="{{item.Link}}" id="{{item.id}}" style="outline:0;text-decoration: none;"> 
                                    <i class="{{item.icon}}"></i> <span style="z-index:1000">{{item.Title}}</span>       
                                </a> 
                            </li> 
                        </ul>
                    </section>
                    <!-- /.sidebar -->
                </aside>
            </div>
            <!-- =============================================== -->
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper" >
                <div id="viewPort" data-ng-view ></div>
            </div>
            <!-- /.content-wrapper -->
            <div class="menuSec" ng-controller="menuCtrl" style="min-height: 50px;">
                <footer class="main-footer" style="height: 50px;">
                    <div class="pull-right hidden-xs">
                        <b>Version</b> 0
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
        <div data-ng-controller="sidebarCtrl" id="sidebarComponent">          
                <div ng-include="'resources/templates/fund_request_info.html'"></div>
                <div ng-include="'resources/templates/login_user_fund_request_list_info.html'"></div>
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
       <!-- <script src="/resources/plugins/iCheck/icheck.min.js"></script>-->
    
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
         <!-- TwoPagination Plugin -->
         <!-- <script src="https://gitcdn.github.io/bootstrap-toggle/2.1.0/js/bootstrap-toggle.min.js"></script> -->
        <script src="/resources/plugins/jquery.twbsPagination/jquery.twbsPagination.min.js"></script>
        <script src="/resources/js/ui-bootstrap-tpls.js"></script>
        <script src="/resources/js/myapp.js"></script>  
        <script src="/controller/homeCtrl.js"></script>
        <script src="/controller/loginCtrl.js"></script>  
        <script src="/controller/menuCtrl.js"></script> 
        <script src="/controller/userCtrl.js"></script> 
        <script src="/controller/settingCtrl.js"></script> 
        <script src="/controller/resumeCtrl.js"></script> 
        <script src="/controller/resumeListCtrl.js"></script> 
        <script src="/controller/jobCtrl.js"></script>


         <script >
                    $( window ).scroll(function() {
                        $(".date-picker").blur();
                    });

                    $(window).on('popstate', function(event) {
                        console.log("back button clicked");
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
    </body>
</html>
