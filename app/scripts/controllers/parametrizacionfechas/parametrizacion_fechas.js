'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:InformeGyCertificadoCCtrl
 * @description
 * #InformeGyCertificadoCCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('ParametrizacionFechasCtrl', function (token_service, cookie, $sessionStorage, $scope, $http, $translate, uiGridConstants, cumplidosCrudRequest, $route, $q, documentoRequest, $window, $sce, gestorDocumentalMidRequest, $routeParams, utils, amazonAdministrativaRequest, nuxeoMidRequest, cumplidosMidRequest, contratoRequest) {

    self = this;

    self.anios = [];
    self.meses = [];
    self.Mostrar = false;
    self.existenFechasParametrizadas = false;
    self.fechaExiste = false;
    self.opcion = "";
    self.documento = token_service.getAppPayload().documento;
    console.log('documento', self.documento)
    self.fechas_parametrizadas = []

    console.log('meses', utils.getMeses())
    self.meses = utils.getMeses();
    self.hoy = new Date();

    self.inicializarAnios = function () {
      //Arreglo que contiene los años de los cuales se pueden ver cumplidos
      for (let index = 1; index >= 0; index--) {
        self.anios.push(self.hoy.getFullYear() - index)
      }
    };

    self.inicializarAnios();

    self.cambiarFormulario = function () {
      if (self.opcion == "periodo") {
        self.periodo = true
        self.sin_limite = false
      } else {
        self.periodo = false
        self.sin_limite = true
      }
      console.log(self.opcion)
    }

    self.CargarFechas = function () {
      console.log('anio sel:', self.anio_sel)
      console.log('mes sel', self.mes_sel)
      self.Mostrar = true;
      self.periodo = false;
      self.sin_limite = false;
      if (self.anio_sel == undefined || self.mes_sel == undefined) {
        swal({
          title: 'Seleccione un mes y añio',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        })
      } else {
        self.buscarFechasParametrizada();
        console.log('fecha a parametrizar', self.fechaAParametrizar);
        console.log('Existe', self.fechaExiste)
        self.opcion = self.fechaAParametrizar.opcion;

      }


    };

    self.obtener_informacion_supervisor = function () {
      //Se realiza petición a servicio de academica que retorna la información del coordinador
      amazonAdministrativaRequest.get('informacion_proveedor', $.param({
        query: "NumDocumento:" + self.documento,
        limit: 0
      })).then(function (response) {
        //Información contratista
        self.info_supervisor = response.data;
        console.log('info supervisor', self.info_supervisor)
        self.nombre_supervisor = self.info_supervisor[0].NomProveedor;
      });
    };

    self.obtener_informacion_supervisor();

    self.obtenerDependenciasSupervisor = function () {
      contratoRequest.get('dependencias_supervisor', self.documento)
        .then(function (response) {
          if (response.data.dependencias.dependencia != undefined) {
            if (response.data.dependencias.dependencia.length != 0) {
              self.dependencia_supervisor = response.data.dependencias.dependencia[0];
              console.log('Dependencia supervisor', self.dependencia_supervisor);
              self.cargar_parametrizaciones();
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

    self.obtenerDependenciasSupervisor();

    self.cargar_parametrizaciones = function () {
      cumplidosCrudRequest.get('fechas_carga_cumplidos', $.param({
        limit: 0,
        query: 'Dependencia:' + self.dependencia_supervisor.codigo,
        sortby: '',
        order: '',
      })).then(function (response) {
        console.log('Fechas Parametrizadas', response)
        if (response.data.Data == null) {
          self.existenFechasParametrizadas = false;
        } else {
          self.existenFechasParametrizadas = true;
          self.fechas_parametrizadas = response.data.Data;
        }
      }, function (error) {
        swal({
          title: 'Ocurrio un error al traer los registros',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        }).then(function () {
          $window.location.href = '/#/';
        })
      })
    }

    self.buscarFechasParametrizada = function () {
      //supones que no existe
      self.fechaExiste = false;
      for (var index in self.fechas_parametrizadas) {
        var fecha = self.fechas_parametrizadas[index];
        console.log('fecha', fecha)
        console.log('comparacion', fecha.Anio == self.anio_sel && fecha.Mes == self.mes_sel)
        if (fecha.Anio == self.anio_sel && fecha.Mes == self.mes_sel) {
          self.fechaExiste = true;
          self.fechaAParametrizar = fecha;
          if (fecha.FechaInicio == "0001-01-01T00:00:00Z") {
            self.fechaAParametrizar.opcion = "no_periodo";
            self.sin_limite = true;
            self.fechaAParametrizar.FechaFin = null;
            self.fechaAParametrizar.FechaInicio = null;
          } else {
            self.fechaAParametrizar.opcion = "periodo";
            self.periodo = true;
            var ff = new Date(fecha.FechaFin.split('T')[0]);
            ff.setHours(24);
            self.fechaAParametrizar.FechaFin = ff
            var fi = new Date(fecha.FechaInicio.split('T')[0]);
            fi.setHours(24);
            self.fechaAParametrizar.FechaInicio = fi;
          }
        }
      }

      // en caso de que no existe
      if (!self.fechaExiste) {
        self.fechaAParametrizar = {
          DocumentoSupervisor: self.documento,
          FechaInicio: null,
          FechaFin: null,
          Anio: parseInt(self.anio_sel),
          Mes: parseInt(self.mes_sel),
          Dependencia: self.dependencia_supervisor.codigo
        }
      }
    };

    self.GuardarFechas = function () {
      if (self.opcion == "periodo" && (self.fechaAParametrizar.FechaInicio > self.fechaAParametrizar.FechaFin)) {
        swal({
          title: 'La fecha inicial no puede ser despues de la fecha final.',
          type: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        })
      } else {
        console.log('validacion', typeof self.fechaAParametrizar.FechaInicio)
        var fecha = {
          DocumentoSupervisor: parseInt(self.documento),
          Activo: true,
          Anio: parseInt(self.anio_sel),
          Mes: parseInt(self.mes_sel),
          Dependencia: self.dependencia_supervisor.codigo
        }
        if (self.opcion == "periodo") {
          self.fechaAParametrizar.FechaInicio.setHours(12);
          self.fechaAParametrizar.FechaFin.setHours(12);
          fecha.FechaInicio = self.fechaAParametrizar.FechaInicio;
          fecha.FechaFin = self.fechaAParametrizar.FechaFin;
        } else {
          fecha.FechaInicio = null;
          fecha.FechaFin = null;
        }

        if (!self.fechaExiste) {
          cumplidosCrudRequest.post('fechas_carga_cumplidos', angular.toJson(fecha)).then(function (response) {
            console.log("resultado post fechas", response)
            if (response.status == 201) {
              self.nuevoInforme = false;
              swal(
                'REGISTRO EXITOSO',
                'fue guardado con exito',
                'success'
              )
            } else {
              swal(
                'ERROR AL GUARDAR',
                'Ocurrio un problema al guardar el registro',
                'error'
              )
            }
          }).catch(
            function (error) {
              swal({
                title: 'Ocurrio un error al guardar la configuracion',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
              })
            }
          );
        } else {
          //endpoint para actualizar
          fecha.FechaModificacion = new Date();
          fecha.FechaCreacion = self.fechaAParametrizar.FechaCreacion;
          cumplidosCrudRequest.put('fechas_carga_cumplidos', self.fechaAParametrizar.Id, angular.toJson(fecha)).then(function (response) {
            console.log("resultado put fechas", response)
            if (response.status == 200) {
              self.nuevoInforme = false;
              swal(
                'REGISTRO EXITOSO',
                'fue guardado con exito',
                'success'
              )
            } else {
              swal(
                'ERROR AL GUARDAR',
                'Ocurrio un problema al guardar el registro',
                'error'
              )
            }
          }).catch(
            function (error) {
              //console.log(error)
              swal({
                title: 'Ocurrio un error al guardar la configuracion',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
              })
            }
          );
        }

        self.cargar_parametrizaciones();
      }
    }

  });