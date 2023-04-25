'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:ReversionAprobadosCtrl
 * @description
 * # ReversionAprobadosCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('ReversionAprobadosCtrl', function (token_service, funcGen, $translate, uiGridConstants, contratoRequest,  utils, notificacionRequest, cumplidosMidRequest, cumplidosCrudRequest) {
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    var self = this;
    //Obtener la cedula del ordenador
    self.funcGen=funcGen;
    self.NumDocumentoOrdenador = token_service.getAppPayload().documento;

    self.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
      if( col.filters[0].term ){
        return 'header-filtered';
      } else {
        return '';
      }
    };

    self.gridOptions = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: false,
      enableFiltering: true,
      enableColumnMenus: false,
      resizable: false,
      useExternalPagination: false,
      onRegisterApi: function(gridApi){
        self.gridApi = gridApi;
      },
      columnDefs: [
        {
          field: 'NombreDependencia',
          displayName: 'DEPENDENCIA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "*"
        },
        {
          field: 'Rubro',
          displayName: 'RUBRO',//$translate.instant('NAME_TEACHER'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "10%"
        },
        {
          field: 'PagoMensual.DocumentoPersonaId',
          displayName: $translate.instant('DOCUMENTO'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "8%"
        },
        {
          field: 'NombrePersona',
          displayName: 'NOMBRE PERSONA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "*"
        },

        {
          field: 'PagoMensual.NumeroContrato',
          displayName: 'NUMERO CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "10%"
        },
        {
          field: 'PagoMensual.VigenciaContrato',
          displayName: 'VIGENCIA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "8%"
        },
        {
          field: 'PagoMensual.Mes',
          displayName: $translate.instant('MES_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "6%"
        },
        {
          field: 'PagoMensual.FechaModificacion',
          displayName: $translate.instant('FECHA_APROBACION'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "10%"
        },
        {
          field: 'PagoMensual.Ano',
          displayName: $translate.instant('ANO_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "8%"
        }
        ,
        {
          field: 'Acciones',
          displayName: $translate.instant('ACC'),
          enableFiltering: false,
          cellTemplate: '<a type="button" title="Ver soportes" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.ReversionAprobados.obtener_doc(row.entity.PagoMensual)" data-toggle="modal" data-target="#modal_ver_soportes"</a>&nbsp;' +
            '<a type="button" title="Revertir" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
            'ng-click="grid.appScope.ReversionAprobados.revertirAprobado(row.entity.PagoMensual)"></a>',
          width: "6%"
        }
      ]
    };

    /*
      Función que permite optener los cumplidos aprobados por el ordenador
    */
    self.getCumplidosAprobadosPorOrdenador = function () {
      var doc_ord = '19400342';
      cumplidosMidRequest.get('solicitudes_ordenador_contratistas/cumplidos_revertibles/' + doc_ord).then(function (response) {
        console.log(response)
        var cumplidos_aprobados=response.data.Data;
        for (let index = 0; index < cumplidos_aprobados.length; index++) {
          cumplidos_aprobados[index].PagoMensual.FechaModificacion=cumplidos_aprobados[index].PagoMensual.FechaModificacion.split('T')[0];
          cumplidos_aprobados[index].PagoMensual.Mes=utils.nombreMes(cumplidos_aprobados[index].PagoMensual.Mes).Nombre
        }
        self.gridOptions.data = cumplidos_aprobados;
      }).catch(function(error){
        swal(
          'Error',
          'Ocurrio un error al traer los registros',
          'error'
        )
      })
    };

    /* 
      Función para revertir un cumplido
    */
    self.revertirAprobado= function(pago_mensual){
      swal({
        title: '¿Está seguro(a) de revertir el cumplido?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then(function () {
        contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
          self.aux_pago_mensual = pago_mensual;
  
          self.enviar_notificacion('[RECHAZADOS] Cumplido del '+self.aux_pago_mensual.Mes+' de '+self.aux_pago_mensual.Ano,self.aux_pago_mensual.DocumentoPersonaId,'Documentos del cumplido rechazados por ordenador del gasto',self.NumDocumentoOrdenador)
  
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
              DocumentoEjecutor: self.NumDocumentoOrdenador
            }
  
            cumplidosCrudRequest.put('pago_mensual', self.aux_pago_mensual.Id, pago_mensual_auditoria)
              .then(function (response) {
                swal(
                  'Pago revertido',
                  'Se ha registrado la reversión del pago',
                  'success'
                )
                self.getCumplidosAprobadosPorOrdenador();
                self.gridApi.core.refresh();
              })//Fin promesa then
              .catch(function (response) {
                console.log(response)
                swal(
                  'Error',
                  'No se ha podido registrar la reversion del pago',
                  'error'
                );
              }); //Fin catch
  
          })
        });
      }).catch(function() {
        console.log("cancelar")
      })
    };

    /*
    Función que permite enviar notificacion por correo
    */
    self.enviar_notificacion=function (asunto,destinatario,mensaje,remitenteId) {
      notificacionRequest.enviarCorreo(asunto,{},[destinatario],'','',mensaje,remitenteId).then(function (response) {
        //console.log(response)
      }).catch(
        function (error) {
          //console.log(error)
        }
      )
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
    
    }


    self.getCumplidosAprobadosPorOrdenador();

    

  });