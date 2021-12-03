'use strict';

/**
 * @ngdoc service
 * @name cumplidosCrudService.cumplidosCrudRequest
 * @description
 * # cumplidosCrudRequest
 * Factory in the cumplidosCrudService.
 */
angular.module('utilsService', [])
    .factory('utils', function ($http, CONF,  $translate) {
        // Service logic
        // ...
        var meses = [{
            Id: 1,
            Nombre: $translate.instant('ENERO')
          },
          {
            Id: 2,
            Nombre: $translate.instant('FEBRERO')
          },
          {
            Id: 3,
            Nombre: $translate.instant('MARZO')
          },
          {
            Id: 4,
            Nombre: $translate.instant('ABRIL')
          },
          {
            Id: 5,
            Nombre: $translate.instant('MAYO')
          },
          {
            Id: 6,
            Nombre: $translate.instant('JUNIO')
          },
          {
            Id: 7,
            Nombre: $translate.instant('JULIO')
          },
          {
            Id: 8,
            Nombre: $translate.instant('AGOSTO')
          },
          {
            Id: 9,
            Nombre: $translate.instant('SEPT')
          },
          {
            Id: 10,
            Nombre: $translate.instant('OCTU')
          },
          {
            Id: 11,
            Nombre: $translate.instant('NOV')
          },
          {
            Id: 12,
            Nombre: $translate.instant('DIC')
          }
          ];
        var getUnidades = function (num) {
            switch (num) {
                case 1: return 'PRIMERO';
                case 2: return 'SEGUNDO';
                case 3: return 'TERCERO';
                case 4: return 'CUARTO';
                case 5: return 'QUINTO';
                case 6: return 'SEXTO';
                case 7: return 'SEPTIMO';
                case 8: return 'OCTAVO';
                case 9: return 'NOVENO';
            }
            return '';
        };

        var getDecenas = function (numero) {
            var decena = Math.floor(numero / 10);
            var unidad = numero - (decena * 10);
            switch (decena) {
                case 0: return getUnidades(unidad);
                case 1: return 'DECIMO' + getUnidades(unidad);
                case 2: return 'VIGÉSIMO ' + getUnidades(unidad);
                case 3: return 'TRIGÉSIMO ' + getUnidades(unidad);
                case 4: return 'CUADRAGÉSIMO ' + getUnidades(unidad);
                case 5: return 'QUINCUAGÉSIMO ' + getUnidades(unidad);
                case 6: return 'SEXAGÉSIMO ' + getUnidades(unidad);
                case 7: return 'SEPTUAGÉSIMO ' + getUnidades(unidad);
                case 8: return 'OCTAGÉSIMO ' + getUnidades(unidad);
                case 9: return 'NONAGÉSIMO ' + getUnidades(unidad);
            }
            return '';
        };

        // Public API here
        return {
            fileToBase64: function (file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                        if ((encoded.length % 4) > 0) {
                            encoded += '='.repeat(4 - (encoded.length % 4));
                        }
                        resolve(encoded);
                    };
                    reader.onerror = error => reject(error);
                });
            },
            getBase64: async (file) => {
                var base64;
                await self.fileToBase64(file).then(data => {
                    base64 = data;
                    return null;
                });
                return base64;
            },
            base64ToArrayBuffer: function (base64) {
                var binary_string = $window.atob(base64.replace(/\s/g, ''));
                console.log(binary_string);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
            },
            FormatoNumero: function (amount, decimals) {

                amount += '';
                amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));
    
                decimals = decimals || 0;
    
                if (isNaN(amount) || amount === 0) {
                    return parseFloat(0).toFixed(decimals);
                }
    
                amount = '' + amount.toFixed(decimals);
    
                var amount_parts = amount.split('.'),
                    regexp = /(\d+)(\d{3})/;
    
                while (regexp.test(amount_parts[0])) {
                    amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
                }
    
                return amount_parts.join('.');
            },
            numeroALetras: function (numero) {
                if (numero === 0) {
                    return 'CERO ';
                } else {
                    return getDecenas(numero);
                }
            },
            nombreMes: function(mesNum){
                return meses[mesNum-1]
            },
            mesAnterior: function (mes, anio) {
                var mes_anterior;
                var anio_anterior;
                if(mes===1){
                    mes_anterior= 12;
                    anio_anterior=anio-1;
                }else{
                    mes_anterior= mes-1;
                    anio_anterior=anio;
                }
            }
        };
    });
