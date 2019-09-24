'use strict';

describe('Controller: AprobacionSupervisorCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  beforeEach(module(function ($provide) {
    // inyectamos del mock
      $provide.value('mockamazonAdministrativaRequest', {'get': function (tabla, params) {
                return {
                success: function (callback) {
                  callback({
                   // some fake response
                   data:[{NomProveedor:"Pruebas"}]
                  });
                },
                then: function(callback) {
                   callback({
                   // some fake response, you probably would want that to be
                   // the same as for success 
                   data:[{NomProveedor:"Pruebas"}]
                   });
                },
                error: function(callback){
                  callback({
                   // some fake response
                   data:null
                  });             
                }
              }
          }});
  }));



  beforeEach(module(function ($provide) {
    // inyectamos del mock
      $provide.value('mockadminMidRequest', {'get': function (tabla, params) {
                return {
                success: function (callback) {
                  callback({
                   // some fake response
                   data:[{A:1},{A:2}]
                  });
                },
                then: function(callback) {
                   callback({
                   // some fake response, you probably would want that to be
                   // the same as for success 
                   data:[{A:1},{A:2}]
                   });
                },
                error: function(callback){
                  callback({
                   // some fake response
                   data:null
                  });             
                }
              }
          }});
  }));


  var AprobacionSupervisorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockamazonAdministrativaRequest) {
    scope = $rootScope.$new();
    AprobacionSupervisorCtrl = $controller('AprobacionSupervisorCtrl', {
      $scope: scope,
      amazonAdministrativaRequest: mockamazonAdministrativaRequest
        });

  }));


  it('Se debe tener un arreglo con 12 meses', function () {

    expect(AprobacionSupervisorCtrl.meses.length).toBe(12);
  });

  it('Se debe tener el objeto del grid definido', function () {

    expect(AprobacionSupervisorCtrl.gridOptions1).toBeDefined(true);
  });


  it('Debe obtener un arreglo de objetos con la información del supervisor', function () {
  
    AprobacionSupervisorCtrl.obtener_informacion_supervisor(123);

    expect(AprobacionSupervisorCtrl.info_supervisor).toEqual([{NomProveedor:"Pruebas"}]);
    expect(AprobacionSupervisorCtrl.nombre_supervisor).toEqual("Pruebas");

   });



});
