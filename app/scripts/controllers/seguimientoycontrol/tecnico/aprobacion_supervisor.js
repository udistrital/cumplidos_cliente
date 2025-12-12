'use strict';
/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionSupervisorCtrl
 * @description
 * # AprobacionSupervisorCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionSupervisorCtrl', function (
    token_service,
    $http,
    $translate,
    uiGridConstants,
    contratoRequest,
    funcGen,
    documentoRequest,
    $window,
    utils,
    notificacionRequest,
    amazonAdministrativaRequest,
    cumplidosMidRequest,
    cumplidosCrudRequest
  ) {

    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';
    var self = this;
    self.funcGen = funcGen;
    self.Documento = token_service.getAppPayload().documento;
    self.objeto_docente = [];
    self.nombres_docentes_incumplidos = '';
    self.mes = {};
    self.dependencias_supervisor = {};

    self.meses = [{
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

    self.d = new Date();
    self.anios = [(self.d.getFullYear() - 1), (self.d.getFullYear())];

    $http.get("scripts/models/imagen_ud.json")
      .then(function (response) {
        self.imagen = response.data;
      });

    self.clasificarContratosPorCDP = function () {

      if (!self.documentos || self.documentos.length === 0) return;

      let contratos = _.groupBy(self.documentos, function (doc) {
        return doc.PagoMensual.NumeroContrato;
      });

      angular.forEach(contratos, function (items) {

        items.forEach(function (item) {

          let cdpInicial = parseInt(item.NumeroCdp);
          let cdpPago = parseInt(item.PagoMensual.NumeroCDP);

          if (cdpInicial === cdpPago) {
            item.TipoContrato = "INICIAL";
            item.NumeroOtrosi = 0;
          } else {
            item.TipoContrato = "OTRO SI";
            item.NumeroOtrosi = 1;
          }

        });

      });

      if (self.gridApi && self.gridApi.core) {
        self.gridApi.core.refresh();
      }
    };

    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      rowHeight: 40,
      columnDefs: [
        {
          field: 'NombreDependencia',
          cellTemplate: tmpl,
          displayName: 'DEPENDENCIA',
                    sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "15%"
        },
        {
          field: 'PagoMensual.DocumentoPersonaId',
          cellTemplate: tmpl,
          displayName: $translate.instant('DOCUMENTO'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "15%"
        },
        {
          field: 'NombrePersona',
          cellTemplate: tmpl,
          displayName: 'NOMBRE CONTRATISTA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.NumeroContrato',
          cellTemplate: tmpl,
          displayName: 'NUMERO CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.VigenciaContrato',
          cellTemplate: tmpl,
          displayName: 'VIGENCIA CONTRATO',
                    sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.NumeroCDP',
          cellTemplate: tmpl,
          displayName: 'CDP'
        },

        {
          field: 'TipoContrato',
          displayName: $translate.instant('TIPO_CONTRATO'),
          width: "8%",
          cellTemplate:
            '<div class="ui-grid-cell-contents tipo-contrato" ' +
            '     ng-class="{' +
            "       'tipo-inicial': row.entity.TipoContrato === 'INICIAL'," +
            "       'tipo-otrosi': row.entity.TipoContrato === 'OTRO SI'" +
            '     }">' +
            '<span ng-if="row.entity.TipoContrato === \'INICIAL\'">INICIAL</span>' +
            '<span ng-if="row.entity.TipoContrato === \'OTRO SI\'">OTRO SÍ {{row.entity.NumeroOtrosi}}</span>' +
            '</div>'
        },

        { field: 'PagoMensual.Mes', cellTemplate: tmpl, displayName: $translate.instant('MES_SOLICITUD') },
        { field: 'PagoMensual.Ano', cellTemplate: tmpl, displayName: $translate.instant('ANO_SOLICITUD') },

        {
          field: 'Acciones',
          displayName: $translate.instant('ACC'),
          width: "10%",
          cellTemplate:
            '<a class="fa fa-eye fa-lg faa-shake animated-hover" title="Ver soportes"' +
            'ng-click="grid.appScope.aprobacionSupervisor.obtener_doc(row.entity.PagoMensual)" data-toggle="modal" data-target="#modal_ver_soportes"></a>&nbsp;' +
            '<a class="fa fa-check fa-lg faa-shake animated-hover" title="Visto bueno"' +
            'ng-click="grid.appScope.aprobacionSupervisor.dar_visto_bueno(row.entity.PagoMensual)"></a>&nbsp;' +
            '<a class="fa fa-close fa-lg faa-shake animated-hover" title="Rechazar"' +
            'ng-click="grid.appScope.aprobacionSupervisor.rechazar(row.entity.PagoMensual)"></a>'
        }
      ]
    };

    self.gridOptions1.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
    };

    self.obtener_contratistas_supervisor = function () {
      self.gridOptions1.data = [];
      self.obtener_informacion_supervisor(self.Documento);

      cumplidosMidRequest.get('/solicitudes_supervisor_contratistas/' + self.Documento)
        .then(function (response) {
          self.documentos = response.data.Data;
          self.clasificarContratosPorCDP();
          self.gridOptions1.data = self.documentos;
          if (self.gridApi && self.gridApi.core) self.gridApi.core.refresh();
        });
    };

    self.obtener_informacion_supervisor = function (documento) {
      amazonAdministrativaRequest.get('informacion_proveedor', $.param({
        query: "NumDocumento:" + documento,
        limit: 0
      })).then(function (response) {
        self.info_supervisor = response.data;
        self.nombre_supervisor = self.info_supervisor[0].NomProveedor;
      });
    };

    self.obtener_contratistas_supervisor();

    self.enviar_notificacion = function (asunto, destinatario, mensaje, remitenteId) {
      notificacionRequest.enviarCorreo(asunto, {}, [destinatario], '', '', mensaje, remitenteId)
    };

    self.dar_visto_bueno = function (pago_mensual) {

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
        .then(function (response) {

          self.aux_pago_mensual = pago_mensual;
          self.contrato = response.data.contrato;

          self.enviar_notificacion(
            '[APROBADOS] Cumplido del ' + self.aux_pago_mensual.Mes + ' de ' + self.aux_pago_mensual.Ano,
            self.aux_pago_mensual.DocumentoPersonaId,
            'Documentos del cumplido aprobados por supervisor',
            self.Documento
          );

          notificacionRequest.enviarNotificacion(
            'Cumplido pendientes por aprobacion',
            'ColaOrdenador',
            '/seguimientoycontrol/tecnico/aprobacion_ordenador'
          );

          notificacionRequest.borrarNotificaciones('ColaSupervisor', [self.aux_pago_mensual.DocumentoPersonaId]);

          cumplidosMidRequest.get(
            'solicitudes_ordenador_contratistas/informacion_ordenador/' +
            self.contrato.numero_contrato + '/' +
            pago_mensual.VigenciaContrato
          ).then(function (responseOrdenador) {

            self.ordenador = responseOrdenador.data.Data;
            self.aux_pago_mensual.DocumentoResponsableId = self.ordenador.NumeroDocumento.toString();
            self.aux_pago_mensual.CargoResponsable = self.ordenador.Cargo;

            cumplidosCrudRequest.get('estado_pago_mensual', $.param({
              limit: 0,
              query: 'CodigoAbreviacion:AS'
            })).then(function (responseCod) {

              var sig_estado = responseCod.data.Data;
              self.aux_pago_mensual.EstadoPagoMensualId.Id = sig_estado[0].Id;

              var pago_mensual_auditoria = {
                Pago: {
                  CargoResponsable: self.ordenador.Cargo,
                  EstadoPagoMensualId: { "Id": self.aux_pago_mensual.EstadoPagoMensualId.Id },
                  FechaModificacion: new Date(),
                  Mes: self.aux_pago_mensual.Mes,
                  Ano: self.aux_pago_mensual.Ano,
                  NumeroContrato: self.aux_pago_mensual.NumeroContrato,
                  DocumentoPersonaId: self.aux_pago_mensual.DocumentoPersonaId,
                  DocumentoResponsableId: self.ordenador.NumeroDocumento.toString(),
                  VigenciaContrato: parseInt(self.contrato.vigencia)
                },
                CargoEjecutor: ("SUPERVISOR: " + self.contrato.supervisor.cargo).substring(0, 69),
                DocumentoEjecutor: self.contrato.supervisor.documento_identificacion
              };

              cumplidosCrudRequest.put('pago_mensual', self.aux_pago_mensual.Id, pago_mensual_auditoria)
                .then(function () {
                  swal('Visto bueno', 'Tiene la validación del supervisor del contrato', 'success');
                  self.obtener_contratistas_supervisor();
                })
                .catch(function () {
                  swal('Error', 'No se ha podido registrar la validación del supervisor', 'error');
                });

            });
          });
        });
    };

    self.rechazar = function (pago_mensual) {

      self.aux_pago_mensual = pago_mensual;

      self.enviar_notificacion(
        '[RECHAZADOS] Cumplido del ' + self.aux_pago_mensual.Mes + ' de ' + self.aux_pago_mensual.Ano,
        self.aux_pago_mensual.DocumentoPersonaId,
        'Documentos del cumplido rechazados por supervisor',
        self.Documento
      );

      notificacionRequest.borrarNotificaciones('ColaSupervisor', [self.aux_pago_mensual.DocumentoPersonaId]);

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
        .then(function (response) {

          self.contrato = response.data.contrato;

          cumplidosMidRequest.get(
            'solicitudes_ordenador_contratistas/informacion_ordenador/' +
            self.contrato.numero_contrato + '/' +
            pago_mensual.VigenciaContrato
          ).then(function (responseOrdenador) {

            self.ordenador = responseOrdenador.data.Data;
            self.aux_pago_mensual.DocumentoResponsableId = self.ordenador.NumeroDocumento.toString();
            self.aux_pago_mensual.CargoResponsable = self.ordenador.Cargo;

            cumplidosCrudRequest.get('estado_pago_mensual', $.param({
              limit: 0,
              query: 'CodigoAbreviacion:RS'
            })).then(function (responseCod) {

              var sig_estado = responseCod.data.Data;
              self.aux_pago_mensual.EstadoPagoMensualId.Id = sig_estado[0].Id;

              var pago_mensual_auditoria = {
                Pago: {
                  CargoResponsable: "CONTRATISTA",
                  EstadoPagoMensualId: { "Id": self.aux_pago_mensual.EstadoPagoMensualId.Id },
                  FechaModificacion: new Date(),
                  Mes: self.aux_pago_mensual.Mes,
                  Ano: self.aux_pago_mensual.Ano,
                  NumeroContrato: self.aux_pago_mensual.NumeroContrato,
                  DocumentoPersonaId: self.aux_pago_mensual.DocumentoPersonaId,
                  DocumentoResponsableId: self.aux_pago_mensual.DocumentoPersonaId,
                  VigenciaContrato: parseInt(self.contrato.vigencia)
                },
                CargoEjecutor: ("SUPERVISOR: " + self.contrato.supervisor.cargo).substring(0, 69),
                DocumentoEjecutor: self.contrato.supervisor.documento_identificacion
              };

              cumplidosCrudRequest.put('pago_mensual', self.aux_pago_mensual.Id, pago_mensual_auditoria)
                .then(function () {
                  swal('Rechazo registrado', 'Se ha registrado el rechazo de los soportes', 'success');
                  self.obtener_contratistas_supervisor();
                })
                .catch(function () {
                  swal('Error', 'No se ha podido registrar el rechazo', 'error');
                });

            });
          });
        });
    };

    self.obtener_doc = function (fila) {
      self.fila_sol_pago = fila;
      funcGen.obtener_doc(self.fila_sol_pago.Id).then(function (documentos) {
        self.documentos = documentos;
      }).catch(function () {
        self.documentos = undefined;
      });
    };

    self.enviar_comentario = function (doc) {
      var metadatos = doc.Documento.Metadatos;
      var idDoc = doc.Documento.Id;

      documentoRequest.get('documento/' + idDoc, "").then(function (response) {

        var documentoPut = response.data;

        swal({
          title: '¿Está seguro(a) de enviar la observación?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar'
        }).then(function () {

          documentoPut.Metadatos = JSON.stringify(metadatos);

          documentoRequest.put('documento', idDoc, documentoPut)
            .then(function () {
              swal({
                title: 'Comentario guardado',
                text: 'Se ha guardado el comentario del documento',
                type: 'success',
              }).then(function () {
                self.obtener_doc(self.fila_sol_pago);
              });
            })
            .catch(function () {
              swal({
                title: 'Error',
                text: 'No se ha podido guardar el comentario',
                type: 'error'
              });
            });

        });

      }).catch(function () {
        swal({
          title: 'Error',
          text: 'No se ha podido obtener información del documento',
          type: 'error'
        });
      });

    };

    self.obtenerDependenciasSupervisor = function () {
      contratoRequest.get('dependencias_supervisor', self.Documento)
        .then(function (response) {
          self.dependencias_supervisor = response.data;
        });
    };
    self.obtenerDependenciasSupervisor();


    /*
      Función que genera el documento de quienes cumplieron con sus obligaciones
    */
    self.generarPDF = function () {

      if (self.mes == undefined || self.anio == undefined) {
        swal({
          title: 'Seleccione un mes y año',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        })
      } else {
        self.mes.Id = parseInt(self.mes.Id);

        if (self.mes.Id / 10 < 1) {

          self.mes.Id = '0' + self.mes.Id.toString();

        }
        cumplidosMidRequest.get('solicitudes_ordenador_contratistas/certificaciones/' + self.dependencia.codigo + '/' + self.mes.Id + '/' + self.anio).
          then(function (responseMid) {

            //console.log(responseMid.data[0]['Rubro']);
            self.docentes_incumplidos = responseMid.data.Data;


            // self.facultad = responseHom.data[0];

            var date = new Date()
            var mes = moment(date).format('M');
            var anio = moment(date).format('YYYY');

            var mes_ss = 0;
            var anio_ss = 0;

            if (self.mes.Id == '01') {
              mes_ss = 12;
              anio_ss = self.anio - 1;
            }
            else {
              mes_ss = self.mes.Id - 1;
              anio_ss = self.anio;
            }

            var contenidoInv = [];
            var contenidoFun = [];

            var tablaInv = {
              style: 'tableExample',
              table: {
                body: [
                  ['Documento', 'Nombre', 'Contrato', 'Cdp', 'Vigencia', 'Rubro']
                ]
              }
            }
            var tablaFun = {
              style: 'tableExample',
              table: {
                body: [
                  ['Documento', 'Nombre', 'Contrato', 'Cdp', 'Vigencia', 'Rubro']
                ]
              }
            }
            var inversion = [];
            var funcionamiento = [];

            angular.forEach(self.docentes_incumplidos, function (value) {
              if (value.Rubro == 'Inversión') {
                inversion.push(value);
              }
              else {
                funcionamiento.push(value);
              }
            });

            if (inversion.length > 0) {
              contenidoInv.push({ text: 'EL JEFE DE LA DEPENDENCIA ' + self.dependencia.nombre + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
              contenidoInv.push({ text: 'CERTIFICA QUE: ', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
              contenidoInv.push({ text: 'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato en el Mes de ' + self.mes.Nombre + ' de ' + self.anio + ' y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de ' + self.meses[mes_ss - 1].Nombre + ' de ' + anio_ss + '.', style: 'general_font' }, '\n\n')
              angular.forEach(inversion, function (valueInv) {
                tablaInv.table.body.push([valueInv.NumDocumento, valueInv.Nombre, valueInv.NumeroContrato, valueInv.NumeroCdp, valueInv.Vigencia, valueInv.Rubro]);
              });
              contenidoInv.push(tablaInv);
              contenidoInv.push('\n', { text: 'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes - 1].Nombre + ' de ' + anio + '.', style: 'general_font' }, '\n\n\n\n\n\n');
              contenidoInv.push({ text: '' + self.nombre_supervisor, style: 'bottom_space' });
              contenidoInv.push({ text: 'JEFE DE', style: 'bottom_space' });
              contenidoInv.push({ text: self.dependencia.nombre, style: 'bottom_space' });
              //contenido.push({pageBreak: 'after'});
            }
            if (funcionamiento.length > 0) {
              contenidoFun.push({ text: 'EL JEFE DE LA DEPENDENCIA ' + self.dependencia.nombre + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
              contenidoFun.push({ text: 'CERTIFICA QUE: ', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
              contenidoFun.push({ text: 'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato en el Mes de ' + self.mes.Nombre + ' de ' + self.anio + ' y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de ' + self.meses[mes_ss - 1].Nombre + ' de ' + anio_ss + '.', style: 'general_font' }, '\n\n')
              angular.forEach(funcionamiento, function (valueFun) {
                tablaFun.table.body.push([valueFun.NumDocumento, valueFun.Nombre, valueFun.NumeroContrato, valueFun.NumeroCdp, valueFun.Vigencia, valueFun.Rubro]);
              });
              contenidoFun.push(tablaFun);
              contenidoFun.push('\n', { text: 'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes - 1].Nombre + ' de ' + anio + '.', style: 'general_font' }, '\n\n\n\n\n\n');
              contenidoFun.push({ text: '' + self.nombre_supervisor, style: 'bottom_space' });
              contenidoFun.push({ text: 'JEFE DE', style: 'bottom_space' });
              contenidoFun.push({ text: self.dependencia.nombre, style: 'bottom_space' });

            }


            /*
                //console.log(self.contenido);
                contenido.push( {text:'EL JEFE DE LA DEPENDENCIA ' +  self.dependencia.nombre  + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                //console.log(self.contenido);
                contenido.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                if(self.docentes_incumplidos){
                contenido.push({text:'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
                  angular.forEach(self.docentes_incumplidos, function(value) {
                   tabla.table.body.push([ value.NumDocumento , value.Nombre, value.NumeroContrato , value.Vigencia, value.Rubro]);
                 });
                 contenido.push(tabla);
                }else{
                contenido.push({text:'Ninguno de los contratos de prestación de servicios bajo esta supervisión cumplió con las actividades del objeto establecido en el contrato o con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')


                }
                //contenido.push( );
                contenido.push('\n',{text:'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes-1].Nombre + ' de ' + anio +'.',  style:'general_font'}, '\n\n\n\n\n\n');
                contenido.push({text:'' + self.nombre_supervisor, style:'bottom_space'});
                contenido.push({text:'JEFE DE', style:'bottom_space'});
                contenido.push({text: self.dependencia.nombre , style:'bottom_space'});*/


            //Generación documento
            var docDefinitionInv = {
              footer: function (currentPage, pageCount) {
                var columns = [
                  {
                    text: 'Inversión ' + currentPage.toString() + ' de ' + pageCount,
                    width: 'auto',
                    alignment: 'right',
                    fontSize: 10,
                    margin: [5, 5, 15, 10],
                  }
                ]
                return columns;
              },
              pageMargins: [30, 140, 40, 40],
              header: {
                height: 120,
                width: 120,
                image: self.imagen.imagen,
                margin: [100, 15, 5, 5],
                alignment: 'center'
              },
              content: contenidoInv,
              styles: {
                top_space: {
                  fontSize: 11,
                  marginTop: 30
                },
                bottom_space: {
                  fontSize: 12,
                  bold: true,
                  alignment: 'center'
                  //marginBottom: 30
                },
                general_font: {
                  fontSize: 11,
                  alignment: 'justify'
                },
                lista: {
                  fontSize: 9,
                  alignment: 'justify'
                }
              }
            }
            var docDefinitionFun = {
              footer: function (currentPage, pageCount) {
                var columns = [
                  {
                    text: 'Funcionamiento ' + currentPage.toString() + ' de ' + pageCount,
                    width: 'auto',
                    alignment: 'right',
                    fontSize: 10,
                    margin: [5, 5, 15, 10],
                  }
                ]
                return columns;
              },
              pageMargins: [30, 140, 40, 40],
              header: {
                height: 120,
                width: 120,
                image: self.imagen.imagen,
                margin: [100, 15, 5, 5],
                alignment: 'center'
              },
              content: contenidoFun,
              styles: {
                top_space: {
                  fontSize: 11,
                  marginTop: 30
                },
                bottom_space: {
                  fontSize: 12,
                  bold: true,
                  alignment: 'center'
                  //marginBottom: 30
                },
                general_font: {
                  fontSize: 11,
                  alignment: 'justify'
                },
                lista: {
                  fontSize: 9,
                  alignment: 'justify'
                }
              }
            }

            //Variable para obtener la fecha y hora que se genera el dcoumento
            var date = new Date();
            date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');
            if (inversion.length > 0) {
              pdfMake.createPdf(docDefinitionInv).download('Certificación cumplido Inversión ' + date + '.pdf');
            }
            if (funcionamiento.length > 0) {
              pdfMake.createPdf(docDefinitionFun).download('Certificación cumplido Funcionamiento' + date + '.pdf');
            }

            //  pdfMake.createPdf(docDefinition).download('Certificación cumplido coordinación ' + date + '.pdf');
          }).catch(function (responseMid) {//nulos
            self.docentes_incumplidos = undefined;
            // self.facultad = responseHom.data[0];

            var date = new Date()
            var mes = moment(date).format('M');
            var anio = moment(date).format('YYYY');
            var contenido = [];
            var tabla = {
              style: 'tableExample',
              table: {
                body: [
                  ['Documento', 'Nombre', 'Contrato', 'Vigencia', 'Rubro']
                ]
              }
            }
            //console.log(self.contenido);
            contenido.push({ text: 'EL JEFE DE LA DEPENDENCIA ' + self.dependencia.nombre + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
            //console.log(self.contenido);
            contenido.push({ text: 'CERTIFICA QUE: ', bold: true, alignment: 'center', style: 'top_space' }, '\n\n\n\n');
            if (self.docentes_incumplidos) {
              contenido.push({ text: 'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de ' + self.mes.Nombre + ' de ' + self.anio + '.', style: 'general_font' }, '\n\n')
              angular.forEach(self.docentes_incumplidos, function (value) {
                tabla.table.body.push([value.NumDocumento, value.Nombre, value.NumeroContrato, value.Vigencia, value.Rubro]);
              });
              contenido.push(tabla);
            } else {
              contenido.push({ text: 'Ninguno de los contratos de prestación de servicios bajo esta supervisión cumplió con las actividades del objeto establecido en el contrato o con el pago reglamentario de los aportes al sistema de seguridad social del Mes de ' + self.mes.Nombre + ' de ' + self.anio + '.', style: 'general_font' }, '\n\n')


            }
            //contenido.push(  );
            contenido.push('\n', { text: 'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes - 1].Nombre + ' de ' + anio + '.', style: 'general_font' }, '\n\n\n\n\n\n');
            contenido.push({ text: '' + self.nombre_supervisor, style: 'bottom_space' });
            contenido.push({ text: 'JEFE DE', style: 'bottom_space' });
            contenido.push({ text: self.dependencia.nombre, style: 'bottom_space' });


            //Generación documento
            var docDefinition = {
              pageMargins: [30, 140, 40, 40],
              header: {
                height: 120,
                width: 120,
                image: self.imagen.imagen,
                margin: [100, 15, 5, 5],
                alignment: 'center'
              },
              content: contenido,
              styles: {
                top_space: {
                  fontSize: 11,
                  marginTop: 30
                },
                bottom_space: {
                  fontSize: 12,
                  bold: true,
                  alignment: 'center'
                  //marginBottom: 30
                },
                general_font: {
                  fontSize: 11,
                  alignment: 'justify'
                },
                lista: {
                  fontSize: 9,
                  alignment: 'justify'
                }
              }
            }

            //Variable para obtener la fecha y hora que se genera el dcoumento
            var date = new Date();
            date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');
            pdfMake.createPdf(docDefinition).download('Certificación cumplido ' + date + '.pdf');



            //  pdfMake.createPdf(docDefinition).download('Certificación cumplido coordinación ' + date + '.pdf');
          }



          );
      }
    };


  });
