app.controller("loginCtrl", function (services, AclService, $scope, $http, $location, RESOURCES, $cookieStore) {

    var lgc = this;
    lgc.email = null;
    lgc.password = null;
    lgc.remember = false;
    lgc.token = null;

    lgc.data = [];

    /* function to login user with valid credentials */
    lgc.login = function () {
        if ($("#loginForm").valid()) {
            Utility.startAnimation();
            // console.log(lgc.email)
            var promise = services.logIn(lgc.email, lgc.password);
            promise.then(function mySucces(r) {
                // console.log(data);
                //     debugger;
                if (r.data != null) {
                    // set token in cookies
                    lgc.token = r.data.data.authToken;
                    // $cookieStore.put('authkey', lgc.token);
                    services.setAuthKey(lgc.token);
                    var role = r.data.data.role;
                    // console.log(role);
                    var abilities = [];
                    var data = r.data.data;
                    $.each(data.permissionGroupList, function (k, v) {
                        if (v.permissionList.length > 0) {
                            $.each(v.permissionList, function (k1, v1) {
                                abilities.push(v1.permissionTag);
                            })
                        }
                    });

                    var aclData = {admin: abilities}
                    AclService.setAbilities(aclData);

                    var identity = {
                        id: data.id,
                        authToken: data.authToken,
                        identity: {
                            name: data.name,
                            email: data.email,
                            mobile:data.mobile,
                            gender: data.gender,
                            designation: data.designation,
                            role: data.role,
                            uniqueToken:data.unique_token
                        }
                    }
                    services.setIdentity(identity);

                    $cookieStore.put('userPermission', JSON.stringify(abilities));
                    $cookieStore.put('identity', JSON.stringify(identity));
                    AclService.attachRole(role);
                    location.reload();
                    // $location.url('/home');
                    Utility.stopAnimation();
                } else {
                    /*console.log("Status code is not 200");*/
                }
            }, function myError(r) {
              /*  console.log(r);*/
                if (r.hasOwnProperty("data")) {
                    if (r.data != null){
                        toastr.error(r.data.message, 'Sorry!');
                    }else{
                        toastr.error('Sorry! Check server!!!');
                    }        
                }
                Utility.stopAnimation();
            });
        } else {
            //console.log("Enter valid credentials");
        }
    }

    /* Function to redirect view for forgot password*/
    lgc.forgotpassword = function () {
        $location.url('/site/forget-password');
    }
});

