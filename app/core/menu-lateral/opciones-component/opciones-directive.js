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
                self.open = true;
                $scope.nivel = null;
                $scope.tema = (CONF.CATEGORIA.toLowerCase()).trim();
                $scope.paleta = CONF.THEMES;
                $scope.opciones = null;
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
                $scope.toogle = function (nivel, $event) {
                    console.info($event)
                    self.open = !self.open;
                    $scope.nivel = nivel
                    $scope.opciones = nivel.Opciones;
                    console.info($scope.opciones);
                    if (self.open) {
                        $scope.nivel.clase = 'content-menu-off';
                        $scope.nivel.style_icon = 'opcion-left';
                        console.log($scope.opciones);
                    } else {
                        $scope.nivel.clase = 'content-menu';
                        $scope.nivel.style_icon = 'opcion-down';
                    }
                };

            }
        }
    });