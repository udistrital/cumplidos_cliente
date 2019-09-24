'use strict';

describe('Controller: AprobacionOrdenadorCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));


  beforeEach(module(function ($provide) {
    // inyectamos del mock
      $provide.value('mockcontratoRequest', {'get': function (tabla, params) {
                return {
                success: function (callback) {
                  callback({
                   // some fake response
                   data:{ordenador:{nombre:"Pruebas"}}
                  });
                },
                then: function(callback) {
                   callback({
                   // some fake response, you probably would want that to be
                   // the same as for success 
                   data:{ordenador:{nombre:"Pruebas"}}
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

  var AprobacionOrdenadorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, mockcontratoRequest, mockadminMidRequest) {
    scope = $rootScope.$new();
    AprobacionOrdenadorCtrl = $controller('AprobacionOrdenadorCtrl', {
      $scope: scope, 
      contratoRequest: mockcontratoRequest,
      adminMidRequest: mockadminMidRequest
      // place here mocked dependencies
    });
  }));

  it('Debe tener un ordenador del gasto definido', function () {
    expect(AprobacionOrdenadorCtrl.ordenador).toBeDefined();
  });

  it('Debe tener un arreglo de solicitudes', function () {
    expect(AprobacionOrdenadorCtrl.documentos).toBeDefined();
  });
});
