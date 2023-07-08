'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionOrdenadorCtrl
 * @description
 * # AprobacionOrdenadorCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionOrdenadorCtrl', function (token_service, $scope, $http, uiGridConstants, contratoRequest, $translate, documentoRequest, funcGen, gridApiService,  adminJbpmV2Request, cumplidosCrudRequest, cumplidosMidRequest, notificacionRequest) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.funcGen=funcGen;
    self.Documento = token_service.getAppPayload().documento;
    self.contratistas = [];
    self.dependencias_contratos = {};
    self.dependencia = {};
    self.validador = 1;

    self.offset = 0;

    self.mes = '';

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
    self.anios = [(self.d.getFullYear()), (self.d.getFullYear() + 1)];

    /*
      Función para obtener la imagen del escudo de la universidad
    */
    $http.get("scripts/models/imagen_ud.json")
      .then(function (response) {
        self.imagen = response.data;
      });

    /*
      Creación tabla que tendrá todos los contratistas relacionados al ordenador
    */
    self.gridOptions1 = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      rowHeight: 40,
      useExternalPagination: true,
      columnDefs: [
        {
          field: 'NombreDependencia',
          cellTemplate: tmpl,
          displayName: 'DEPENDENCIA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "18%"
        },
        {
          field: 'Rubro',
          cellTemplate: tmpl,
          displayName: 'RUBRO',//$translate.instant('NAME_TEACHER'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "8%"
        },
        {
          field: 'PagoMensual.DocumentoPersonaId',
          cellTemplate: tmpl,
          displayName: $translate.instant('DOCUMENTO'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "8%"
        },
        {
          field: 'NombrePersona',
          cellTemplate: tmpl,
          displayName: 'NOMBRE PERSONA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "20%"
        },

        {
          field: 'PagoMensual.NumeroContrato',
          cellTemplate: tmpl,
          cellRenderer: null,
          displayName: 'NUMERO CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "12%"
        },
        {
          field: 'PagoMensual.VigenciaContrato',
          cellTemplate: tmpl,
          displayName: 'VIGENCIA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "7%"
        },
        {
          field: 'PagoMensual.Mes',
          cellTemplate: tmpl,
          displayName: $translate.instant('MES_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "9%"
        },
        {
          field: 'PagoMensual.Ano',
          cellTemplate: tmpl,
          displayName: $translate.instant('ANO_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "9%"
        }
        ,
        {
          field: 'Acciones',
          displayName: $translate.instant('ACC'),
          cellTemplate: '<a type="button" title="Ver soportes" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionOrdenador.obtener_doc(row.entity.PagoMensual)" data-toggle="modal" data-target="#modal_ver_soportes"</a>&nbsp;' +
            ' <a type="button" title="Aprobar pago" type="button" class="fa fa-check fa-lg  faa-shake animated-hover"  ng-click="grid.appScope.aprobacionOrdenador.aprobarPago(row.entity.PagoMensual)">' +
            '<a type="button" title="Rechazar" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.aprobacionOrdenador.rechazarPago(row.entity.PagoMensual)"></a>',
          width: "7%"
        }
      ]
    };


    self.gridOptions1.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function (row) {


        self.solicitudes_seleccionadas = gridApi.selection.getSelectedRows();


      });


      self.gridApi = gridApiService.pagination(self.gridApi, self.obtener_informacion_ordenador, $scope);

    };

    $(document).ready(function () {
      $("form").keydown(function (e) {
        if (e.which == 8 || e.which == 46 || e.which == 13) {
          return false;
        }
      });
    });
    /*
      Función para consultar los datos del ordenador del contrato y los contratistas asociados a este
    */
    self.obtener_informacion_ordenador = function (offset, query) {
      //Petición para obtener la información del ordenador del contrato
      self.gridOptions1.data = [];
      self.contratistas = [];

      contratoRequest.get('ordenador', self.Documento).then(function (response) {

        self.ordenador = response.data.ordenador;

        //Petición para obtener el Id de la relación de acuerdo a los campos
        if (((self.dependencia) && Object.keys(self.dependencia).length === 0) || self.validador === 1) {

          cumplidosMidRequest.get('solicitudes_ordenador_contratistas/solicitudes/' + self.Documento, $.param({
            limit: self.gridOptions1.paginationPageSize,
            offset: offset,
            // query: typeof(query) === "string" ? query : query.join(",")
          }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset));
          self.offset = offset;

        }
        else {

          cumplidosMidRequest.get('solicitudes_ordenador_contratistas/solicitudes_dependencia/' + self.Documento + '/' + self.dependencia.ESFCODIGODEP, $.param({
            limit: self.gridOptions1.paginationPageSize,
            offset: offset,
            // query: typeof(query) === "string" ? query : query.join(",")
          }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset));

        }

      });
    };

    self.obtener_informacion_ordenador(self.offset);


    $scope.$watch('aprobacionOrdenador.dependencia', function (offset, query) {

      self.gridOptions1.data = [];
      self.contratistas = [];

      if (typeof self.dependencia === 'undefined') {

        cumplidosMidRequest.get('aprobacion_pago/solicitudes_ordenador_contratistas/' + self.Documento, $.param({
          limit: self.gridOptions1.paginationPageSize,
          offset: offset,
          // query: typeof(query) === "string" ? query : query.join(",")
        }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset));
        self.offset = offset;
        self.gridOptions1.paginationCurrentPage = 1;
        self.validador = 1;

      } else {


        if ((Object.keys(self.dependencia).length === 0)) {
          self.validador = 1;

        } else {

          self.gridApi = gridApiService.pagination(self.gridApi, cumplidosMidRequest.get('solicitudes_ordenador_contratistas/solicitudes_dependencia/' + self.Documento + '/' + self.dependencia.ESFCODIGODEP, $.param({
            limit: self.gridOptions1.paginationPageSize,
            offset: self.offset,
            // query: typeof(query) === "string" ? query : query.join(",")
          }, true)).then(gridApiService.paginationFunc(self.gridOptions1, self.offset)), $scope);
          self.gridOptions1.paginationCurrentPage = 1;
          self.validador = 0;
        }
      }

    }, true);

    self.enviar_notificacion=function (asunto,destinatario,mensaje,remitenteId) {
      notificacionRequest.enviarCorreo(asunto,{},[destinatario],'','',mensaje,remitenteId).then(function (response) {
        //console.log(response)
      }).catch(
        function (error) {
          //console.log(error)
        }
      )
    }

    self.aprobarPago = function (pago_mensual) {
      //console.log(pago_mensual);
      
      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
        .then(function (response) {
          self.aux_pago_mensual = pago_mensual;

          self.enviar_notificacion('[APROBADOS] Cumplido del '+self.aux_pago_mensual.Mes+' de '+self.aux_pago_mensual.Ano,self.aux_pago_mensual.DocumentoPersonaId,'Documentos del cumplido aprobados por ordenador ',self.Documento);
          notificacionRequest.borrarNotificaciones('ColaOrdenador',[self.aux_pago_mensual.DocumentoPersonaId])
          cumplidosCrudRequest.get('estado_pago_mensual', $.param({
            limit: 0,
            query: 'CodigoAbreviacion:AP'
          })).then(function (responseCod) {

            var sig_estado = responseCod.data.Data;
            self.aux_pago_mensual.EstadoPagoMensualId.Id = sig_estado[0].Id;

            var pago_mensual_auditoria = {
              Pago: {
                CargoResponsable: response.data.contrato.ordenador_gasto.rol_ordenador,
                EstadoPagoMensualId: { "Id": self.aux_pago_mensual.EstadoPagoMensualId.Id },
                FechaModificacion: new Date(),
                Mes: self.aux_pago_mensual.Mes,
                Ano: self.aux_pago_mensual.Ano,
                NumeroContrato: self.aux_pago_mensual.NumeroContrato,
                DocumentoPersonaId: self.aux_pago_mensual.DocumentoPersonaId,
                DocumentoResponsableId: self.Documento,
                VigenciaContrato: parseInt(response.data.contrato.vigencia)
              },
              CargoEjecutor: (response.data.contrato.ordenador_gasto.rol_ordenador).substring(0, 69),
              DocumentoEjecutor: self.Documento
            }

            cumplidosCrudRequest.put('pago_mensual', self.aux_pago_mensual.Id, pago_mensual_auditoria)
              .then(function (response) {
                swal(
                  'Pago aprobado',
                  'Se ha registrado la aprobación del pago por parte del ordenador',
                  'success'
                )
                self.obtener_informacion_ordenador(self.offset);
                self.gridApi.core.refresh();
              })//Fin promesa THEN

              //Manejo de excepciones
              .catch(function (response) {
                swal(
                  'Error',
                  'No se ha podido registrar la aprobación del pago',
                  'error'
                );
              });

          })
        });

    };

    self.rechazarPago = function (pago_mensual) {

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
        self.aux_pago_mensual = pago_mensual;

        self.enviar_notificacion('[RECHAZADOS] Cumplido del '+self.aux_pago_mensual.Mes+' de '+self.aux_pago_mensual.Ano,self.aux_pago_mensual.DocumentoPersonaId,'Documentos del cumplido rechazados por ordenador del gasto',self.Documento)
        notificacionRequest.borrarNotificaciones('ColaOrdenador',[self.aux_pago_mensual.DocumentoPersonaId])

        cumplidosCrudRequest.get('estado_pago_mensual', $.param({
          limit: 0,
          query: 'CodigoAbreviacion:RO'
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
              VigenciaContrato: parseInt(response.data.contrato.vigencia)
            },
            CargoEjecutor: (response.data.contrato.ordenador_gasto.rol_ordenador).substring(0, 69),
            DocumentoEjecutor: self.Documento
          }

          cumplidosCrudRequest.put('pago_mensual', self.aux_pago_mensual.Id, pago_mensual_auditoria)
            .then(function (response) {
              swal(
                'Pago rechazado',
                'Se ha registrado el rechazo del pago',
                'success'
              )
              self.obtener_informacion_ordenador(self.offset);
              self.gridApi.core.refresh();
            })//Fin promesa then
            .catch(function (response) {
              swal(
                'Error',
                'No se ha podido registrar el rechazo del pago',
                'error'
              );
            }); //Fin catch

        })
      });

    };

    self.aprobar_multiples_pagos = function () {
      swal({
        title: '¿Está seguro(a) de aprobar varias solicitudes a la vez?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then(function () {

        

        self.solicitudes_seleccionadas = self.gridApi.selection.getSelectedRows();
        //console.info(self.solicitudes_seleccionadas)
        self.busqueda_aprobar_documentos_nuxeo(self.solicitudes_seleccionadas);
        contratoRequest.get('contrato', self.solicitudes_seleccionadas[0].PagoMensual.NumeroContrato + '/' + self.solicitudes_seleccionadas[0].PagoMensual.VigenciaContrato).then(function (response) {
          var arreglo_aux = [];
          for (let i = 0; i < self.solicitudes_seleccionadas.length; i++) {
            arreglo_aux.push(self.solicitudes_seleccionadas[i].PagoMensual)
          }
          var pago_mensual_auditoria_masiva = {
            Pagos: arreglo_aux,
            CargoEjecutor: (response.data.contrato.ordenador_gasto.rol_ordenador).substring(0, 69),
            DocumentoEjecutor: self.Documento
          }
          cumplidosCrudRequest.post('tr_aprobacion_masiva_pagos', pago_mensual_auditoria_masiva).then(function(response_transaccion){
            if (response_transaccion.data.Data === 'OK') {
              swal(
                'Pagos Aprobados',
                'Se han aprobado los pagos de las solicitudes seleccionadas',
                'success'
              )
              self.obtener_informacion_ordenador(self.offset);
              self.gridApi.core.refresh();
              notificacionRequest.borrarNotificaciones('ColaOrdenador',["All"])
            }else {

              swal(
                'Error',
                'No se han podido aprobar los pagos de las solicitudes seleccionadas',
                'error'
              );
  
            }
          }).catch(function (response) { // en caso de nulos
            //if (response.data === 'OK'){
            swal(
              'Pagos Aprobados',
              'Se han aprobado los pagos de las solicitudes seleccionadas',
              'success'
            )
            self.obtener_informacion_ordenador(self.offset);
            self.gridApi.core.refresh();
          }



          );
        });

      });
    };

    self.busqueda_aprobar_documentos_nuxeo = function (filas) {
      // console.info(filas)
      // console.info(filas.length)
      for (var i = 0; i < filas.length; i++) {
        const fila = filas[i];
        // console.info(fila)
        var nombre_docs = fila.PagoMensual.VigenciaContrato + fila.PagoMensual.NumeroContrato + fila.PagoMensual.DocumentoPersonaId + fila.PagoMensual.Mes + fila.PagoMensual.Ano;
        // console.info(nombre_docs);

        documentoRequest.get('documento', $.param({
          query: "Nombre:" + nombre_docs + ",Activo:true",
          limit: 0
        })).then(function (response) {
          self.documentos = response.data;
          angular.forEach(self.documentos, function (value) {
            value.Metadatos = JSON.parse(value.Metadatos);
            //self.aprovacion_documentos_nuxeo(value.Enlace);
          });
        })
      }
    }


    self.obtener_doc= function (fila) {
      self.fila_sol_pago = fila;
      funcGen.obtener_doc(self.fila_sol_pago.Id).then(function (documentos) {
        self.documentos=documentos;
        console.log(self.documentos);
      }).catch(function (error) {
        console.log("error",error)
        self.documentos=undefined;
      })
    };

    /*
      Función para enviar un comentario en el soporte    */
    self.enviar_comentario = function (documento) {

      swal({
        title: '¿Está seguro(a) de enviar la observación?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then(function () {
        documento.Metadatos = JSON.stringify(documento.Metadatos);
        documentoRequest.put('documento', documento.Id, documento).
          then(function (response) {
            swal({
              title: 'Comentario guardado',
              text: 'Se ha guardado el comentario del documento',
              type: 'success',
              target: document.getElementById('modal_ver_soportes')
            });
            self.obtener_doc(self.fila_sol_pago);
            

          })

          //Manejo de error
          .catch(function (response) {

            swal({
              title: 'Error',
              text: 'No se ha podido guardar el comentario',
              type: 'error',
              target: document.getElementById('modal_ver_soportes')
            });

          });

      });
    };

    /*
      Función que obtiene las dependencias que se encuentran en argo
    */

    self.obtenerDependenciasContratos = function () {

      //Petición para obtener el Id de la relación de acuerdo a los campos
      //console.info(self.Documento)
      adminJbpmV2Request.get('dependencias_sic/' + self.Documento, '').
        then(function (response) {
          self.dependencias_contratos = response.data;
        });

    };


    self.obtenerDependenciasContratos();

  });
