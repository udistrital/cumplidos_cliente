'use strict';
/**
 * @ngdoc function
 * @name core.controller:menuLateralCtrl
 * @description
 * # menuLateralCtrl
 * Controller of the core
 */
angular.module('contractualClienteApp')
    .controller('menuLateralCtrl',
        function ($location, CONF, $window, $scope, $rootScope, token_service, configuracionRequest,$translate, $route, behaviorTheme) {

            $scope.language = {
                es: "btn btn-primary btn-circle btn-outline active",
                en: "btn btn-primary btn-circle btn-outline"
            };
            $scope.actual = "";
            $scope.token_service = token_service;
            $scope.sidebarClases = behaviorTheme.sidebar;

            // optiene los menus segun el rol

            if (token_service.live_token()) {
                token_service.getLoginData()
        .then(function() {
            $scope.token = token_service.getAppPayload();
            if (!angular.isUndefined($scope.token.role)) {
                var roles = "";
                if (typeof $scope.token.role === "object") {
                    var rl = [];


                    for (var index = 0; index < $scope.token.role.length; index++) {
                        if ($scope.token.role[index].indexOf(",") < 0) {
                            if($scope.token.role[index]!='Internal/everyone' && $scope.token.role[index]!='Internal/selfsignup'){
                                rl.push($scope.token.role[index]);
                            }   
                        }
                    }
                    roles = rl.toString();
                    console.log(roles);
                } else {
                    roles = $scope.token.role;
                }
                roles = roles.replace('Internal/everyone,', '','g');
                roles = roles.replace('Internal/selfsignup,', '','g');
                console.log('roles',roles)
                configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/contratistas', '').then(function(response) {
                    $rootScope.menu = response.data;
                    behaviorTheme.initMenu(response.data);
                    $scope.menu = behaviorTheme.menu;
                    })
                    .catch(
                        function(response) {
                            $rootScope.menu = response.data;
                            behaviorTheme.initMenu(response.data);
                            $scope.menu = behaviorTheme.menu;

                    });
            }
        });
            }

            

            $scope.redirect_url = function (path) {
                var path_sub = path.substring(0, 4);
                switch (path_sub.toUpperCase()) {
                    case "HTTP":
                        $window.open(path, "_blank");
                        break;
                    default:
                        $location.path(path);
                        break;
                }
            };

            $scope.$on('$routeChangeStart', function ( /*next, current*/) {
                $scope.actual = $location.path();
            });

            $scope.changeLanguage = function (key) {
                $translate.use(key);
                switch (key) {
                    case 'es':
                        $scope.language.es = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.en = "btn btn-primary btn-circle btn-outline";
                        break;
                    case 'en':
                        $scope.language.en = "btn btn-primary btn-circle btn-outline active";
                        $scope.language.es = "btn btn-primary btn-circle btn-outline";
                        break;
                    default:
                }
                $route.reload();
            };
        });