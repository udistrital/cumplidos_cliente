'use strict';

/**
 * @ngdoc service
 * @name cumplidosCrudService.cumplidosCrudRequest
 * @description
 * # cumplidosCrudRequest
 * Factory in the cumplidosCrudService.
 */
angular.module('utilsService', [])
    .factory('utils', function (  $translate,$window) {
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

        var Unidades = function (num) {
            switch (num) {
                case 1: return "Un";
                case 2: return "Dos";
                case 3: return "Tres";
                case 4: return "Cuatro";
                case 5: return "Cinco";
                case 6: return "Seis";
                case 7: return "Siete";
                case 8: return "Ocho";
                case 9: return "Nueve";
            }

            return "";
        };

        var Decenas= function (num) {

            var decena = Math.floor(num / 10);
            var unidad = num - (decena * 10);

            switch (decena) {
                case 1:
                    switch (unidad) {
                        case 0: return "Diez";
                        case 1: return "Once";
                        case 2: return "Doce";
                        case 3: return "Trece";
                        case 4: return "Catorce";
                        case 5: return "Quince";
                        default: return "Dieci" + Unidades(unidad);
                    }
                case 2:
                    switch (unidad) {
                        case 0: return "Veinte";
                        default: return "Veinti" + Unidades(unidad);
                    }
                case 3: return DecenasY("Treinta", unidad);
                case 4: return DecenasY("Cuarenta", unidad);
                case 5: return DecenasY("Cincuenta", unidad);
                case 6: return DecenasY("Sesenta", unidad);
                case 7: return DecenasY("Setenta", unidad);
                case 8: return DecenasY("Ochenta", unidad);
                case 9: return DecenasY("Noventa", unidad);
                case 0: return Unidades(unidad);
            }
        };

        var DecenasY=function (strSin, numUnidades) {
            if (numUnidades > 0)
                return strSin + " Y " + Unidades(numUnidades)

            return strSin;
        };

        var Centenas=function (num) {
            var centenas = Math.floor(num / 100);
            var decenas = num - (centenas * 100);

            switch (centenas) {
                case 1:
                    if (decenas > 0)
                        return "Ciento " + Decenas(decenas);
                    return "Cien";
                case 2: return "Doscientos " + Decenas(decenas);
                case 3: return "Trescientos " + Decenas(decenas);
                case 4: return "Cuatroscientos " + Decenas(decenas);
                case 5: return "Quinientos " + Decenas(decenas);
                case 6: return "Seiscientos" + Decenas(decenas);
                case 7: return "Setecientos " + Decenas(decenas);
                case 8: return "Ochocientos " + Decenas(decenas);
                case 9: return "Novecientos " + Decenas(decenas);
            }

            return Decenas(decenas);
        };

        var Seccion= function (num, divisor, strSingular, strPlural) {
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)
            var letras = "";
            if (cientos > 0)
                if (cientos > 1)
                    letras = Centenas(cientos) + " " + strPlural;
                else
                    letras = strSingular;
            if (resto > 0)
                letras += "";
            return letras;
        };

        var Miles=function (num) {
            var divisor = 1000;
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)

            var strMiles = Seccion(num, divisor, "Un Mil", "Mil");
            var strCentenas = Centenas(resto);

            if (strMiles == "")
                return strCentenas;

            return strMiles + " " + strCentenas;
        };

        var Millones= function(num) {
            var divisor = 1000000;
            var cientos = Math.floor(num / divisor)
            var resto = num - (cientos * divisor)

            var strMillones = Seccion(num, divisor, "Un Millón ", "Millones ");
            var strMiles = Miles(resto);

            if (strMillones == "")
                return strMiles;

            return strMillones + " " + strMiles;
        };

        // Public API here
        return {
            getBase64: function (file) {
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
            base64ToArrayBuffer: function (base64) {
                var binary_string = $window.atob(base64.replace(/\s/g, ''));
                //console.log(binary_string);
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
            numeroALetras: function (num) {
                var data = {
                    numero: num,
                    enteros: Math.floor(num),
                    centavos: ((Math.round(num * 100)) - (Math.floor(num) * 100)),
                    letrasCentavos: "",
                    letrasMonedaPlural: 'Pesos',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
                    letrasMonedaSingular: 'Peso', //“PESO”, 'Dólar', 'Bolivar', 'etc'

                    letrasMonedaCentavoPlural: "Centavos",
                    letrasMonedaCentavoSingular: "Centavo"
                };

                if (data.centavos > 0) {
                    data.letrasCentavos = "Con " + (function () {
                        if (data.centavos == 1)
                            return Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
                        else
                            return Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
                    })();
                }

                if (data.enteros == 0)
                    return "Cero " + data.letrasMonedaPlural + " " + data.letrasCentavos;
                if (data.enteros == 1)
                    return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
                else
                    return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
            },
            nombreMes: function(mesNum){
                return meses[mesNum-1]
            },
            mesAnterior: function (mes, anio) {
                mes= parseInt(mes)
                anio=parseInt(anio)
                var mes_anterior;
                var anio_anterior;
                if(mes===1){
                    mes_anterior= 12;
                    anio_anterior=anio-1;
                }else{
                    mes_anterior= mes-1;
                    anio_anterior=anio;
                }
                return this.nombreMes(mes_anterior).Nombre+' del '+anio_anterior
            },
            formatoNumero: function(number, decimals, dec_point, thousands_point) {
                if( typeof number=='number'){
                    number=number.toString();
                }

                if (number == null || !isFinite(number)) {
                    throw new TypeError("number is not valid");
                }

                if (!decimals) {
                    var len = number.toString().split('.').length;
                    decimals = len > 1 ? len : 0;
                }

                if (!dec_point) {
                    dec_point = '.';
                }

                if (!thousands_point) {
                    thousands_point = ',';
                }

                number = parseFloat(number).toFixed(decimals);

                number = number.replace(".", dec_point);

                var splitNum = number.split(dec_point);
                splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
                number = splitNum.join(dec_point);

                number='$'+number

                return number;
            },
            diferenciaFechasDias(fechaInicio, fechaFin){
                fechaFin.setHours(12);
                fechaInicio.setHours(12);
                var diff= fechaFin.getTime()-fechaInicio.getTime()
                return diff/(1000*60*60*24)
            },
            formatoFecha(fecha){
                var anio = fecha.getFullYear();
                var mes = fecha.getMonth()+1;
                var dia = fecha.getDate();
                var ff='del '+dia+' de '+this.nombreMes(mes).Nombre+ ' de '+anio;
                return ff
            },
            ajustarFecha(stringFecha){
                return stringFecha.slice(0,10)+'T12:00:00Z'
            },
            getMeses(){
                return meses
            }
        };
    });
