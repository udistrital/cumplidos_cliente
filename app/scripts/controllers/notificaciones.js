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
        function (notificacionRequest, $scope, behaviorTheme,token_service,$location) {
            var self = this;
            $scope.roles= token_service.getAppPayload().role


            $scope.notificacion = notificacionRequest;
            $scope.notificacion.existeNotificaciones=false;

            function traerNoticicaciones() {
                if($scope.roles!=null && $scope.roles.includes('SUPERVISOR')){
                    notificacionRequest.traerNotificacion('ColaSupervisor').then(function (response) {
                        //console.log(response)
                        if(response.data.Data!=null){
                            $scope.existenNotificaciones=true;
                            $scope.notificacion.existeNotificaciones=true;
                            $scope.url_redirect=response.data.Data[0].Body.Message;
                        }else{
                            $scope.existenNotificaciones=false;
                        }
                    }).catch(
                        function (error) {
                            //console.log(error)
                        }
                    );
                }else{
                    //console.log("no tiene el rol")
                }
    
    
                if($scope.roles!=null && $scope.roles.includes('ORDENADOR_DEL_GASTO')){
                    notificacionRequest.traerNotificacion('ColaOrdenador').then(function (response) {
                        //console.log(response)
                        if(response.data.Data!=null){
                            $scope.existenNotificaciones=true;
                            $scope.notificacion.existeNotificaciones=true;
                            $scope.url_redirect=response.data.Data[0].Body.Message;
                        }else{
                            $scope.existenNotificaciones=false;
                        }
                    }).catch(
                        function (error) {
                            //console.log(error)
                        }
                    );
                }else{
                    //console.log("no tiene el rol")
                }
            }
            

            $scope.claseContainer = behaviorTheme.notificacion;
            $scope.redirect_url = function () {
                $location.path($scope.url_redirect);
                behaviorTheme.toogleNotificacion();
                traerNoticicaciones()
            };

            traerNoticicaciones()

        });