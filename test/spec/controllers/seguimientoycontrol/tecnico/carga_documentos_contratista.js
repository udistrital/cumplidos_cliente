'use strict';

describe('Controller: CargaDocumentosContratistaCtrl', function () {

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
                   data:[{NumDocumentoSupervisor:123 }]
                  });
                },
                then: function(callback) {
                   callback({
                   // some fake response, you probably would want that to be
                   // the same as for success 
                   data:[{NumDocumentoSupervisor:123 }]
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

  var cargaDocumentosContratistaCtrl,
    scope, $httpBackend, $adminMidRequest, contratos_contratista_handler, CONF ;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$injector, mockamazonAdministrativaRequest, mockadminMidRequest) {
    scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    $adminMidRequest=$injector.get('$httpBackend');
    CONF = $injector.get('CONF');

    $httpBackend.when('GET','informacion_proveedor/?query=NumDocumento%3A123&limit=0')
    .respond({num:1});

    $httpBackend.when('GET',CONF.GENERAL.ADMINISTRATIVA_MID_SERVICE+'aprobacion_pago/contratos_contratista/123')
    .respond([{num:1}]);

    cargaDocumentosContratistaCtrl = $controller('cargaDocumentosContratistaCtrl', {
      $scope: scope,
      amazonAdministrativaRequest: mockamazonAdministrativaRequest,
      adminMidRequest: mockadminMidRequest
      // place here mocked dependencies
    });

  }));



  it('Debe obtener un arreglo con el año actual y el anterior', function () {
    cargaDocumentosContratistaCtrl.solicitar_pago();

    expect(cargaDocumentosContratistaCtrl.anios).toEqual([new Date().getFullYear(),new Date().getFullYear()-1]);
  });

  it('Debe obtener una lista con los 12 meses', function () {
    cargaDocumentosContratistaCtrl.getMeses(2017);
    expect(cargaDocumentosContratistaCtrl.meses.length).toBe(12);
  });

  it('Debe obtener una lista con los meses desde el inicio de año hasta el actual', function () {
    cargaDocumentosContratistaCtrl.getMeses(2018);
    expect(cargaDocumentosContratistaCtrl.meses.length).toBe(12);
  });

  it('Debe obtener un arreglo de objetos con la información del contratista', function () {
  
    cargaDocumentosContratistaCtrl.obtener_informacion_contratista();

    expect(cargaDocumentosContratistaCtrl.info_contratista).toEqual([{NomProveedor:"Pruebas"}]);

   });

  it('Debe obtener un arreglo de contratos del contratista', function () {
    cargaDocumentosContratistaCtrl.obtener_informacion_contratos_contratista();
   expect(cargaDocumentosContratistaCtrl.informacion_contratos).toEqual([{NumDocumentoSupervisor:123 }]);

  });

});
