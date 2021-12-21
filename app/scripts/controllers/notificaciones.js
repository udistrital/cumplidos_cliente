'use strict';
/**
 * @ngdoc function
 * @name core.controller:notificacionesCtrl
 * @description
 * # menuaplicacionesCtrl
 * Controller of the core
 */
angular.module('contractualClienteApp')
    .controller('notificacionesCtrl',
        function (notificacionRequest, $scope, behaviorTheme,token_service) {
            var self = this;
            $scope.roles= token_service.getAppPayload().role


            $scope.notificacion = notificacionRequest;
            $scope.notificacion.existeNotificaciones=false;

            if($scope.roles!=null && $scope.roles.includes('SUPERVISOR')){
                notificacionRequest.traerNotificacion().then(function (response) {
                    console.log(response)
                    if(response.data.Data!=null){
                        $scope.existenNotificaciones=true;
                        $scope.notificacion.existeNotificaciones=true;
                    }else{
                        $scope.existenNotificaciones=false;
                    }
                }).catch(
                    function (error) {
                        console.log(error)
                    }
                );
            }else{
                console.log("no tiene el rol")
            }
            

            $scope.claseContainer = behaviorTheme.notificacion;
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

        });