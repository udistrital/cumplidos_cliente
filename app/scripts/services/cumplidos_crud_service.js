'use strict';

/**
 * @ngdoc service
 * @name cumplidosCrudService.cumplidosCrudRequest
 * @description
 * # cumplidosCrudRequest
 * Factory in the cumplidosCrudService.
 */
angular.module('cumplidosCrudService', [])
    .factory('cumplidosCrudRequest', function($http, CONF, token_service) {
        // Service logic
        // ...
        var path = CONF.GENERAL.CUMPLIDOS_CRUD_SERVICE;
        //var path = "http://localhost:8085/v1/";
        //var path = "http://10.20.2.150:8082/v1/";
        //var path = "http://10.20.0.138:8090/v1/";
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
