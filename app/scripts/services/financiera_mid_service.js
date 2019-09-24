'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.financieraMidService
 * @description
 * # financieraMidService
 * Service in the financieraClienteApp.
 */
angular.module('financieraMidService', [])
    .factory('financieraMidRequest', function($http, $q, token_service, CONF) {
        // Service logic
        // ...
        //var path = "http://127.0.0.1:8086/v1/";
        var path = CONF.GENERAL.FINANCIERA_MID_SERVICE;
        // Public API here
        var cancelSearch; //defer object
        return {
            get: function(tabla, params) {
                cancelSearch = $q.defer();
                return $http.get(path + tabla + "/?" + params, [{ timeout: cancelSearch.promise }, token_service.getHeader()]);
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.getHeader());
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.getHeader());
            },
            cancel: function() {
                return cancelSearch.resolve('search aborted');
            }
        };
    });