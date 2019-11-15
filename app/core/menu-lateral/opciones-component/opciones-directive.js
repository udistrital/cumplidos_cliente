'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:listaNotificacion
 * @description
 * # listaAvances
 */
angular.module('core')
    .directive('opciones', function (CONF, $window, $location) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
                children: "=",
                father: '='
            },
            templateUrl: '/core/menu-lateral/opciones-component/opciones-directive.html',
            controllerAs: 'd_opciones',

            controller: function ($scope) {
                var self = this;
                self.open = false;
                $scope.tema = (CONF.CATEGORIA.toLowerCase()).trim() ;
                $scope.paleta = CONF.THEMES;
                $scope.opciones = [];
                console.log($scope.data);
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
                $scope.toogle = function(nivel) {
                    $scope.opciones = nivel;
                    self.open = !self.open;
                    if(self.open){
                        nivel.style_icon  = 'opcion-left';
                        nivel.clase =  'content-menu-off';
                    }else {
                        nivel.clase =  'content-menu';
                        nivel.style_icon  = 'opcion-down';
                    }
                };

            }
        }
    });