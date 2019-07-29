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
        var payload = {};
        var notificacion_estado_usuario = [];
        var no_vistos = 0;
        var addMessage = function (message) {
            methods.log = [message].concat(methods.log);
            no_vistos = (methods.log.filter(function (data) { return (data.Estado === 'enviada')})).length;
        };

        var queryNotification = function () {
            configuracionRequest.get('notificacion_estado_usuario?query=Usuario:' + payload.sub + ',Activo:true&sortby=id&order=asc&limit=-1')
                .then(function (response) {
                    if (response !== null) {
                        notificacion_estado_usuario = response.data;
                        console.log(response);
                        notificacion_estado_usuario.map(function (notify) {
                            if (typeof notify.Notificacion !== 'undefined') {
                                var message = {
                                    Id: notify.Id,
                                    Type: notify.Notificacion.NotificacionConfiguracion.Tipo.Id,
                                    Content: JSON.parse(notify.Notificacion.CuerpoNotificacion),
                                    User: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Nombre,
                                    Alias: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Alias,
                                    EstiloIcono: notify.Notificacion.NotificacionConfiguracion.Aplicacion.EstiloIcono,
                                    FechaCreacion: new Date(notify.Notificacion.FechaCreacion),
                                    FechaEdicion: new Date(notify.Fecha),
                                    Estado: notify.NotificacionEstado.CodigoAbreviacion,
                                };
                                addMessage(message);
                            }
                        });
                    }
                });
        };
        if (token_service.live_token()) {
            payload = token_service.getPayload();
            if (!angular.isUndefined(payload.role)) {
                var roles = "";
                if (typeof payload.role === "object") {
                    var rl = [];
                    for (var index = 0; index < payload.role.length; index++) {
                        if (payload.role[index].indexOf("/") < 0) {
                            rl.push(payload.role[index]);
                        }
                    }
                    roles = rl.toString();
                } else {
                    roles = payload.role;
                }

                roles = roles.replace(/,/g, '%2C');
                var dataStream = $websocket(CONF.GENERAL.NOTIFICACION_WS + "?id=" + payload.sub + "&profiles=" + roles);
                dataStream.onMessage(function (message) {
                    log.unshift(JSON.parse(message.data));
                });
                queryNotification();
            }
        }



        var methods = {
            id: -1,
            log: log,
            notificacion_estado_usuario: notificacion_estado_usuario,
            no_vistos: no_vistos,
            queryNotification: queryNotification,
            addMessage: addMessage,

            get: function () {
                dataStream.send(JSON.stringify({
                    action: 'get'
                }));
            },

            changeStateNoView: function (user) {
                if (methods.listMessage.filter(function (data) { return data.Estado === 'enviada' }).length >= 1) {
                    configuracionRequest.post('notificacion_estado_usuario/changeStateNoView/' + user, {})
                        .then(function (response) {
                            console.log(response);
                            methods.log = [];
                            methods.queryNotification();
                        })
                }
            },

            getNotificacionEstadoUsuario: function (id) {
                return notificacion_estado_usuario.filter(function (data) { return (data.Id === id) })[0]
            },

            changeStateToView: function (id) {
                var noti = methods.getNotificacionEstadoUsuario(id);
                noti.Activo = false;
                configuracionRequest.put('notificacion_estado_usuario', noti.Id,noti)
                    .then(function (res) {
                        noti[0].Id = null
                        noti[0].Activo = true
                        noti[0].NotificacionEstado = {
                            Id: 3
                        }
                        configuracionRequest.post('notificacion_estado_usuario', noti[0])
                            .then(function (res) {
                                methods.listMessage = [];
                                methods.queryNotification();
                            });
                    });

            },

            queryNotification: function () {
                configuracionRequest.get('notificacion_estado_usuario?query=Usuario:' + methods.payload.sub + ',Activo:true&sortby=id&order=asc&limit=-1')
                    .then(function (response) {
                        if (response !== null) {
                            methods.notificacion_estado_usuario = response;
                            response.map(function (notify) {
                                if (typeof notify.Notificacion !== 'undefined') {
                                    var message = {
                                        Id: notify.Id,
                                        Type: notify.Notificacion.NotificacionConfiguracion.Tipo.Id,
                                        Content: JSON.parse(notify.Notificacion.CuerpoNotificacion),
                                        User: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Nombre,
                                        Alias: notify.Notificacion.NotificacionConfiguracion.Aplicacion.Alias,
                                        EstiloIcono: notify.Notificacion.NotificacionConfiguracion.Aplicacion.EstiloIcono,
                                        FechaCreacion: new Date(notify.Notificacion.FechaCreacion),
                                        FechaEdicion: new Date(notify.Fecha),
                                        Estado: notify.NotificacionEstado.CodigoAbreviacion,
                                    };
                                    methods.addMessage(message);
                                }
                            });
                        }
                    });
            }

        };
        return methods;
    });