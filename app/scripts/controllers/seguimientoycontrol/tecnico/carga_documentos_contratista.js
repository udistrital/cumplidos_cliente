'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CargaDocumentosContratistaCtrl
 * @description
 * #CargaDocumentosContratistaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('cargaDocumentosContratistaCtrl', function (token_service, cookie, $sessionStorage, $scope, $http, $translate, uiGridConstants, contratoRequest, nuxeo, $q, documentoRequest, $window, $sce, gestorDocumentalMidRequest, $routeParams, wso2GeneralService, amazonAdministrativaRequest, nuxeoMidRequest, cumplidosMidRequest, cumplidosCrudRequest) {

    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Permite que el modal tenga scrooll
    $('body').on('hidden.bs.modal', '.modal', function (e) {
      if ($('.modal').hasClass('in')) {
        $('body').addClass('modal-open');
      }
    });

    //Se utiliza la variable self estandarizada
    var self = this;
    self.existe = true;

    //Variable que indica el estado del boton cargar soporte
    self.mostrar_boton = true;

    //Número de documento que viene en el token
    self.Documento = token_service.getPayload().documento;

    //Variable que contiene los años de los cuales puede hacer la solicitud
    self.anios = [];

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

    //Variable que contiene la fecha actual
    self.hoy = new Date();

    /*
      Función que permite realizar una solicitud de pago mensual
    */
    self.solicitar_pago = function () {
      //Arreglo que contiene los años de los cuales puede hacer la solicitud
      self.anios = [self.hoy.getFullYear(), self.hoy.getFullYear() - 1];
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
      Creación tabla que tendrá todos los contratos relacionados al contratista
    */
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: false,
      resizable: true,
      columnDefs: [{
        field: 'NumeroContratoSuscrito',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUMERO_CONTRATO'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "15%"
      },
      {
        field: 'Vigencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'NumeroRp',
        cellTemplate: tmpl,
        displayName: $translate.instant('RP'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "15%"
      },
      {
        field: 'NumeroCdp',
        cellTemplate: tmpl,
        displayName: $translate.instant('CDP'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'NombreDependencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('DEPENDENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="CARGAR SOPORTES" type="button" class="fa fa-upload fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.solicitar_pago();grid.appScope.cargaDocumentosContratista.cargar_soportes(row.entity)"  data-toggle="modal" data-target="#modal_carga_listas_docente">',
        width: "10%"
      }
      ]
    };


    self.gridOptions1.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
    };

    /*
      Función para consultar los contratos asociados al contratista
    */
    self.obtener_informacion_contratos_contratista = function () {
      //Petición para obtener la información de los contratos del contratista
      self.gridOptions1.data = [];
      //Petición para obtener las contratos relacionados al contratista
      /*cumplidosMidRequest.get('contratos_contratista/' + self.Documento)
        .then(function (response) {
          response.data.Data=[
            {
                "NumeroContratoSuscrito": "1265",
                "Vigencia": "2021",
                "NumeroCdp": "1668",
                "VigenciaCdp": "2021",
                "NumeroRp": "4553",
                "VigenciaRp": "2021",
                "NombreDependencia": "OFICINA ASESORA DE SISTEMAS",
                "NumDocumentoSupervisor": "52204982"
            }
          ]
          if (response.data.Data) {
            //Contiene la respuesta de la petición
            self.informacion_contratos = response.data.Data;
            //Se envia la data a la tabla
            self.gridOptions1.data = self.informacion_contratos;
            //Contiene el numero de documento del Responsable
            self.responsable = self.informacion_contratos[0].NumDocumentoSupervisor;
          } else {
            swal(
              'Error',
              'No se encontraron contratos vigentes asociados a su número de documento',
              'error'
            )
          };
        });*/

      //Simulacion peticion exitosa
      var Data = [
        {
          "NumeroContratoSuscrito": "1265",
          "Vigencia": "2021",
          "NumeroCdp": "1668",
          "VigenciaCdp": "2021",
          "NumeroRp": "4553",
          "VigenciaRp": "2021",
          "NombreDependencia": "OFICINA ASESORA DE SISTEMAS",
          "NumDocumentoSupervisor": "52204982"
        }
      ];

      //Contiene la respuesta de la petición
      self.informacion_contratos = Data;
      //Se envia la data a la tabla
      self.gridOptions1.data = self.informacion_contratos;
      //Contiene el numero de documento del Responsable
      self.responsable = self.informacion_contratos[0].NumDocumentoSupervisor;
    };

    /*
      Función para consultar la informacion del contratista
    */
    self.obtener_informacion_contratista = function () {
      //Peticion que consulta la información del contratista, de acuerdo a su número de documento
      amazonAdministrativaRequest.get('informacion_proveedor', $.param({
        query: "NumDocumento:" + self.Documento,
        limit: 0
      })).then(function (response) {
        //Información contratista
        self.info_contratista = response.data;
        self.nombre_contratista = self.info_contratista[0].NomProveedor;
      })
    };

    //Ejecución función para obtener nombre contratista
    self.obtener_informacion_contratista();
    //Ejecución función para obtener contratos relacionados al contratista
    self.obtener_informacion_contratos_contratista();

    /*
      Creación tabla que tendrá las solicitudes de pago de cada contrato
    */
    self.gridOptions2 = {
      enableSorting: true,
      //enableFiltering: true,
      resizable: true,
      columnDefs: [{
        field: 'NumeroContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUMERO_CONTRATO'),
        //width:'*',
      },
      {
        field: 'VigenciaContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        //width:'*',
      },
      {
        field: 'Mes',
        cellTemplate: tmpl,
        displayName: $translate.instant('MES'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        //width:'*',
      },
      {
        field: 'Ano',
        cellTemplate: tmpl,
        displayName: $translate.instant('ANO'),
        //width:'*',
      },
      {
        field: 'EstadoPagoMensualId.Nombre',
        cellTemplate: tmpl,
        displayName: $translate.instant('EST_SOL'),
        //width:'*',
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'VER_SOP\'| translate }}" type="button" class="fa fa-folder-open-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.obtener_doc(row.entity)" data-toggle="modal" data-target="#modal_ver_soportes">' +
          '</a>&nbsp;' + '<a ng-if="row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'CD\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RS\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RP\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RO\'" type="button" title="ENVIAR A REVISION SUPERVISOR" type="button" class="fa fa-send-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.enviar_revision(row.entity)"  >',
        //width:'*'
      }
      ]
    };

    /*
      Función para generar la solicitud de pago
    */
    self.enviar_solicitud = function () {

      if (self.mes !== undefined && self.anio !== undefined) {
        //Petición para obtener id de estado pago mensual
        self.mostrar_boton = false;
        cumplidosCrudRequest.get('estado_pago_mensual', $.param({
          query: "CodigoAbreviacion:CD",
          limit: 0
        })).then(function (response) {
          //Variable que contiene el Id del estado pago mensual
          var id_estado = response.data.Data[0].Id;
          //Se arma elemento JSON para la solicitud

          var pago_mensual_auditoria = {
            Pago: {
              CargoResponsable: "CONTRATISTA",
              EstadoPagoMensualId: { Id: id_estado },
              FechaModificacion: new Date(),
              FechaCreacion: new Date(),
              Mes: self.mes,
              Ano: self.anio,
              Activo: true,
              NumeroContrato: self.contrato.NumeroContratoSuscrito,
              DocumentoPersonaId: self.Documento,
              DocumentoResponsableId: self.Documento,
              VigenciaContrato: parseInt(self.contrato.Vigencia)
            },
            CargoEjecutor: "CONTRATISTA",
            DocumentoEjecutor: self.Documento
          }


          ////console.log("Hizo el primero");
          cumplidosCrudRequest.get('pago_mensual', $.param({
            query: "NumeroContrato:" + self.contrato.NumeroContratoSuscrito +
              ",VigenciaContrato:" + self.contrato.Vigencia +
              ",Mes:" + self.mes +
              ",Ano:" + self.anio +
              ",DocumentoPersonaId:" + self.Documento,
            limit: 0
          })).then(function (responsePago) {

            if (Object.keys(responsePago.data.Data[0]).length === 0) {
              //no existe pago para ese mes y se crea 
              cumplidosCrudRequest.post("pago_mensual", pago_mensual_auditoria)
                .then(function (responsePagoPost) {

                  //console.log(responsePagoPost.data);
                  swal(
                    $translate.instant('SOLICITUD_REGISTRADA'),
                    $translate.instant('CARGUE_CORRESPONDIENTE'),
                    'success'
                  )

                  self.cargar_soportes(self.contrato);
                  //self.gridApi2.core.refresh();
                  //   self.contrato = {};
                  self.mes = undefined;
                  self.anio = undefined;
                  self.mostrar_boton = true;

                });

            } else {
              //SweetAlert si la solicitud ya esta creada
              swal(
                'Error',
                $translate.instant('YA_EXISTE'),
                'error'
              );

              self.mostrar_boton = true;
            }



          })
            //Si responde con un error 
            .catch(function (responsePago) {
              //console.error('Error 500 WSO2: ', responsePago.status, responsePago.data);

            });
          //Segundo get

        }); // Primer get
      } else {
        swal(
          'Error',
          'Debe seleccionar un mes y un año',
          'error'
        );
        self.mostrar_boton = true;

      }

    };

    /*
      Función para cargar los soportes
    */
    self.cargar_soportes = function (contrato) {

      self.seleccionado = false;
      self.gridOptions2.data = [];
      self.contrato = contrato;
      //self.obtener_informacion_coordinador(self.contrato.IdDependencia);
      cumplidosCrudRequest.get('pago_mensual', $.param({
        query: "NumeroContrato:" + self.contrato.NumeroContratoSuscrito + ",VigenciaContrato:" + self.contrato.Vigencia + ",DocumentoPersonaId:" + self.Documento,
        limit: 0
      })).then(function (response) {
        contratoRequest.get('contrato', self.contrato.NumeroContratoSuscrito + '/' + self.contrato.Vigencia)
          .then(function (response_ce) {

            self.tipo_contrato = response_ce.data.contrato.tipo_contrato;


            cumplidosCrudRequest.get("item_informe_tipo_contrato", $.param({
              query: "TipoContratoId:" + self.tipo_contrato,
              limit: 0
            })).then(function (response_iitc) {

              self.items = response_iitc.data.Data;
            });

          });

        self.gridOptions2.data = response.data.Data;

      })

        .catch(function (response) {

          contratoRequest.get('contrato', self.contrato.NumeroContratoSuscrito + '/' + self.contrato.Vigencia)
            .then(function (response_ce) {

              self.tipo_contrato = response_ce.data.contrato.tipo_contrato;


              cumplidosCrudRequest.get("item_informe_tipo_contrato", $.param({
                query: "TipoContratoId:" + self.tipo_contrato,
                limit: 0
              })).then(function (response_iitc) {

                self.items = response_iitc.data.Data;

              });

            });

          self.gridOptions2.data = response.data.Data;
        });
    };

    /*
      Enviar solicitud de revisión de soportes a Supervisor
    */
    self.enviar_revision = function (solicitud) {
      swal({
        title: '¿Está seguro(a) de enviar a revisar los soportes por el supervisor?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Enviar'
      }).then(function () {

        var nombre_docs = solicitud.VigenciaContrato + solicitud.NumeroContrato + solicitud.DocumentoPersonaId + solicitud.Mes + solicitud.Ano;

        contratoRequest.get('contrato', self.contrato.NumeroContratoSuscrito + '/' + self.contrato.Vigencia).then(function (response) {

          self.obtener_doc(solicitud);
          if (self.documentos) {

            cumplidosCrudRequest.get('estado_pago_mensual', $.param({
              limit: 0,
              query: 'CodigoAbreviacion:PRS'
            })).then(function (responseCod) {
              var sig_estado = responseCod.data.Data;
              var pago_mensual_auditoria = {
                Pago: {
                  CargoResponsable: ("SUPERVISOR: " + response.data.contrato.supervisor.cargo).substring(0, 69),
                  EstadoPagoMensualId: { "Id": sig_estado[0].Id },
                  FechaModificacion: new Date(),
                  Mes: solicitud.Mes,
                  Ano: solicitud.Ano,
                  NumeroContrato: self.contrato.NumeroContratoSuscrito,
                  DocumentoPersonaId: self.Documento,
                  DocumentoResponsableId: self.contrato.NumDocumentoSupervisor,
                  VigenciaContrato: parseInt(self.contrato.Vigencia)
                },
                CargoEjecutor: "CONTRATISTA",
                DocumentoEjecutor: self.Documento
              }

              cumplidosCrudRequest.put('pago_mensual', solicitud.Id, pago_mensual_auditoria).
                then(function (response) {
                  swal(
                    'Solicitud enviada',
                    'Su solicitud se encuentra a la espera de revisión',
                    'success'
                  )

                  self.cargar_soportes(self.contrato);
                  //self.documentos = {};
                })

                //Manejo de excepcion para el put
                .catch(function (response) {
                  swal(
                    'Error',
                    'No se ha podido enviar la solicitud de cumplido',
                    'error'
                  );
                });
            })
          } else {

            swal(
              'Error',
              'No puede enviar a revisión sin cargar algún documento',
              'error'
            )
          }

        });
      });
    };


    //
    /*
      Función para cargar los documentos a la carpeta  destino
    */
    self.cargarDocumento = function (nombre, descripcion, documento, callback) {
      var defered = $q.defer();
      var promise = defered.promise;

      nuxeo.operation('Document.Create')
        .params({
          type: 'File',
          name: nombre,
          properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
        })
        .input('/default-domain/workspaces/oas/oas_app/soportes_pagos')
        .execute()
        .then(function (doc) {
          var nuxeoBlob = new Nuxeo.Blob({
            content: documento
          });
          nuxeo.batchUpload()
            .upload(nuxeoBlob)
            .then(function (res) {
              return nuxeo.operation('Blob.AttachOnDocument')
                .param('document', doc.uid)
                .input(res.blob)
                .execute();
            })
            .then(function () {
              return nuxeo.repository().fetch(doc.uid, {
                schemas: ['dublincore', 'file']
              });
            })
            .then(function (doc) {
              var url = doc.uid;
              callback(url);
              defered.resolve(url);
            })
            .catch(function (error) {
              throw error;
            });
        })
        .catch(function (error) {
          throw error;
        });

      return promise;
    };


    /*
      Función que permite cargar un documentos
    */
    self.subir_documento = function () {
      //Se arma el nombre del documento
      var nombre_doc = self.contrato.Vigencia + self.contrato.NumeroContratoSuscrito + self.Documento + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;

      //Condicional del item y del file model
      if (self.fileModel !== undefined && self.item !== undefined && self.fileModel.type === 'application/pdf' && self.fileModel.size <= 1000000) {
        //console.log(self.fileModel);
        self.mostrar_boton = false;
        var descripcion = self.item.ItemInformeId.Nombre;

        //----------Inicio flujo antiguo para subir un documento------
        /*var aux = self.cargarDocumento(nombre_doc, descripcion, self.fileModel, function (url) {
          //Objeto documento
          var date = new Date();
          date = moment(date).format('DD_MMM_YYYY_HH:mm:ss');
          //var now = date
          self.Id_doc_nuxeo = url;
          self.objeto_documento = {
            "Nombre": nombre_doc,
            "Descripcion": descripcion,
            "TipoDocumento": {
              "Id": 19
            },
            "Enlace": url,
            "Metadatos": JSON.stringify({
              "NombreArchivo": self.fileModel.name,
              "Tipo": "Archivo",
              "Observaciones": self.observaciones
            }),
            "Activo": true
          };

          //Post a la tabla documento del   
          documentoRequest.post('documento', self.objeto_documento)
            .then(function (response) {
              console.log(response)
              self.id_documento = response.data.Id;

              //Objeto soporte_pago_mensual
              self.objeto_soporte = {
                "PagoMensualId": {
                  "Id": self.fila_sol_pago.Id
                },
                "Documento": self.id_documento,
                "ItemInformeTipoContratoId": {
                  "Id": self.item.Id
                },
                "Aprobado": false
              };

              // console.info(self.Id_doc_nuxeo);
              // inicio de flujo de documentos 
              nuxeoMidRequest.post('workflow?docID=' + self.Id_doc_nuxeo, null)
                .then(function (response) {
                  //Bandera de validacion
                });

              //Post a la tabla soporte documento
              cumplidosCrudRequest.post('soporte_pago_mensual', self.objeto_soporte)
                .then(function (response) {
                  //Bandera de validacion
                  swal({
                    title: 'Documento guardado',
                    text: 'Se ha guardado el documento en el repositorio',
                    type: 'success',
                    target: document.getElementById('modal_ver_soportes')
                  });

                  self.item = undefined;
                  self.fileModel = undefined;
                  $('#input-id').fileinput('clear');

                  self.mostrar_boton = true;
                  self.obtener_doc(self.fila_sol_pago);

                  //Limpieza Variable
                  self.observaciones = "";
                });
            });
        }
       
        
        
        );*/
        //----------Fin flujo antiguo para subir un documento------
        //console.log(self.fileModel);
        var fileBase64;
        self.getBase64(self.fileModel).then(
          function (base64) {
            fileBase64 = base64;
            console.log("prueba de obtencion del base64 del archivo:", fileBase64);
            var data = [{
              IdDocumento: 38, //id tipo documento de documentos_crud
              nombre: "Pruebas_gestorDocumental_1",// nombre formado por vigencia+contrato+cedula+mes+año
              file: fileBase64
              

            }];
            console.log(data)
            gestorDocumentalMidRequest.post('/document/upload',data).then(function (response){
             console.log(response);
            })
          }
        );


        //la Descripcion donde se enviaria? la que quedaria en el documentos_crud?
      } else {

        swal({
          title: 'Error',
          text: 'Debe subir un archivo en pdf no mayor a 1MB y/o seleccionar un item',
          type: 'error',
          target: document.getElementById('modal_ver_soportes')
        });

        self.mostrar_boton = true;

      }
      //}
      self.objeto_documento = {};

    };
    //
    /*
      Función que permite obtener un documento de nuxeo por el Id
    */
    self.getDocumento = function (docid) {
      //----------Inicio flujo antiguo para obtener un documento------
      /*nuxeo.header('X-NXDocumentProperties', '*');

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
          $window.open(fileURL, 'Soporte Cumplido', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
        });
      });*/
      //----------Fin flujo antiguo para obtener un documento------

      gestorDocumentalMidRequest.get('/document/a15e4545-877f-4adc-99e8-d8ffa0def0bf').then(function (response) {
        console.log();
        var blob = r;
        var fileURL = URL.createObjectURL(blob);
        
        self.content = $sce.trustAsResourceUrl(fileURL);
        $window.open(fileURL, 'Soporte Cumplido', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
      })
    };

    /*
     Función que obtiene los documentos relacionados a las solicitudes
    */
    self.obtener_doc = function (fila) {
      self.fila_sol_pago = fila;
      var nombre_docs = self.contrato.Vigencia + self.contrato.NumeroContratoSuscrito + self.Documento + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;
      documentoRequest.get('/documento', $.param({
        query: "Nombre:" + "Pruebas_gestorDocumental_1" + ",Activo:false",
        limit: 0
      })).then(function (response) {
        console.log("obtener documento")
        console.log(response)
        self.documentos = response.data;
        angular.forEach(self.documentos, function (value) {
          self.descripcion_doc = value.Descripcion;
          value.Metadatos = JSON.parse(value.Metadatos);
        });
      })

        //Manejo de null en la tabla documento
        .catch(function (response) {
          //Se deja vacia la variable para que no quede pegada
          self.documentos = undefined;
        });
    };

    /*
      Función para "borrar" un documento
    */
    self.borrar_doc = function () {

      var documento = self.doc;
      console.log(documento)
      nuxeoMidRequest.delete('workflow', documento.Enlace)
        .then(function (response) {
          //Bandera de validacion
        });
      console.info(documento.Id)
      documento.Metadatos = JSON.stringify(documento.Metadatos);
      documento.Activo = false;
      //documento.Descripcion = "PRUEBA DE CAMBIO"
      documentoRequest.put('documento', documento.Id, documento).then(function (response) {
        console.log(response)
        //self.obtener_doc(self.fila_sol_pago)
        swal({
          title: 'Documento borrado',
          text: 'Se ha borrado exitosamente el documento',
          type: 'success',
          target: self.obtener_doc(self.fila_sol_pago)
        });
      })

        .catch(function (response) {
          // self.obtener_doc(self.fila_sol_pago);
          swal({
            title: 'Error',
            text: 'Hubo un error al momento de borrar el documento',
            type: 'error',
            target: self.obtener_doc(self.fila_sol_pago)
          });
        })

    }

    self.set_doc = function (doc) {

      self.doc = doc;
    };


    self.prueba = function () {

      if (self.fileModel === undefined) {

        swal({
          title: '',
          text: 'No hay archivos para remover',
          type: 'warning',
          target: document.getElementById('modal_ver_soportes')
        })

      } else {

        $('#input-id').fileinput('clear');
        self.fileModel = undefined;

        swal({
          title: '',
          text: 'Se ha removido el archivo',
          type: 'success',
          target: document.getElementById('modal_ver_soportes')
        })

      }
    };

    self.fileToBase64 = function getBase64(file) {
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
    }


    self.getBase64 = async (file) => {
      var base64;
      await self.fileToBase64(file).then(data => {
        base64 = data;
        return null;
      });
      return base64;
    }

  });
