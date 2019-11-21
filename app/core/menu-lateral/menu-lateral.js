'use strict';
/**
 * @ngdoc function
 * @name core.controller:menuLateralCtrl
 * @description
 * # menuLateralCtrl
 * Controller of the core
 */
angular.module('core')
    .controller('menuLateralCtrl',
        function ($location, CONF, $window, $scope, $rootScope, token_service, configuracionRequest, notificacion, $translate, $route, behaviorTheme) {

            $scope.language = {
                es: "btn btn-primary btn-circle btn-outline active",
                en: "btn btn-primary btn-circle btn-outline"
            };

            $scope.notificacion = notificacion;
            $scope.actual = "";
            $scope.token_service = token_service;
            $scope.breadcrumb = [];
            $scope.sidebarClases = behaviorTheme.sidebar;

            // optiene los menus segun el rol
            var roles = "CONTRATISTA"
            configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/' + CONF.APP_MENU)
                .then(function (response) {
                    behaviorTheme.initMenu(response.data);
                    $scope.menu = behaviorTheme.menu;
                }).catch(function (error) {
                });

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