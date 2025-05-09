'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CargaDocumentosContratistaCtrl
 * @description
 * #CargaDocumentosContratistaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('cargaDocumentosContratistaCtrl', function (token_service, notificacionRequest, funcGen, $scope, $http, $translate, uiGridConstants, contratoRequest, $q, documentoRequest, $window, $sce, gestorDocumentalMidRequest, firmaElectronicaRequest, $routeParams, utils, amazonAdministrativaRequest, cumplidosMidRequest, cumplidosCrudRequest) {

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
    self.funcGen = funcGen;
    self.existe = true;

    //Variable que indica cuando mostrar tabla de contratos
    self.TablaContratos = true;

    //Variable que indica cuando mostrar tabla de soportes
    self.TablaSoportes = false;

    //Variable que indica el estado del boton cargar soporte
    self.mostrar_boton = true;

    //Número de documento que viene en el token
    //Documento = token_service.getPayload().documento;
    self.Documento = token_service.getAppPayload().documento;

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
    self.anios_solicitud_pago = function (contrato) {
      if (!(contrato.FechaInicio instanceof Date) && !(contrato.FechaFin instanceof Date)) {
        contrato.FechaInicio = new Date(utils.ajustarFecha(contrato.FechaInicio));
        contrato.FechaFin = new Date(utils.ajustarFecha(contrato.FechaFin));
      }
      //console.log("contrato a sacar fechas:", contrato)
      //Arreglo que contiene los años de los cuales puede hacer la solicitud
      var anio_inicial = contrato.FechaInicio.getFullYear();
      var anio_final = contrato.FechaFin.getFullYear();
      self.anios = [];
      var dates = [];
      self.anios_meses = [];
      for (var anio = anio_inicial; anio <= anio_final; anio++) {
        self.anios.push(anio);
        var endMonth = anio != anio_final ? 11 : contrato.FechaFin.getMonth();
        var startMon = anio === anio_inicial ? contrato.FechaInicio.getMonth() : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
          var month = j;
          dates.push(self.meses_aux[month]);
        }
        self.anios_meses[anio] = dates;
        dates = [];
      }
      //console.log('anios_meses', self.anios_meses);
    };

    /*
      Función que visualiza los meses de acuerdo al año seleccionado
    */
    self.getMeses = function (anio) {
      self.meses = self.anios_meses[anio]
    };

    /*
      Creación tabla que tendrá todos los contratos relacionados al contratista
    */
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: false,
      resizable: false,
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
        cellTemplate: '<a type="button" title="CARGAR SOPORTES" type="button" class="fa fa-upload fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.cargarTablaSoportes(row.entity)">',
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
    self.cargarTablaSoportes = function (fila) {
      self.TablaContratos = false;
      self.TablaSoportes = true;
      self.cargar_soportes(fila);
      //console.log("tabla contratos", self.TablaContratos)
    }

    /*
      Función para consultar los contratos asociados al contratista
    */
    self.cargarTablaContratos = function () {
      self.TablaContratos = true;
      self.TablaSoportes = false;
    }

    /*
      Función para consultar los contratos asociados al contratista
    */
    self.obtener_informacion_contratos_contratista = function () {
      //Petición para obtener la información de los contratos del contratista
      self.gridOptions1.data = [];
      //Petición para obtener las contratos relacionados al contratista
      cumplidosMidRequest.get('contratos_contratista/' + self.Documento)
        .then(function (response) {
          if (response.data.Data) {
            //Contiene la respuesta de la petición
            self.informacion_contratos = response.data.Data;
            //Se envia la data a la tabla
            self.gridOptions1.data = self.informacion_contratos;
            //Contiene el numero de documento del Responsable
          } else {
            swal(
              'Error',
              'No se encontraron contratos vigentes asociados a su número de documento',
              'error'
            )
          }
        });
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
      enableFiltering: false,
      resizable: false,
      columnDefs: [{
        field: 'NumeroContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUMERO_CONTRATO'),
        width: '*',
      },
      {
        field: 'VigenciaContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        width: '7%',
      },
      {
        field: 'NumeroCDP',
        cellTemplate: tmpl,
        displayName: 'CDP',
        width: '8%',
      },
      {
        field: 'VigenciaCDP',
        cellTemplate: tmpl,
        displayName: 'VIGENCIA CDP',
        width: '12%',
      },
      {
        field: 'Mes',
        cellTemplate: tmpl,
        displayName: $translate.instant('MES'),
        width: '6%',
      },
      {
        field: 'Ano',
        cellTemplate: tmpl,
        displayName: $translate.instant('ANO'),
        width: '7%',
      },
      {
        field: 'FechaCreacion',
        cellTemplate: tmpl,
        displayName: 'FECHA CREACION',
        width: '*',
      },
      {
        field: 'EstadoPagoMensualId.Nombre',
        cellTemplate: tmpl,
        displayName: $translate.instant('EST_SOL'),
        width: '*',
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'VER_SOP\'| translate }}" type="button" class="fa fa-folder-open-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.obtener_doc(row.entity)" data-toggle="modal" data-target="#modal_ver_soportes">' +
          '</a>&nbsp;' + '<a ng-if="row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'CD\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RS\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RP\' || row.entity.EstadoPagoMensualId.CodigoAbreviacion === \'RO\'" type="button" title="ENVIAR A REVISION SUPERVISOR" type="button" class="fa fa-send-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosContratista.enviar_revision(row.entity)"  >',
        width: '8%'
      }
      ]
    };

    self.cambiar_form_doc = function () {
      //console.log("item seleccionado: ", self.item);
      //console.log(self.fila_sol_pago)
      if (self.item.ItemInformeId.Nombre == "INFORME DE GESTIÓN Y CERTIFICADO DE CUMPLIMIENTO") {
        self.generar_documento = true;
      } else {
        self.generar_documento = false;
      }
    }

    /*
      Función para generar la solicitud de pago
    */
    self.suscribirse = function () {
      //console.log('entro a suscribirse')
      notificacionRequest.verificarSuscripcion().then(
        function (response) {
          if (!response.data.Data) {
            notificacionRequest.suscripcion().then(
              function (response) {
                //console.log('Resultado de la suscripcion', response)
              }
            ).catch(
              function (error) {
                //console.log('error suscripcion',error)
              }
            )
          }
        }
      ).catch(
        function (error) {
          //console.log('error verificar suscripcion',error)
        }
      )
    }


    /*
      Función para generar la solicitud de pago
    */
    self.enviar_solicitud = function () {

      if (self.mes !== undefined && self.anio !== undefined) {
        //Petición para obtener id de estado pago mensual
        //self.mostrar_boton = false;
        cumplidosCrudRequest.get('estado_pago_mensual', $.param({
          query: "CodigoAbreviacion:CD",
          limit: 0
        })).then(function (response) {
          //console.log("estado_pago_mensual", response)
          //Variable que contiene el Id del estado pago mensual
          var id_estado = response.data.Data[0].Id;
          //Se arma elemento JSON para la solicitud

          var pago_mensual_auditoria = {
            Pago: {
              CargoResponsable: "CONTRATISTA",
              EstadoPagoMensualId: { Id: id_estado },
              Mes: self.mes,
              Ano: self.anio,
              Activo: true,
              NumeroContrato: self.contrato.NumeroContratoSuscrito,
              DocumentoPersonaId: self.Documento,
              DocumentoResponsableId: self.Documento,
              VigenciaContrato: parseInt(self.contrato.Vigencia),
              NumeroCDP: self.contrato.NumeroCdp,
              VigenciaCDP: parseInt(self.contrato.VigenciaCdp)
            },
            CargoEjecutor: "CONTRATISTA",
            DocumentoEjecutor: self.Documento
          }

          cumplidosCrudRequest.get('pago_mensual', $.param({
            query: "NumeroContrato:" + self.contrato.NumeroContratoSuscrito +
              ",VigenciaContrato:" + self.contrato.Vigencia +
              ",Mes:" + self.mes +
              ",Ano:" + self.anio +
              ",DocumentoPersonaId:" + self.Documento +
              ",NumeroCDP:" + self.contrato.NumeroCdp +
              ",VigenciaCDP:" + self.contrato.VigenciaCdp,
            limit: 0
          })).then(function (responsePago) {
            if (Object.entries(responsePago.data.Data[0]).length == 0) {
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
                  //self.mostrar_boton = true;

                });
            } else if (Object.entries(solicitudes_pago_mensual[0]).length === 1) {

              cumplidosMidRequest.get('informacion_informe/' + responsePago.data.Data[0].Id).then(function (response) {
                for (var i = response.data.Data.Novedades.length - 1; i >= 0; i--) {
                  if (response.data.Data.Novedades[i].TipoNovedad == "NP_SUS") {
                    var fechaInicio = response.data.Data.Novedades[i].FechaInicio.split("-");
                    var fechaFin = response.data.Data.Novedades[i].FechaFin.split("-");
                    if (fechaInicio[1] == self.mes && fechaInicio[0] == self.anio && fechaFin[1] == self.mes && fechaFin[0] == self.anio) {

                      cumplidosCrudRequest.post("pago_mensual", pago_mensual_auditoria)
                        .then(function (responsePagoPost) {
                          swal(
                            $translate.instant('SOLICITUD_REGISTRADA'),
                            $translate.instant('CARGUE_CORRESPONDIENTE'),
                            'success'
                          )
                          self.cargar_soportes(self.contrato);
                          self.mes = undefined;
                          self.anio = undefined;
                        });
                    } else {
                      swal(
                        'Error',
                        'No se puede crear mas de una solicitud de pago del mismo mes y año',
                        'warning'
                      );
                    }
                  }
                }
              }).catch(function (error) {
                console.log("Error", error);
              });
            } else {
              swal(
                'Error',
                'No se puede crear mas de dos solicitudes de pago (suspensión)',
                'warning'
              );
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
      self.anio = undefined;
      self.mes = undefined;
      self.seleccionado = false;
      self.gridOptions2.data = [];
      self.contrato = contrato;
      //consulta la dependencia del supervisor
      self.responsable = contrato.NumDocumentoSupervisor;
      self.obtenerDependenciasSupervisor();
      self.anios_solicitud_pago(contrato);
      //console.log("contrato", self.contrato);
      //self.obtener_informacion_coordinador(self.contrato.IdDependencia);
      cumplidosCrudRequest.get('pago_mensual', $.param({
        query: "NumeroContrato:" + self.contrato.NumeroContratoSuscrito
          + ",VigenciaContrato:" + self.contrato.Vigencia
          + ",DocumentoPersonaId:" + self.Documento
          + ",NumeroCDP:" + self.contrato.NumeroCdp
          + ",VigenciaCDP:" + self.contrato.VigenciaCdp,
        sortby: "Ano,Mes",
        order: "desc,desc",
        limit: 0
      })).then(function (response) {
        contratoRequest.get('contrato', self.contrato.NumeroContratoSuscrito + '/' + self.contrato.Vigencia)
          .then(function (response_ce) {

            self.tipo_contrato = response_ce.data.contrato.tipo_contrato;


            cumplidosCrudRequest.get("item_informe_tipo_contrato", $.param({
              query: "TipoContratoId:" + '6' + ",Activo:true",
              limit: 0
            })).then(function (response_iitc) {

              self.items = response_iitc.data.Data;
            });

          });
        var solicitudes_pago_mensual = response.data.Data
        //console.log(solicitudes_pago_mensual);
        if (Object.entries(solicitudes_pago_mensual[0]).length === 0) {
          solicitudes_pago_mensual = [];
        }
        var pagos_mensuales = solicitudes_pago_mensual.map(pago_mensual => {
          pago_mensual.FechaCreacion = new Date(pago_mensual.FechaCreacion).toLocaleDateString();
          return pago_mensual
        });
        //console.log('pagos men',pagos_mensuales)
        //console.log('longitud pagos',pagos_mensuales.length);
        pagos_mensuales.length > 0 ? self.gridOptions2.data = pagos_mensuales : self.gridOptions2.noData = true;

      })

        .catch(function (response) {
          //console.log('error',response)
          swal({
            title: 'Ocurrio un error al traer los registros de pago',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            //$window.location.href = '/#/';
          })
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

          self.gridOptions2.noData = true;
        });
    };

    /*
      Enviar solicitud de revisión de soportes a Supervisor
    */
    self.enviar_revision = function (solicitud) {
      self.obtener_doc(solicitud);
      cumplidosMidRequest.get('validacion_periodo_carga_cumplido/' + self.dependencia_supervisor.codigo + '/' + solicitud.Ano + '/' + solicitud.Mes).then(function (response) {
        //console.log('Fechas Parametrizadas', response)
        self.Validacion = response.data.Data;

        if (response.data.Status == "200") {
          if (self.Validacion.CargaHabilitada) {
            //console.log("Carga Habilitada: true");
            self.enviar_cumplido(solicitud);
          } else {
            //console.log("Carga Habilitada: false");
            swal({
              title: 'Fuera de tiempo',
              text: 'Las fechas de carga del cumplidos son del ' + self.Validacion.Periodo.Inicio + ' al ' + self.Validacion.Periodo.Fin,
              type: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            })
          }
        } else {
          swal({
            title: 'Ocurrio un error al traer los registros',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            //$window.location.href = '/#/';
          })
        }
      }, function (error) {
        swal({
          title: 'Ocurrio un error al traer los registros',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then(function () {
          //$window.location.href = '/#/';
        })
      })

    };

    /*
      Función para asegurarse que los informes hayan sido desactivados correctamente
    */
    self.comprobarDesactivacionInformes = function (soporteId) {
      cumplidosCrudRequest.get('soporte_pago_mensual?query=PagoMensualId:' + soporteId + ',ItemInformeTipoContratoId.ItemInformeId.Id:10,activo:true&order=desc&sortby=FechaCreacion')
        .then(response => {
          const soportesRes = response.data.Data;
          let arr_informes = [];
          for (let i = 0; i < soportesRes.length; i++) {
            let soporte_info = soportesRes[i];
            if (soporte_info.ItemInformeTipoContratoId.ItemInformeId.Id == 10) {
              arr_informes.push(soporte_info);
            }
          }
          if (arr_informes.length != 1) {
            for (let i = 0; i < arr_informes.length - 1; i++) {
              let soporte_info = arr_informes[i];
              let objeto_soporte = {
                "Id": soporte_info.Id,
                "Documento": soporte_info.Documento,
                "Activo": false,
                "FechaCreacion": soporte_info.FechaCreacion,
                "FechaModificacion": soporte_info.FechaModificacion,
                "Aprobado": soporte_info.Aprobado,
                "ItemInformeTipoContratoId": {
                  "Id": soporte_info.ItemInformeTipoContratoId.Id
                },
                "PagoMensualId": {
                  "Id": soporte_info.PagoMensualId.Id
                }
              };
              cumplidosCrudRequest.put('soporte_pago_mensual', soporte_info.Id, objeto_soporte).then(response => {
                console.log("Proceso exitoso");
              });
            }
          }
        });
    }
    //
    /*
      Función para enviar el cumplido
    */
    self.enviar_cumplido = function (solicitud) {
      swal({
        title: '¿Está seguro(a) de firmar electrónicamente y enviar a revisar los soportes por el supervisor?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Enviar'
      }).then(function () {


        contratoRequest.get('contrato', self.contrato.NumeroContratoSuscrito + '/' + self.contrato.Vigencia).then(function (response) {

          self.obtener_doc(solicitud);
          if (self.documentos) {
            //Inicio verificación rechazo
            cumplidosCrudRequest.get('soporte_pago_mensual?query=documento:' + self.documentos[0].Documento.Id + "&limit=1").then(response => {
              let soporteId = response.data.Data[0].PagoMensualId.Id;
              self.comprobarDesactivacionInformes(soporteId);
            });

            //Fin verificación
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
                  VigenciaContrato: parseInt(self.contrato.Vigencia),
                  NumeroCDP: self.contrato.NumeroCdp,
                  VigenciaCDP: parseInt(self.contrato.VigenciaCdp)
                },
                CargoEjecutor: "CONTRATISTA",
                DocumentoEjecutor: self.Documento
              }

              //Inicio firma inicial contratista
              self.documentos.forEach(documento => {
                if (documento.Documento.Descripcion == 'INFORME DE GESTIÓN Y CERTIFICADO DE CUMPLIMIENTO') {
                  //console.log(documento);
                  cumplidosCrudRequest.get('soporte_pago_mensual?query=documento:' + documento.Documento.Id + "&limit=1").then(response => {
                    const soporteRes = response.data.Data[0];
                    amazonAdministrativaRequest.get('informacion_persona_natural?query=Id:' + soporteRes.PagoMensualId.DocumentoPersonaId).then(response => {
                      const personaNatural = response.data[0];
                      var data = [{
                        IdTipoDocumento: documento.Documento.TipoDocumento.Id, //id tipo documento de documentos_crud
                        nombre: documento.Documento.Nombre,// nombre formado por vigencia+contrato+cedula+mes+año
                        metadatos: documento.Documento.Metadatos,
                        firmantes: [
                          {
                            nombre: personaNatural.PrimerNombre + " " + personaNatural.SegundoNombre + " " + personaNatural.PrimerApellido + " " + personaNatural.SegundoApellido,
                            cargo: "Contratista",
                            tipoId: personaNatural.TipoDocumento.Abreviatura,
                            identificacion: personaNatural.Id
                          }
                        ],
                        representantes: [],
                        descripcion: documento.Documento.Descripcion,
                        etapa_firma: 1,
                        file: documento.Archivo.file
                      }];
                      //estampa la firma del contratista y guarda en BD y nuxeo mediante API firma electrónica
                      firmaElectronicaRequest.firma_multiple(data).then(function (response) {
                        if (response.data.Status == 200) {

                          const idDoc = response.data.res.Id;
                          cumplidosCrudRequest.get('item_informe_tipo_contrato', $.param({
                            query: "Activo:true,TipoContratoId:6,ItemInformeId.CodigoAbreviacion:IGYCC",
                            limit: 0
                          })).then(function (response_item_informe_tipo_contrato) {
                            var ItemInformeTipoContratoId = response_item_informe_tipo_contrato.data.Data[0].Id;
                            const objeto_soporte = {
                              "PagoMensualId": {
                                "Id": soporteRes.PagoMensualId.Id
                              },
                              "Documento": idDoc,
                              "ItemInformeTipoContratoId": {
                                "Id": ItemInformeTipoContratoId
                              },
                              "Aprobado": false
                            };
                            cumplidosCrudRequest.post('soporte_pago_mensual', objeto_soporte)
                              .then(function (response) {
                                //Bandera de validacion
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
                              });
                          })
                        }
                      });
                    });
                  });
                }
              });
              //Fin firma inicial contratista
            })
            self.suscribirse();
            notificacionRequest.enviarNotificacion('Cumplido pendientes por aprobacion', 'ColaSupervisor', '/seguimientoycontrol/tecnico/aprobacion_supervisor');
          } else {

            swal(
              'Error',
              'No puede enviar a revisión sin cargar algún documento',
              'error'
            )
          }

        });
      }).catch(function () {

      });
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
        //console.log("item",self.item)
        var descripcion;
        var fileBase64;
        utils.getBase64(self.fileModel).then(
          function (base64) {
            fileBase64 = base64;
            descripcion = self.item.ItemInformeId.Nombre;
            var data = [{
              IdTipoDocumento: 19, //id tipo documento de documentos_crud
              nombre: nombre_doc,// nombre formado por vigencia+contrato+cedula+mes+año
              file: fileBase64,
              metadatos: {
                NombreArchivo: self.fileModel.name,
                Tipo: "Archivo",
                Observaciones: self.observaciones
              },
              descripcion: descripcion,

            }];
            //guarda el soporte por medio del gestor documental
            gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
              //console.log(response.data);

              if (response.data.Status == 200) {
                self.id_documento = response.data.res.Id;

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
              }
            }).catch(function (error) {
              swal({
                title: 'Error',
                text: 'Ocurrio un error al guardar el documento',
                type: 'error',
                target: document.getElementById('modal_ver_soportes')
              });
            });
          }
        ).catch(function () {
          swal({
            title: 'Error',
            text: 'Ocurrio un error al guardar el documento',
            type: 'error',
            target: document.getElementById('modal_ver_soportes')
          });
        });


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

    self.obtener_doc = function (fila) {
      self.fila_sol_pago = fila;
      funcGen.obtener_doc(self.fila_sol_pago.Id).then(function (documentos) {
        self.documentos = documentos;
        //console.log(self.documentos);
      }).catch(function (error) {
        //console.log("error",error)
        self.documentos = undefined;
      })
    };

    /*
      Función para "borrar" un documento
    */
    self.borrar_doc = function () {
      var documento = self.doc;
      //------ INICIO MODIFICACIÓN ESTADO ACTIVO EN SOPORTE_PAGO_MENSUAL------------
      cumplidosCrudRequest.get('soporte_pago_mensual?query=documento:' + documento.Id).then(response => {
        const soporte_info = response.data.Data[0];
        const objeto_soporte = {
          "Id": soporte_info.Id,
          "Documento": documento.Id,
          "Activo": false,
          "FechaCreacion": soporte_info.FechaCreacion,
          "FechaModificacion": soporte_info.FechaModificacion,
          "Aprobado": soporte_info.Aprobado,
          "ItemInformeTipoContratoId": {
            "Id": soporte_info.ItemInformeTipoContratoId.Id
          },
          "PagoMensualId": {
            "Id": soporte_info.PagoMensualId.Id
          }
        };
        cumplidosCrudRequest.put('soporte_pago_mensual', soporte_info.Id, objeto_soporte).then(response => {
          swal({
            title: 'Documento borrado',
            text: 'Se ha borrado exitosamente el documento',
            type: 'success',
            target: document.getElementById('modal_ver_soportes')
          }).then(
            function () {
              self.obtener_doc(self.fila_sol_pago)
            }
          );
        });
      }).catch(error => {
        swal({
          title: 'Error',
          text: 'Hubo un error al momento de borrar el documento',
          type: 'error',
          target: document.getElementById('modal_ver_soportes')
        });
      });
      //------ FIN MODIFICACIÓN ESTADO ACTIVO EN SOPORTE_PAGO_MENSUAL------------
    }

    self.set_doc = function (doc) {
      self.doc = doc.Documento;
    };


    self.remover_doc = function () {

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

    self.obtenerDependenciasSupervisor = function () {
      contratoRequest.get('dependencias_supervisor', self.responsable)
        .then(function (response) {
          if (response.data.dependencias.dependencia != undefined) {
            if (response.data.dependencias.dependencia.length != 0) {
              self.dependencia_supervisor = response.data.dependencias.dependencia[0];
              //console.log('Dependencia supervisor', self.dependencia_supervisor);
            } else {
              swal({
                title: 'No se encontro dependencia asociada',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
              }).then(function () {
                $window.location.href = '/#/';
              })
            }
          } else {
            swal({
              title: 'No se encontro dependencia asociada',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            }).then(function () {
              $window.location.href = '/#/';
            })
          }

        });
    };
  });
