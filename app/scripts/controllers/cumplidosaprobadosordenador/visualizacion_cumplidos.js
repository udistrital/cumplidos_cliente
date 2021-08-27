'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:VisualizarCumplidosCtrl
 * @description
 * #VisualizarCumplidosCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('VisualizarCumplidosCtrl', function (token_service, cookie, $sessionStorage, $scope, $http, $translate, uiGridConstants, contratoRequest, nuxeo, $q, documentoRequest, $window, $sce, adminMidRequest, $routeParams, wso2GeneralService, amazonAdministrativaRequest, nuxeoMidRequest, cumplidosMidRequest, cumplidosCrudRequest) {
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    var self= this;
    //Variable que contiene los años para la vigencia
    self.anios_vigencia= []
    //Variable que contiene los años para los cumplidos
    self.anios_cumplidos= []
    //Variable que contiene los meses del año del cumplido
    self.meses= []
    //Variable que contiene la fecha actual
    self.hoy = new Date();

    //valores iniciales para los parametros de busqueda
    self.DocContratista=null;
    self.NumContrato=null;
    self.vigencia=null;
    self.anio=null;
    self.mes=null;

    self.sinDocumentos=false;

    //Arreglo de JSON que tiene los meses
    self.meses_aux = [{
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
  
    /*
      Función que permite inicializar los arreglos para filtrar por anio
    */
    self.inicializarAños = function () {
        //Arreglo que contiene los años de los cuales se pueden ver cumplidos
        for (let index = 3; index >= 0; index--) {
            self.anios_vigencia.push(self.hoy.getFullYear()-index)
            self.anios_cumplidos.push(self.hoy.getFullYear()-index)
        }

    };
    /*
      Función que permite inicializar el arreglo de meses
    */
    self.inicializarMeses = function () {
        self.meses_aux.forEach((mes)=>{
          self.meses.push(mes)
        })

    };
    /*
      Función que permite actualizar los años de los cumplidos, segun el año de vigencia
    */
    self.getAniosCumplidos = function (anio_vigencia) {
        self.anios_cumplidos=[]
        if(anio_vigencia==null)anio_vigencia=self.hoy.getFullYear()-4;
        var diff=self.hoy.getFullYear()-anio_vigencia
        //Arreglo que contiene los años de los cuales se pueden ver cumplidos
        for (let index = diff; index >= 0; index--) {
            self.anios_cumplidos.push(self.hoy.getFullYear()-index)
        }
    };
    /*
      Función que visualiza los meses de acuerdo al año seleccionado
    */
    self.getMeses = function (anio) {
        if (anio < self.hoy.getFullYear()) {
          self.meses = self.meses_aux;
        } else if (anio == self.hoy.getFullYear()) {
          self.meses = self.meses_aux.slice(0, self.hoy.getMonth() + 1);
        }
    };

    /*
      Creación tabla que tendrá todos los cumplidos aprobados
    */
      self.gridOptions = {
        enableSorting: true,
        enableFiltering: false,
        paginationPageSizes: [10,25, 50],
        paginationPageSize: 10,
        resizable: true,
        isScrollingHorizontally:false,
        enableHorizontalScrollbar: 0,
        columnDefs: [{
          field: 'NumeroContrato',
          //cellTemplate: tmpl,
          displayName: 'NUMERO CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "20%"
        },
        {
          field: 'VigenciaContrato',
          //cellTemplate: tmpl,
          displayName: 'VIGENCIA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "10%"
        },
        {
          field: 'DocumentoPersonaId',
          //cellTemplate: tmpl,
          displayName: 'DOCUMENTO CONTRATISTA',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "30%"
        },
        {
          field: 'Ano',
          //cellTemplate: tmpl,
          displayName: 'AÑO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "10%"
        },
        {
          field: 'mesNombre',
          //cellTemplate: tmpl,
          displayName: 'MES',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "20%"
        },
        {
          field: 'DOCUMENTOS',
          displayName: $translate.instant('ACC'),
          cellTemplate: '<a type="button" title="Ver soportes" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
          'style="margin: 0 auto; display:block; text-align: center" ng-click="grid.appScope.VisualizarCumplidos.obtener_doc(row.entity)" data-toggle="modal" data-target="#modal_ver_soportes"</a>',
          width: "10%"
        }
        ]
      };
      
      self.cargarCumplidos= function () {
          cumplidosCrudRequest.get('pago_mensual',$.param({
              query:'EstadoPagoMensualId.Id:5',
              sortby:'FechaModificacion',
              order:'desc',
              limit:50,
          })).then(function (response) {
            if(response.status===200){
              self.agregarNombreMeses(response.data.Data)
              self.gridOptions.data=response.data.Data;
            }else{
              swal({
                title: 'Error',
                text: 'Ocurrio un error al solicitar los registros',
                type: 'error',
              });
            }
          }, function (error) {
            swal({
              title: 'Error',
              text: 'Ocurrio un error al solicitar los registros',
              type: 'error',
            });
          })
      }

      self.construirQuery=function () {
          var query='EstadoPagoMensualId.Id:5';
          if(self.DocContratista!=null && self.DocContratista!='')query+=',DocumentoPersonaId:'+self.DocContratista;
          if(self.NumContrato!=null && self.NumContrato!='')query+=',NumeroContrato:'+self.NumContrato;
          if(self.vigencia!=null)query+=',VigenciaContrato:'+self.vigencia;
          if(self.anio!=null)query+=',Ano:'+self.anio;
          if(self.mes!=null)query+=',Mes:'+self.mes;
          return query;
      }

      self.buscarCumplidos=function () {
        if((self.DocContratista==null || self.DocContratista=='') && (self.NumContrato==null || self.NumContrato=='') && self.vigencia==null && self.anio==null && self.mes==null){
          swal({
            title: 'Error',
            text: 'No se ingreso informacion para la busqueda',
            type: 'error',
          });
        }else{
          var query=self.construirQuery();
          cumplidosCrudRequest.get('pago_mensual',$.param({
          limit: 0,
          query: query,
          sortby:'Ano,Mes',
          order:'desc,desc',
          })).then(function (response) {
            if(Object.keys(response.data.Data[0]).length === 0 ){
              swal({
                title: '',
                text: 'No se encontraron cumplidos asociados a los valores de busqueda',
                type: 'warning',
              });
            }else{
              self.agregarNombreMeses(response.data.Data)
              self.gridOptions.data=response.data.Data;
            }
          }, function (error) {
            swal({
              title: 'Error',
              text: 'Ocurrio un error al solicitar los registros',
              type: 'error',
            });
          })
        }
      }

      self.obtener_doc = function (fila) {
        self.filaCumplido = fila;
        self.tituloCumplidos='Soportes Contrato '+self.filaCumplido.NumeroContrato+' de '+self.filaCumplido.mesNombre+' del '+self.filaCumplido.Ano;
        var nombre_docs = self.filaCumplido.VigenciaContrato + self.filaCumplido.NumeroContrato + self.filaCumplido.DocumentoPersonaId + self.filaCumplido.Mes + self.filaCumplido.Ano;
        documentoRequest.get('documento', $.param({
          query: "Nombre:" + nombre_docs + ",Activo:true",
          limit: 0
        })).then(function (response) {
          self.documentos = response.data;
          if(Object.keys(response.data[0]).length === 0 ){
            self.sinDocumentos=true;
          }else{
            self.sinDocumentos=false;
            angular.forEach(self.documentos, function (value) {
              self.descripcion_doc = value.Descripcion;
              value.Metadatos = JSON.parse(value.Metadatos);
            });
          } 
        }, function (error) {
          swal({
            title: 'Error',
            text: 'Ocurrio un error al solicitar los documentos',
            type: 'error',
          });
        })
      };

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
          }, function (error) {
            swal({
              title: 'Error',
              text: 'Ocurrio un error al solicitar el documento',
              type: 'error',
            });
          });
        }, function (error) {
          swal({
            title: 'Error',
            text: 'Ocurrio un error al solicitar el documento',
            type: 'error',
          });
        });
      };

      self.agregarNombreMeses=function (data) {
        var data_modificada=data.map((cumplido)=>{
          cumplido.mesNombre=self.meses_aux[cumplido.Mes-1].Nombre;
        })
        return data_modificada;
      }


      self.inicializarAños()
      self.inicializarMeses()
      self.cargarCumplidos()
  })
