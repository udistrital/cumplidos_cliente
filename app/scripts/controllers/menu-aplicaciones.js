'use strict';
/**
 * @ngdoc function
 * @name core.controller:menuaplicacionesCtrl
 * @description
 * # menuaplicacionesCtrl
 * Controller of the core
 */
angular.module('contractualClienteApp')
    .controller('menuaplicacionesCtrl',
        function (configuracionRequest, $scope, behaviorTheme) {
            $scope.claseAppContainer = behaviorTheme.aplicacion;


            var container_aplicativos = document.getElementById("menu-aplicaciones");



            // Peticion comentada por error 504, y sin funcionalidad relevante.
            // configuracionRequest.post('aplicacion_rol', getRoles())
            //     .then(function (response) {

            //          var nuevasAplicaciones = categorias.map(function (categoria) {

            //             categoria.aplicaciones = categoria.aplicaciones.filter(function (aplicacion) {
            //                 return existe(aplicacion.nombre, response.data)
            //             })
            //             return categoria
            //         })
            //         nuevasAplicaciones = nuevasAplicaciones.filter(function (categoria) { return (categoria.aplicaciones.length > 0) });
            //             $scope.categorias = nuevasAplicaciones;

            //     }).catch(function (error) {console.log(error)});
        });
