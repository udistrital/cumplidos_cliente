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

                $scope.redirect_url = function (notify) {
                    // console.log(notify);
                    var path_sub = window.location.origin;
                    notificacion.changeStateToView(notify.Id, notify.Estado);
                    if (notify.Content.Message.Link.indexOf(path_sub)) {
                        window.open(notify.Content.Message.Link, "_blank");
                    } else {
                        $location.path(notify.Content.Message.Link);
                    }
                };

            }
        };

    });