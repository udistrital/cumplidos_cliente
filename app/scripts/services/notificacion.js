'use strict';


/**
 * @ngdoc overview
 * @name notificacionService
 * @description
 * # notificacionService
 * Service in the core.
 */

angular.module('notificacionService', [])

    /**
     * @ngdoc service
     * @name notificacionService.service:notificacionRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @requires $websocket
     * @param {injector} $websocket componente websocket de angular-websocket
     * @param {injector} $websocket componente websocket de angular-websocket
     * @description
     * # notificacion
     * Permite gestionar workflow de notificaciones
     */

    .factory('notificacionRequest', function (CONF,token_service, $http,$interval) {
        var TIME_PING = 50000;
        var self=this
        var path = CONF.GENERAL.NOTIFICACION_MID_SERVICE;
        var arm = CONF.GENERAL.ARM_AWS_NOTIFICACIONES;
        var log = [];
        var payload = {};
        var notificacion_estado_usuario = [];
        var no_vistos = 0;
        var addMessage = function (message) {
            methods.log = [message].concat(methods.log)
        };
        var user = "";

        if (token_service.live_token()) {
            token_service.getLoginData()
                .then(function () {
                    self.token = token_service.getAppPayload();
                    console.log('token',self.token)
                    // if(self.token.role!=null && $scope.role.includes('SUPERVISOR')){
                    //     notificacionRequest.traerNotificacion().then(function (response) {
                    //         console.log(response)
                    //         if(response.data.Data!=null){
                    //             $scope.existenNotificaciones=true;
                    //         }else{
                    //             $scope.existenNotificaciones=false;
                    //         }
                    //     }).catch(
                    //         function (error) {
                    //             console.log(error)
                    //         }
                    //     );
                    // }
                }).catch(

                )
        }

        return {
            existeNotificaciones:false,
            verificarSuscripcion: function() {
                var elemento={
                    Endpoint:self.token.email,
                    TopicArn:arm
                }
                return $http.post(path + 'notificaciones/suscripcion', elemento, token_service.getHeader());
            },
            suscripcion: function() {
                var elemento={
                    ArnTopic: arm,
                    Suscritos: [
                      {
                        Endpoint: self.token.email,
                        Id: self.token.documento,
                        Protocolo: 'email'
                      }
                    ]
                  }
                return $http.post(path + 'notificaciones/suscribir', elemento, token_service.getHeader());
            },
            enviarCorreo: function(asunto,atributos,destinatarios,idDuplicacion,idGrupoMensaje,mensaje,remitenteId) {
                var elemento={
                    Arn: arm,
                    Asunto:asunto,
                    Atributos:atributos,//objeto
                    DestinatarioId: destinatarios,//arreglo de strings
                    IdDeduplicacion:idDuplicacion,
                    IdGrupoMensaje:idGrupoMensaje,
                    Mensaje:mensaje,
                    RemitenteId:remitenteId,
                  }
                return $http.post(path + 'notificaciones/enviar', elemento, token_service.getHeader());
            },
            enviarNotificacion: function(asunto,destinatarioId,mensaje) {
                var elemento={
                    Arn: arm,
                    Asunto:asunto,
                    Atributos:{
                    },//objeto
                    DestinatarioId: [destinatarioId],//arreglo de strings
                    IdDeduplicacion:'',
                    IdGrupoMensaje:'',
                    Mensaje:mensaje,
                    RemitenteId:self.token.documento,
                  }
                return $http.post(path + 'notificaciones/enviar', elemento, token_service.getHeader());
            },
            traerNotificacion: function(nombreCola) {
                return $http.get(path + '/colas/mensajes?nombre='+nombreCola+'&numMax=1', token_service.getHeader());
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
            changeStateNoView: function () {
                console.log('changeStateNoView')
            }
        };
        });
