'use strict';
/**
 * @ngdoc function
 * @name core.controller:headerCtrl
 * @description
 * # headerCtrl
 * Controller of the core
 */
angular.module('core')
    .controller('headerCtrl', 
    function (token_service, CONF, configuracionRequest, notificacion, $translate, $route, $mdSidenav, $scope) {

        $scope.token_service=token_service;
        $scope.tema = (CONF.CATEGORIA.toLowerCase()).trim() ;
        $scope.paleta = CONF.THEMES;

        $scope.app = (CONF.APP.toLowerCase()).trim() ;
        $scope.app_large = (CONF.APP.toLowerCase()).trim() + "-info";

        if(token_service.live_token()){
            $scope.isLogin=true

            $scope.token=token_service.getPayload();
        }
        $scope.logout= function(){
            token_service.logout();
        }

        $scope.toogleCerrarSesion = function(){
            var buttonCerrarSesion = document.getElementById('header-button-cerrarsesion-container');
            if(buttonCerrarSesion.style.display === "none" || buttonCerrarSesion.style.display === ""){
                buttonCerrarSesion.style.display = "block";
            }else{
                buttonCerrarSesion.style.display = "none";
            }
            
        }
        $scope.toogleAplicaciones = function() {
            var menuAplicaciones = document.getElementById('menu-aplicaciones');

            console.info(menuAplicaciones)
            if(menuAplicaciones.className.includes("menu_is_active")){
                menuAplicaciones.classList.remove("menu_is_active")
            }else{
                menuAplicaciones.classList.add("menu_is_active")
            }
        }

        $scope.togglenotify = function() {
            console.log("toogleNotifications");
            var notificaciones = document.getElementById('notificaciones');
            console.info(notificaciones);
            if(notificaciones.className.includes("menu_is_active")){
                notificaciones.classList.remove("menu_is_active")
            }else{
                notificaciones.classList.add("menu_is_active")
            }
        }

        $scope.sidebarEvent= function(){
            console.log("data");
            var sidebarDiv = document.getElementById('menu-sidebar');
            var sidebarContainer = document.getElementById('menu-sidebar-container');
            var containerDiv= document.getElementById('container-div');   
            var containerBody= document.getElementById('container-body-id');   
            var containerLogoCollapsed= document.getElementById($scope.app); 
            var containerLogo= document.getElementById($scope.app_large); 
            console.log("container logo :"+containerLogo)
            if (sidebarDiv.className.includes("sidebar_off")){
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
            }else{
                containerBody.classList.add('container-body')
                containerBody.classList.remove('container-body-off')
                sidebarContainer.classList.add('main-container-sidebar-off')
                sidebarContainer.classList.remove('main-container-sidebar')
                sidebarDiv.classList.add('sidebar_off')
                sidebarDiv.classList.remove('sidebar_is_active')
                //*****************/
                containerLogo.classList.remove('header-logo')
                containerLogo.classList.add('header-logo-collapsed')
                containerLogo.style.display = "none";
                containerLogoCollapsed.style.display = "inline-block";
                
            }

        }
    });
