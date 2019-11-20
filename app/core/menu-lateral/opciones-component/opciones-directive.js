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
                $scope.app = (CONF.APP.toLowerCase()).trim() + "-isotipo";
                $scope.app_large = (CONF.APP.toLowerCase()).trim() + "-header";
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
                $scope.toogle = function (nivel) {
                    var sidebarDiv = document.getElementById('menu-sidebar');
                    var sidebarContainer = document.getElementById('menu-sidebar-container');
                    var containerDiv = document.getElementById('container-div');
                    var containerBody = document.getElementById('container-body-id');
                    var containerLogoCollapsed = document.getElementById($scope.app);
                    var containerLogo = document.getElementById($scope.app_large);
                    var textoMenuLateral = document.getElementsByClassName("menulateral-text");
                    if (sidebarDiv.className.includes("sidebar_off")) {
                        for (var i = 0, il = textoMenuLateral.length; i < il; i++) {
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
                    if (nivel.Opciones !== null) {
                        var opcionAbierta = nivel.Opciones.filter(function (data) {
                            return data.open
                        });
                        if (opcionAbierta.length > 0 && self.open) {
                            nivel.open = self.open;
                        }else {
                            self.open = !self.open;
                            nivel.open = self.open;
                        }
                    }

                    if (!self.open) {
                        nivel.clase = 'content-menu-off';
                        nivel.style_icon = 'opcion-down';
                    } else {
                        nivel.clase = 'content-menu';
                        nivel.style_icon = 'opcion-up';
                    }
                };

            }
        }
    });