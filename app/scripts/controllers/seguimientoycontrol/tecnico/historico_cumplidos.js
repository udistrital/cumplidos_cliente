"use strict";

angular
  .module("contractualClienteApp")
  .controller("HistoricoCumplidosCtrl", function ($translate) {
    self = this;
    self.mesSelecionado;

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
        Nombre: $translate.instant("SEPTIEMBRE"),
      },
      {
        Id: 10,
        Nombre: $translate.instant("OCTUBRE"),
      },
      {
        Id: 11,
        Nombre: $translate.instant("NOVIEMBRE"),
      },
      {
        Id: 12,
        Nombre: $translate.instant("DICIEMBRE"),
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
    self.estados = [
      {
        Nombre: $translate.instant("APROBADO DE PAGO"),
      },
      {
        Nombre: $translate.instant("FEBRPENDIENTE DE SUPERVISO"),
      },
      {
        Nombre: $translate.instant("REVISON ORDENADOR"),
      },
    ];
  });
