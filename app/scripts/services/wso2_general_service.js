'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.wso2GeneralService
 * @description
 * # wso2GeneralService
 * Factory in the contractualClienteApp.
 */
angular.module('contractualClienteApp')
  .factory('wso2GeneralService', function ($http, token_service, CONF) {
    // Service logic
    // ...
    var path = CONF.GENERAL.WSO2_SERVICE;

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
