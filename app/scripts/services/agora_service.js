'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.agoraService
 * @description
 * # agoraService
 * Factory in the contractualClienteApp.
 */
angular.module('agoraService', [])
    .factory('agoraRequest', function($http, CONF, token_service) {
        // Service logic
        // ...
        //var path = "http://10.20.0.254/administrativa_amazon_api/v1/";
        var path = CONF.GENERAL.ADMINISTRATIVA_PRUEBAS_SERVICE;
        // Public API here
        return {
            get: function(tabla, params) {
                return $http.get(path + tabla + "/?" + params, token_service.getHeader());
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.getHeader());
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.getHeader());
            }
        };
    });