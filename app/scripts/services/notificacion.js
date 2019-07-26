'use strict';

/**
 * @ngdoc service
 * @name notificacionesApp.notificacion
 * @description
 * # notificacion
 * Factory in the notificacionesApp.
 */
//10.20.0.254/notificacion_api/register?id=1&profile=admin

angular.module('contractualClienteApp')
    .factory('notificacion', function ($websocket, CONF, configuracionRequest, token_service) {

        var log = [];
        if (token_service.live_token()) {
            var token = token_service.getPayload();
            if (!angular.isUndefined(token.role)) {
                var roles = "";
                if (typeof token.role === "object") {
                    var rl = [];
                    for (var index = 0; index < token.role.length; index++) {
                        if (token.role[index].indexOf("/") < 0) {
                            rl.push(token.role[index]);
                        }
                    }
                    roles = rl.toString();
                } else {
                    roles = token.role;
                }

                roles = roles.replace(/,/g, '%2C');
                var dataStream = $websocket(CONF.GENERAL.NOTIFICACION_WS + "?id=" + token.sub + "&profiles=" + roles);
                dataStream.onMessage(function (message) {
                    log.unshift(JSON.parse(message.data));
                });
                configuracionRequest.get('menu_opcion_padre/ArbolMenus/' + roles + '/contratistas', '').then(function (response) {
                    console.log(response);
                })
                    .catch(
                        function (response) {
                            console.log(response);
                        });
            }
        }


        var methods = {
            id: -1,
            log: log,
            get: function () {
                dataStream.send(JSON.stringify({
                    action: 'get'
                }));
            },
            no_vistos: function () {
                var j = 0;
                angular.forEach(methods.log, function (notificiacion) {
                    if (!notificiacion.viewed) {
                        j += 1;
                    }
                });
                return j;
            }

        };
        return methods;
    });