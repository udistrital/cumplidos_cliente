'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.firmaElectronicaService
 * @description
 * # firmaElectronicaService
 * Factory in the contractualClienteApp.
 */
angular.module('firmaElectronicaService', [])
    .factory('firmaElectronicaRequest', function($http, token_service, CONF) {
        // Service logic
        var path = CONF.GENERAL.FIRMA_ELECTRONICA_SERVICE;

        // Public API here
        return {
            postFirmaElectronica: function(data) {
                console.log(`PAGO MENSUAL: ${JSON.stringify(data, null, 2)}`);
                return $http.post(path + 'firma_electronica', data, token_service.getHeader());
            }
        };
    });