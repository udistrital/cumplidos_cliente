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
    function (token_service, configuracionRequest, notificacion, $translate, $route, $mdSidenav, $scope) {
        $scope.hola = "cordial saludo";
        $scope.sidebarEvent= function(){
            console.log("data");
            var sidebarDiv = document.getElementById('menu-sidebar');
            var sidebarContainer = document.getElementById('menu-sidebar-container');
            var containerDiv= document.getElementById('container-div');   
            var containerFooter= document.getElementById('footer-id');   
            var containerBody= document.getElementById('container-body-id');   
            var containerLogoCollapsed= document.getElementById('argo'); 
            var containerLogo= document.getElementById('argo-info'); 
            console.log("container logo :"+containerLogo)
            if (sidebarDiv.className.includes("sidebar_off")){
                console.log("entro a funcion")
                sidebarContainer.classList.add('main-container-sidebar')
                sidebarContainer.classList.remove('main-container-sidebar-off')
                sidebarDiv.classList.add('sidebar_is_active')
                sidebarDiv.classList.remove('sidebar_off')
                containerBody.classList.add('container-body-off')
                containerBody.classList.remove('container-body')
                containerFooter.classList.add('container-footer-off')
                containerFooter.classList.remove('container-footer')
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
                containerFooter.classList.add('container-footer')
                containerFooter.classList.remove('container-footer-off')
                //*****************/
                containerLogo.classList.remove('header-logo')
                containerLogo.classList.add('header-logo-collapsed')
                containerLogo.style.display = "none";
                containerLogoCollapsed.style.display = "inline-block";
                
            }

        }
    });
