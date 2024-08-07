"use strict";

angular
  .module("contractualClienteApp")
  .controller(
    "HistoricoCumplidosCtrl",
    function (
      $translate,
      $scope,
      cumplidosCrudRequest,
      CONF,
      token_service,
      contratoRequest,
      uiGridConstants,
      gridApiService,
      funcGen,
      cumplidosMidRequest,
      $timeout,
    ) {
      var tmpl =
        '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';
      self = this;
      self.funcGen = funcGen;
      self.mesSelecionado;
      self.playLoad = token_service.getPayload();
      self.offset = 0;
      self.idPagoActual;
      self.MostrarCargando;
      self.MostrarCargando;
      self.desabilitarBotonBusqueda = false;
      self.dependencias;

      self.filtro = {
        anios: "",
        meses: "",
        vigencia: "",
        documentos: "",
        estados: "",
        dependencia: "",
        noContratos: "",
      };
      self.estadosDelPago;
      self.Documentospago = [];

      function refreshSelectPicker() {
        $timeout(function () {
          $(".selectpicker").selectpicker("refresh");
        });
      }
      //Meses del año
      self.meses = [
        {
          Id: 1,
          Nombre: $translate.instant("ENERO"),
        },
        {
          Id: 2,
          Nombre: $translate.instant("FEBRERO"),
        },
        {
          Id: 3,
          Nombre: $translate.instant("MARZO"),
        },
        {
          Id: 4,
          Nombre: $translate.instant("ABRIL"),
        },
        {
          Id: 5,
          Nombre: $translate.instant("MAYO"),
        },
        {
          Id: 6,
          Nombre: $translate.instant("JUNIO"),
        },
        {
          Id: 7,
          Nombre: $translate.instant("JULIO"),
        },
        {
          Id: 8,
          Nombre: $translate.instant("AGOSTO"),
        },
        {
          Id: 9,
          Nombre: $translate.instant("SEPT"),
        },
        {
          Id: 10,
          Nombre: $translate.instant("OCTU"),
        },
        {
          Id: 11,
          Nombre: $translate.instant("NOV"),
        },
        {
          Id: 12,
          Nombre: $translate.instant("DIC"),
        },
      ];

      //año del 2017 al actual7230282
      self.obtenerAnios = () => {
        const anioActual = new Date().getFullYear();
        let anios = [];
        for (let i = 2017; i <= anioActual; i++) {
          anios.push(i);
        }
        return anios;
      };
      self.anios = self.obtenerAnios();

      //dependencia
      self.getDependecias  = function(){
        
        let roles= self.playLoad.role;
       
        if(roles!=null && roles.includes("CONTROL_INTERNO")){
        cumplidosMidRequest
          .get("historicos/dependencias_generales/")
          .then(function(response){
       self.dependencias= response.data.Data; 
       self.dependencias.sort(function(a, b) {
        var nameA = a.Nombre.toUpperCase(); 
        var nameB = b.Nombre.toUpperCase();

        if (nameA < nameB) {
            return -1; 
        }
        if (nameA > nameB) {
            return 1; 
        }
        return 0;
    });
       refreshSelectPicker();
          })
          .catch(function(error){
            console.error("Error al obtener dependencias:", error);
          });
        }
        else{
          cumplidosMidRequest
          .get("historicos/dependencias/" + self.playLoad.documento, "")
          .then(function (response) {
            let Ordenador = response.data.Data["Dependencias Ordenador"] || [];
            let Supervisor = response.data.Data["Dependencias Supervisor"] || [];
           self.dependencias=  Ordenador.concat(Supervisor);
            refreshSelectPicker();
          })
          .catch(function (error) {
            console.error("Error al obtener dependencias:", error);
          });
        }
        
      }
      self.getDependecias();
      //Depenencias en string
      self.dependenciasString = function () {
        let dependenciaString = "";

        for (var i = 0; i < self.filtro.dependencia.length; i++) {
          dependenciaString += "'" + self.filtro.dependencia[i] + "'";
          if (i < self.filtro.dependencia.length - 1) {
            dependenciaString += ",";
          }
        }
        return dependenciaString;
      };
      //estados
      self.estados = cumplidosCrudRequest
        .get("estado_pago_mensual", "")
        .then(function (response) {
          self.estados = response.data.Data;
          refreshSelectPicker();
        })

        .catch(function (error) {
          console.error("Error al obtener estados:", error);
        });
      //
      //Regresar array de numeros
      self.getString = (array) => {
        if (array.length !== 0) {
          return array.join(",");
        } else {
          return "";
        }
      };

      ///Submit Filtro
      self.submitFiltro = function () {
        if ($scope.filtro.$invalid) {
          swal({
            title: $translate.instant("TITULO_ERROR"),
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#d33",
            confirmButtonText: "Aceptar",
          });
          return;
        } else {
          swal({
            title: "¡Buscando!",
            text: "Espera  un momento",
            type: "info",
            showConfirmButton: false,
          });
          self.obtener_solicitudes_pagos();
        }
      };

      /*
      Creación tabla que tendrá todos las solicitudes de pagos de acuerdo a los filtros
    */
      self.gridOptions1 = {
        enablePaginationControls: true,
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: 10,
        enableSorting: true,
        enableColumnResizing: true,
        enableFiltering: true,
        resizable: true,
        rowHeight: 40,
        columnDefs: [
          {
            field: "NombreDependencia",
            cellTemplate: tmpl,
            displayName: "DEPENDENCIA",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "18%",
          },
          {
            field: "Rubro",
            cellTemplate: tmpl,
            displayName: "RUBRO",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "12%",
          },
          {
            field: "DocumentoContratista",
            cellTemplate: tmpl,
            displayName: $translate.instant("DOCUMENTO"),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "10%",
          },
          {
            field: "NombreContratista",
            cellTemplate: tmpl,
            displayName: "NOMBRE PERSONA",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "18%",
          },
          {
            field: "NumeroContrato",
            cellTemplate: tmpl,
            displayName: "Nº CONTRATO",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "*",
          },

          {
            field: "Vigencia",
            cellTemplate: tmpl,
            cellRenderer: null,
            displayName: "VIGENCIA",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "5%",
          },
          {
            field: "Ano",
            cellTemplate: tmpl,
            displayName: "AÑO",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "5%",
          },
          {
            field: "mesNombre",
            cellTemplate: tmpl,
            displayName: "MES",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "9%",
          },
          {
            field: "Estado",
            cellTemplate: tmpl,
            displayName: "ESTADO",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "9%",
          },
          {
            field: "Acciones",
            displayName: $translate.instant("ACC"),
            cellTemplate:
              '<div style="text-align: center;">' +
              '<a type="button" title="Ver detalles" class="fa fa-eye fa-lg faa-shake animated-hover" style="margin-right: 5px;"  data-toggle="modal"    ng-click="grid.appScope.HistoricoCumplidos.getLineaTiempoEstados(row.entity)"   ></a>' +
              '<a type="button" title="Descargar soportes" class="fa fa-cube fa-lg faa-shake animated-hover" style="margin-left: 5px;"  data-toggle="modal" ng-click="grid.appScope.HistoricoCumplidos.descargarDocumentos(row.entity.IdPagoMensual)"></a>' +
              "</div>",
            width: "7%",
          },
        ],
      };

      self.isDisableButton = function() {
        if ((self.filtro.noContratos && self.filtro.noContratos.slice(-1) === ",") || (self.filtro.documentos && self.filtro.documentos.slice(-1) === ",")) {
          self.desabilitarBotonBusqueda = true;
        } else {
          self.desabilitarBotonBusqueda = false;
        }
      };
        
      self.gridOptions1.onRegisterApi = function (gridApi) {
        self.gridApi1 = gridApi;
      }


      self.obtener_solicitudes_pagos = function () {
        self.gridOptions1.data = [];
        var datos;

        if (self.filtro.dependencia && self.filtro.dependencia != "") {
          datos = {
            dependencias: self.dependenciasString(),
            vigencias: self.getString(self.filtro.vigencia),
            documentos_persona_id: self.filtro.documentos,
            numeros_contratos: self.filtro.noContratos,
            meses: self.getString(self.filtro.meses),
            anios: self.getString(self.filtro.anios),
            estados_pagos: self.getString(self.filtro.estados),
          };

          // Realizar la peticion post con los datos del objeto datos
          cumplidosMidRequest.post("solicitudes_pagos", datos).then(
            function (response) {
              swal.close();
              if (response.data.Data == null) {
                swal({
                  title: "",
                  text: "No se encontraron solicitudes de pagos asociados a los valores de busqueda",
                  type: "warning",
                });
              } else {
                //self.agregarNombreMeses(response.data.Data)
                self.gridOptions1.paginationCurrentPage = 1;
                self.agregarNombreMeses(response.data.Data);
                self.gridOptions1.data = response.data.Data;
                self.offset;
              }
            },
            function (error) {
              swal({
                title: "Error",
                text: "Ocurrio un error al solicitar los registros",
                type: "error",
              });
            }
          );
        }
      };


      self.agregarNombreMeses = function (data) {
        var data_modificada = data.map(function (item) {
          var nombreMes = self.meses[item.Mes - 1].Nombre;
          item.mesNombre = nombreMes;
          return item;
        });
        return data_modificada;
      };

      self.getLineaTiempoEstados = function (entity) {
        self.detallesPago = entity;
        self.MostrarCargando = true;
        self.Documentospago = [];
        self.idPagoActual = entity.IdPagoMensual;
        cumplidosMidRequest
          .get("historicos/cambio_estado_pago/" + entity.IdPagoMensual)
          .then(function (response) {
            self.estadosDelPago = response.data.Data;
            refreshSelectPicker();
            $("#modal_ver_linea_tiempo").modal("show");
          })
          .catch(function (error) {
            console.error("Error al obtener datos:", error);
          });
        console;

        funcGen
          .obtener_doc(entity.IdPagoMensual)
          .then(function (documentos) {
            self.Documentospago = documentos != null ? documentos : null;
            self.MostrarCargando = false;
            //console.log(self.Documentospago);
            /// console.log(self.Documentospago);
          })
          .catch(function (error) {
            console.error("Error al obtener documentos:", error);
          });
      };

      self.verDocumento = function (file_base64, nameWindow) {
        funcGen.getDocumento(file_base64, nameWindow);
      };

      self.descargarDocumentos = function (idPago) {
        let file = cumplidosMidRequest
          .get("download_documents/" + idPago, "")
          .then(function (response) {
            file = response.data.Data;
            if (file.nombre != "") {
              swal({
                title: "¡Iniciando descarga!",
                text: "Espera  un momento",
                type: "info",
                showConfirmButton: false,
              });
              funcGen.getZip(file);
              swal.close();
            } else {
              swal({
                title: "¡No hay documentos!",
                text: "No hay documentos para el pago",
                type: "warning",
                showConfirmButton: true,
              });
            }
          })
          .catch(function (error) {
            swal({
              title: "Error",
              text: "Ocurrio un error al descargar los archivos",
              type: "error",
            });
          });
      };

      self.limpiarListaDocs = function () {
        self.Documentospago = [];
      };
    }
  );
