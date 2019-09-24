'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.contratoService
 * @description
 * # contratoService
 * Factory in the contractualClienteApp.
 */
angular.module('contratoService', [])
    .factory('contratoRequest', function($http, token_service, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.CONTRATO_SERVICE;

        // Public API here
        return {
            get: function(tabla, params) {
                var url = path + tabla;
                if (params !== '') {
                    url = url + '/' + params;
                }
                return $http.get(url, token_service.getHeader());
            },
            getAll: function(tabla) {
                return $http.get(path + tabla, token_service.getHeader());
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