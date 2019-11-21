'use strict';


/**
 * @ngdoc overview
 * @name notificacionService
 * @description
 * # notificacionService
 * Service in the core.
 */

angular.module('themeService', [])

/**
 * @ngdoc service
 * @name themeService.service:behaviorTheme
 * @requires $http
 * @param {injector} $http componente http de angular
 * @requires $websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @description
 * # notificacion
 * Permite gestionar workflow de notificaciones
 */

.factory('behaviorTheme', function( CONF, configuracionRequest) {

        var methods = {
            sidebar: {
                open: true,
                class: ''
            },
            aplicacion: {
                open:true,
                class: ''
            },
            notificacion: {
                open:false,
                clase: 'notificacion_container'
            },

            toogleSidebar: function () {
                methods.sidebar.open = !methods.sidebar.open;
            },

            toogleNotificacion: function () {
                methods.notificacion.open = !methods.notificacion.open;
                console.log(methods.notificacion.open);
                // if (methods.aplicacion.open) {
                //     methods.toogleAplicacion();
                // }
                if (methods.notificacion.open) {
                    methods.notificacion.clase = 'notificacion_container menu_is_active';
                }else {
                    methods.notificacion.clase = 'notificacion_container';
                }
            },


            toogleAplicacion: function () {
                methods.aplicacion.open = !methods.aplicacion.open;
            },
        };
        return methods;
});
