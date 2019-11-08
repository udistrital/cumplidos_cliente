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
    function ($location,CONF ,$http, $window, $scope, $rootScope, token_service, configuracionRequest, notificacion, $translate, $route, $mdSidenav) {
        var paths = [];
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };

        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];


        // optiene los menus segun el rol
        var roles = "CONTRATISTA"
        configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/' + CONF.GENERAL.APP, '')
        .then(function (response) {
            $rootScope.my_menu = response.data;
        }).catch(function(error){
        });

        var update_url = function () {
            $scope.breadcrumb = [''];
            for (var i = 0; i < paths.length; i++) {
                if ($scope.actual === "/" + paths[i].path) {
                    $scope.breadcrumb = paths[i].padre;
                } else if ('/' === $scope.actual) {
                    $scope.breadcrumb = [''];
                }
            }
        };

        $scope.redirect_url = function (path) {
            console.log(path);
            console.log(CONF);
            
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


        $http.get("scripts/models/app_menus.json")
            .then(function (response) {
                $scope.menu_app = response.data;
            });

        $scope.$on('$routeChangeStart', function ( /*next, current*/) {
            $scope.actual = $location.path();
            update_url();
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

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleLeft = buildToggler('left');   
        $scope.toggleRight = buildToggler('right');

});