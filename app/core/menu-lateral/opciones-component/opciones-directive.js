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
                var valorTema = 0

                var paletaColores =[
                    {   
                        nombre: "administrativa",
                        color : "rgb(142, 40, 37)"
                    },
                    {
                        nombre: "academica",
                        color: "rgb(21, 72, 94)"
                    },
                    {
                        nombre: "financiera",
                        color: "rgb(222, 158, 15)"
                    },
                    {
                        nombre: "analiticos",
                        color: "rgb(57, 122, 24)"
                    }
                    ]

                $scope.tema = valorTema;

                $scope.paleta = paletaColores
                var self = this;
                self.open = false;
                $scope.opciones = [];
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