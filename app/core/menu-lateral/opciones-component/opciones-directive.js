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
                $scope.app = (CONF.APP.toLowerCase()).trim() + "-isotipo";
                $scope.app_large = (CONF.APP.toLowerCase()).trim() + "-header";
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

                    var sidebarDiv = document.getElementById('menu-sidebar');
                    var sidebarContainer = document.getElementById('menu-sidebar-container');
                    var containerDiv = document.getElementById('container-div');
                    var containerBody = document.getElementById('container-body-id');
                    var containerLogoCollapsed = document.getElementById($scope.app);
                    var containerLogo = document.getElementById($scope.app_large);
                    var textoMenuLateral = document.getElementsByClassName("menulateral-text");
                    if (sidebarDiv.className.includes("sidebar_off")) {
                        for(var i =0, il = textoMenuLateral.length;i<il;i++){
                            textoMenuLateral[i].classList.remove("oculto");
                        }
                        sidebarContainer.classList.add('main-container-sidebar')
                        sidebarContainer.classList.remove('main-container-sidebar-off')
                        sidebarDiv.classList.add('sidebar_is_active')
                        sidebarDiv.classList.remove('sidebar_off')
                        containerBody.classList.add('container-body-off')
                        containerBody.classList.remove('container-body')
                        containerLogo.style.display = "inline-block";
                        
                        containerLogoCollapsed.style.display = "none";
                        //*********************/
                        containerDiv.classList.add('container-view')
                        containerDiv.classList.remove('container-view-sidebar-off')
                    }
                    console.info($event)
                    self.open = !self.open;
                    $scope.nivel = nivel
                    $scope.opciones = nivel.Opciones;
                    console.info($scope.opciones);
                    if (self.open) {
                        $scope.nivel.clase = 'content-menu-off';
                        $scope.nivel.style_icon = 'opcion-up';
                        console.log($scope.opciones);
                    } else {
                        $scope.nivel.clase = 'content-menu';
                        $scope.nivel.style_icon = 'opcion-down';
                    }
                };

            }
        }
    });