'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:listaNotificacion
 * @description
 * # listaAvances
 */
angular.module('contractualClienteApp')
    .directive('listaNotificacion', function (notificacion) {
        return {
            restrict: 'E',
            scope: {
                data: '=',
            },
            templateUrl: 'views/directives/notificacion_list/notificacion_list.html',
            controllerAs: 'd_listaNotificacion',

            controller: function ($scope) {
                var self = this;
                $scope.notificacion = notificacion;
            }
        };
    });