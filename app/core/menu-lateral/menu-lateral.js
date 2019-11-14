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
        
        $scope.language = {
            es: "btn btn-primary btn-circle btn-outline active",
            en: "btn btn-primary btn-circle btn-outline"
        };

        $scope.notificacion = notificacion;
        $scope.actual = "";
        $scope.token_service = token_service;
        $scope.breadcrumb = [];


        // optiene los menus segun el rol
        var roles = "ADMIN_TITAN"
        configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/' +'Titan')
        .then(function (response) {
            console.log(response);

            $rootScope.my_menu = response.data;
            $scope.my_menu = response.data;
        }).catch(function(error){
        });

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