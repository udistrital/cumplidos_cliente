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
  
    self=this;
    console.log('entro al contralador')

    self.anios=[];
    self.meses=[];
    self.Mostrar=false;
    self.existenFechasParametrizadas=false;
    self.documento = token_service.getAppPayload().documento;
    console.log('documento',self.documento)
    self.fechas_parametrizadas=[]
    
    console.log('meses',utils.getMeses())
    self.meses=utils.getMeses();
    self.hoy = new Date();

    self.inicializarAnios = function () {
      //Arreglo que contiene los años de los cuales se pueden ver cumplidos
      for (let index = 1; index >= 0; index--) {
          self.anios.push(self.hoy.getFullYear()-index)
      }
    };

    self.inicializarAnios();

    self.cambiarFormulario=function(){
      if(self.opcion=="periodo"){
        self.periodo=true
        self.sin_limite=false
      }else{
        self.periodo=false
        self.sin_limite=true
      }
      console.log(self.opcion)
    }

    self.CargarFechas=function(){
      console.log('anio sel:',self.anio_sel)
      console.log('mes sel', self.mes_sel)


    };

    self.obtener_informacion_supervisor = function () {
      //Se realiza petición a servicio de academica que retorna la información del coordinador
      amazonAdministrativaRequest.get('informacion_proveedor', $.param({
        query: "NumDocumento:" + self.documento,
        limit: 0
      })).then(function (response) {
        //Información contratista
        self.info_supervisor = response.data;
        console.log('info supervisor',self.info_supervisor)
        self.nombre_supervisor = self.info_supervisor[0].NomProveedor;
      });
    };

    self.obtener_informacion_supervisor();

    self.cargar_parametrizaciones=function(){
      cumplidosCrudRequest.get('fechas_carga_cumplidos',$.param({
        limit: 0,
        query: '',
        sortby:'',
        order:'',
        })).then(function (response) {
          console.log(response)
          if(response.data.Data==null){
            self.existenFechasParametrizadas=false;
          }else{
            self.existenFechasParametrizadas=true;
            self.fechas_parametrizadas=response.data.Data;
          }
        }, function (error) {
          swal({
            title: 'Error',
            text: 'Ocurrio un error al solicitar los registros',
            type: 'error',
          });
        })
    }

    self.obtenerDependenciasSupervisor = function () {
      contratoRequest.get('dependencias_supervisor', self.documento)
        .then(function (response) {
          self.dependencias_supervisor = response.data;
          console.log(self.dependencias_supervisor);
        });


    };

    self.obtenerDependenciasSupervisor();

    self.buscarFechasParametrizada=function(){

    };

    self.GuardarFechas=function(){

    }

});