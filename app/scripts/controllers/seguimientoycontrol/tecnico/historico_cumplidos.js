"use strict";

angular
  .module("contractualClienteApp")
  .controller(
    "HistoricoCumplidosCtrl",
    function ($translate, $scope, cumplidosCrudRequest, CONF) {
      self = this;
      self.mesSelecionado;

      self.filtro = {
        anios: "",
        meses: "",
        vigencia: "",
        documentos: [],
        estado: "",
        dependencia: "",
        noContratos: [],
      };

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

      //año del 2017 al actual
      self.obtenerAnios = () => {
        const anioActual = new Date().getFullYear();
        let anios = [];
        for (let i = 2017; i <= anioActual; i++) {
          anios.push(i);
        }
        return anios;
      };
      self.anios = self.obtenerAnios();

      //estados
      self.estados = cumplidosCrudRequest
        .get("/estado_pago_mensual", "")
        .then(function (response) {
          self.estados = response.data.Data;
        })
        .catch(function (error) {
          console.error("Error al obtener datos:", error);
        });
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
        console.log(self.estados);
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
        console.log(self.filtro);
      };
    }
  );
