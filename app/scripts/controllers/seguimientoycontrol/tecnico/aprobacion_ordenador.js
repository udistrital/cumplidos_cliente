'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionOrdenadorCtrl
 * @description
 * # AprobacionOrdenadorCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionOrdenadorCtrl', function (token_service, cookie, $sessionStorage, $scope, oikosRequest, $http, uiGridConstants, contratoRequest, $translate, wso2GeneralService, administrativaRequest, $routeParams, adminMidRequest, coreRequest, nuxeo, $q, $sce, $window, gridApiService) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.Documento = token_service.getPayload().documento;
    self.contratistas = [];
    self.dependencias_contratos = {};
    self.dependencia = {};
    self.validador =  1;

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
          field: 'PagoMensual.Persona',
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

    $(document).ready(function() {
      $("form").keydown(function(e) {
          if (e.which == 8 || e.which == 46 || e.which == 13) {
              return false;
          }
      });
    });
    /*
      Función para consultar los datos del ordenador del contrato y los contratistas asociados a este
    */
    self.obtener_informacion_ordenador = function (offset,query) {
      //Petición para obtener la información del ordenador del contrato
      self.gridOptions1.data = [];
      self.contratistas = [];

      contratoRequest.get('ordenador', self.Documento).then(function (response) {

        self.ordenador = response.data.ordenador;
      
        //Petición para obtener el Id de la relación de acuerdo a los campos
        if (((self.dependencia) && Object.keys(self.dependencia).length === 0)  || self.validador === 1) {

            adminMidRequest.get('aprobacion_pago/solicitudes_ordenador_contratistas/' + self.Documento, $.param({
            limit: self.gridOptions1.paginationPageSize,
            offset: offset,
            // query: typeof(query) === "string" ? query : query.join(",")
             }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset));
            self.offset=offset;
            
        }
       else{ 

            adminMidRequest.get('aprobacion_pago/solicitudes_ordenador_contratistas_dependencia/' + self.Documento + '/' + self.dependencia.ESFCODIGODEP, $.param({
                limit: self.gridOptions1.paginationPageSize,
                offset: offset,
                // query: typeof(query) === "string" ? query : query.join(",")
            }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset)); 
          
        }

      });
    };

    self.obtener_informacion_ordenador(self.offset);


    $scope.$watch('aprobacionOrdenador.dependencia', function(offset,query) {
        
        self.gridOptions1.data = [];
        self.contratistas = [];
        
        if (typeof self.dependencia === 'undefined') {

            adminMidRequest.get('aprobacion_pago/solicitudes_ordenador_contratistas/' + self.Documento, $.param({
            limit: self.gridOptions1.paginationPageSize,
            offset: offset,
            // query: typeof(query) === "string" ? query : query.join(",")
          }, true)).then(gridApiService.paginationFunc(self.gridOptions1, offset));
            self.offset=offset;
            self.gridOptions1.paginationCurrentPage=1;
            self.validador = 1;
            
        } else{


            if ((Object.keys(self.dependencia).length === 0)){
                   self.validador=1; 

            }else{

               self.gridApi = gridApiService.pagination(self.gridApi,adminMidRequest.get('aprobacion_pago/solicitudes_ordenador_contratistas_dependencia/' + self.Documento + '/' + self.dependencia.ESFCODIGODEP, $.param({
                    limit: self.gridOptions1.paginationPageSize,
                    offset: self.offset,
                    // query: typeof(query) === "string" ? query : query.join(",")
                 }, true)).then(gridApiService.paginationFunc(self.gridOptions1, self.offset)), $scope); 
                  self.gridOptions1.paginationCurrentPage=1;
                  self.validador=0;              
            }
       }

    }, true);



    self.aprobarPago = function (pago_mensual) {

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
        .then(function (response) {
          self.aux_pago_mensual = pago_mensual;


          administrativaRequest.get('estado_pago_mensual', $.param({
            limit: 0,
            query: 'CodigoAbreviacion:AP'
          })).then(function (responseCod) {

            var sig_estado = responseCod.data;
            self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;

            administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual)
              .then(function (response) {

                swal(
                  'Error',
                  'No se ha podido registrar la aprobación del pago',
                  'error'
                );
              })//Fin promesa THEN

              //Manejo de excepciones
              .catch(function (response) {
                swal(
                  'Pago aprobado',
                  'Se ha registrado la aprobación del pago por parte del ordenador',
                  'success'
                )
                self.obtener_informacion_ordenador(self.offset);
                self.gridApi.core.refresh();
              });

          })
        });

    };

    self.rechazarPago = function (pago_mensual) {

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato).then(function (response) {
        self.aux_pago_mensual = pago_mensual;


        administrativaRequest.get('estado_pago_mensual', $.param({
          limit: 0,
          query: 'CodigoAbreviacion:RP'
        })).then(function (responseCod) {

          var sig_estado = responseCod.data;
          self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;

          administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual)
            .then(function (response) {
              swal(
                'Error',
                'No se ha podido registrar el rechazo del pago',
                'error'
              );
            })//Fin promesa then
            .catch(function (response) {
              swal(
                'Pago rechazado',
                'Se ha registrado el rechazo del pago',
                'success'
              )
              self.obtener_informacion_ordenador(self.offset);
              self.gridApi.core.refresh();
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
        adminMidRequest.post('aprobacion_pago/aprobar_pagos', self.solicitudes_seleccionadas).then(function (response) {
          if (response.data === 'OK') {
            swal(
              'Pagos Aprobados',
              'Se han aprobado los pagos de las solicitudes seleccionadas',
              'success'
            )
            self.obtener_informacion_ordenador(self.offset);
            self.gridApi.core.refresh();


          } else {

            swal(
              'Error',
              'No se han podido aprobar los pagos de las solicitudes seleccionadas',
              'error'
            );

          }
        })
          .catch(function (response) { // en caso de nulos

            //if (response.data === 'OK'){
            swal(
              'Pagos Aprobados',
              'Se han aprobado los pagos de las solicitudes seleccionadas',
              'success'
            )
            self.obtener_informacion_ordenador(self.offset);
            self.gridApi.core.refresh();


            // }else{

            //   swal(
            //     'Error',
            //     'No se han podido aprobar los pagos de las solicitudes seleccionadas',
            //     'error'
            //   );

            // }
          }



          );
      });
    };


    /*
      Función para ver los soportes de los contratistas a cargo
    */
    self.obtener_doc = function (fila) {
      self.fila_sol_pago = fila;
      var nombre_docs = self.fila_sol_pago.VigenciaContrato + self.fila_sol_pago.NumeroContrato + self.fila_sol_pago.Persona + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;
      coreRequest.get('documento', $.param({
        query: "Nombre:" + nombre_docs + ",Activo:true",
        limit: 0
      })).then(function (response) {
        self.documentos = response.data;
        angular.forEach(self.documentos, function (value) {
          self.descripcion_doc = value.Descripcion;
          value.Contenido = JSON.parse(value.Contenido);
        });
      })
    };

    /*
      Función que permite obtener un documento de nuxeo por el Id
    */
    self.getDocumento = function (docid) {
      nuxeo.header('X-NXDocumentProperties', '*');

      self.obtenerDoc = function () {
        var defered = $q.defer();

        nuxeo.request('/id/' + docid)
          .get()
          .then(function (response) {
            self.doc = response;
            var aux = response.get('file:content');
            self.document = response;
            defered.resolve(response);
          })
          .catch(function (error) {
            defered.reject(error)
          });
        return defered.promise;
      };

      self.obtenerFetch = function (doc) {
        var defered = $q.defer();

        doc.fetchBlob()
          .then(function (res) {
            defered.resolve(res.blob());

          })
          .catch(function (error) {
            defered.reject(error)
          });
        return defered.promise;
      };

      self.obtenerDoc().then(function () {

        self.obtenerFetch(self.document).then(function (r) {
          self.blob = r;
          var fileURL = URL.createObjectURL(self.blob);
          self.content = $sce.trustAsResourceUrl(fileURL);
          $window.open(fileURL, 'Soporte', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900', true);
        });
      });
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
        documento.Contenido = JSON.stringify(documento.Contenido);
        coreRequest.put('documento', documento.Id, documento).
          then(function (response) {
            swal({
              title: 'Error',
              text: 'No se ha podido guardar el comentario',
              type: 'error',
              target: document.getElementById('modal_ver_soportes')
            });

          })

          //Manejo de error
          .catch(function (response) {

            swal({
              title: 'Comentario guardado',
              text: 'Se ha guardado el comentario del documento',
              type: 'success',
              target: document.getElementById('modal_ver_soportes')
            });
            self.obtener_doc(self.fila_sol_pago);

          });

      });
    };

    /*
      Función que obtiene las dependencias que se encuentran en argo
    */

    self.obtenerDependenciasContratos = function (){

        //Petición para obtener el Id de la relación de acuerdo a los campos
    adminMidRequest.get('aprobacion_pago/dependencias_sic/' + self.Documento).
          then(function (response) {
          self.dependencias_contratos= response.data;
      });
 
    };


    self.obtenerDependenciasContratos();

 });
