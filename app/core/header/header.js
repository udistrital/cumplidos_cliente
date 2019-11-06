'use strict';
/**
 * @ngdoc function
 * @name contractualClienteApp.controller:menuCtrl
 * @description
 * # menuCtrl
 * Controller of the contractualClienteApp
 */
angular.module('core')
    .controller('headerCtrl', 
    function (token_service, configuracionRequest, notificacion, $translate, $route, $mdSidenav, $scope) {
        $scope.hola = "cordial saludo";
    });
