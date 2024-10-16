'use strict';

/**
 * @ngdoc service
 * @name documentoService.documentoRequest
 * @description
 * # documentoRequest
 * Factory in the documentoService.
 */
angular.module('documentoService', [])
    .factory('documentoRequest', function($http, token_service, CONF) {
        // Service logic
        // ...
        //var path = "http://10.20.2.78:8081/v1/";
        //var path = "http://10.20.0.254/core_amazon_crud/v1/";
        var path = CONF.GENERAL.DOCUMENTO_CRUD_SERVICE;
        // Public API here
        return {
            get: function(tabla, params) {
                if(angular.isUndefined(params)){
                    return $http.get(path + tabla, token_service.getHeader());
                }else{
                    return $http.get(path + tabla + "/?" + params, token_service.getHeader());
                }
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