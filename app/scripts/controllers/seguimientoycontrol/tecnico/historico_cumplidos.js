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
      $timeout
    ) {
      var tmpl =
        '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';
      self = this;
      self.funcGen = funcGen;
      self.mesSelecionado;
      self.playLoad = token_service.getPayload();
      self.offset = 0;

      self.filtro = {
        anios: "",
        meses: "",
        vigencia: "",
        documentos: [],
        estado: "",
        dependencia: "",
        noContratos: [],
      };
      self.estadosDelPago;
      self.Documentospago;

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
      self.dependencias = cumplidosMidRequest
        .get("historicos/dependencias/" + playLoad.documento, "")
        .then(function (response) {
          let Ordenador = response.data.Data["Dependencias Ordenador"] || [];
          let Supervisor = response.data.Data["Dependencias Supervisor"] || [];
          self.dependencias = Ordenador.concat(Supervisor);

          for (var i = 0; i < self.dependencias.length; i++) {
            self.dependenciaString += "'" + self.dependencias[i].Codigo + "'"; //
            if (i < self.dependencias.length - 1) {
              self.dependenciaString += ",";
            }
          }
          refreshSelectPicker();
        })
        .catch(function (error) {
          console.error("Error al obtener dependencias:", error);
        });

      //Depenencias en string
      self.dependenciasString = function () {
        let dependenciaString = "";

        for (var i = 0; i < self.filtro.dependencia.length; i++) {
          dependenciaString += "'" + self.filtro.dependencia[i] + "'";
          if (i < self.filtro.dependencia - 1) {
            dependenciaString += ",";
          }
        }
        console.log(dependenciaString);
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
      self.getArray = (numbers) => {
        let numeros = numbers.split(",");
        let arrayNumber = numeros.map(function (numero) {
          return numero.trim();
        });
        return arrayNumber;
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
        }

        if (self.filtro.documento) {
          self.filtro.documentos = self.getArray(self.filtro.documento);
        }

        if (self.filtro.noContrato) {
          self.filtro.noContratos = self.getArray(self.filtro.noContratos);
        }
        console.log(self.filtro.anios);
        self.obtener_solicitudes_pagos();
      };

      /*
      Creación tabla que tendrá todos las solicitudes de pagos de acuerdo a los filtros
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
            field: "Vigencia",
            cellTemplate: tmpl,
            cellRenderer: null,
            displayName: "VIGENCIA",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "7%",
          },
          {
            field: "Ano",
            cellTemplate: tmpl,
            displayName: "AÑO",
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "7%",
          },
          {
            field: "mesNombre",
            cellTemplate: tmpl,
            displayName: $translate.instant("MES"),
            sort: {
              direction: uiGridConstants.ASC,
              priority: 1,
            },
            width: "9%",
          },
          {
            field: "Estado",
            cellTemplate: tmpl,
            displayName: $translate.instant("ESTADO"),
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
              '<a type="button" title="Ver detalles" class="fa fa-eye fa-lg faa-shake animated-hover" style="margin-right: 5px;"  data-toggle="modal"    ng-click="grid.appScope.HistoricoCumplidos.getLineaTiempoEstados(row.entity.Id)"   ></a>' +
              '<a type="button" title="Ver soportes" class="fa fa-cube fa-lg faa-shake animated-hover" style="margin-left: 5px;"  data-toggle="modal" data-target="#modal_ver_soportes"></a>' +
              "</div>",
            width: "7%",
          },
        ],
      };

      self.gridOptions1.onRegisterApi = function (gridApi) {
        self.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          self.solicitudes_seleccionadas = gridApi.selection.getSelectedRows();
        });

        self.gridApi = gridApiService.pagination(
          self.gridApi,
          self.obtener_solicitudes_pagos,
          $scope
        );
      };

      self.obtener_solicitudes_pagos = function () {
        self.gridOptions1.data = [];
        var datos;
        console.log();
        if (self.filtro.dependencia && self.filtro.dependencia != "") {
          datos = {
            dependencias: self.dependenciasString(),
            vigencias: self.filtro.vigencia,
            documentos_persona_id:
              self.filtro.documentos.length != 0
                ? self.filtro.documentos.join(",")
                : "",
            numeros_contratos:
              self.filtro.noContratos.length != 0
                ? self.filtro.noContratos.join(",")
                : "",
            meses: self.filtro.meses,
            anios: self.filtro.anios,
            estados_pagos: self.filtro.estado,
          };

          // Realizar la peticion post con los datos del objeto datos
          cumplidosMidRequest.post("solicitudes_pagos", datos).then(
            function (response) {
              if (Object.keys(response.data.Data[0]).length === 0) {
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

      self.getLineaTiempoEstados = function (idPago) {
        console.warn(idPago);
        cumplidosCrudRequest
          .get("historicos/cambio_estado_pago", idPago)
          .then(function (response) {
            self.estadosDelPago = response.data.Data;
            console.log(self.estadosDelPago);
            refreshSelectPicker();
            $("#modal_ver_linea_tiempo").modal("show");
          })
          .catch(function (error) {
            console.error("Error al obtener datos:", error);
          });

        self.Documentospago = funcGen
          .obtener_doc(idPago)
          .then(function (documentos) {
            self.Documentospago = documentos;
            /// console.log(self.Documentospago);
          })
          .catch(function (error) {
            console.error("Error al obtener documentos:", error);
          });
      };

      self.verDocumento = function (file_base64, nameWindow) {
        funcGen.getDocumento(file_base64, nameWindow);
      };
    }
  );
