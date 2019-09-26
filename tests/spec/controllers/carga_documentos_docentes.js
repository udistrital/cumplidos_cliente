'use strict';

describe('Controller: CargaDocumentosDocentesCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var CargaDocumentosDocentesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CargaDocumentosDocentesCtrl = $controller('CargaDocumentosDocentesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CargaDocumentosDocentesCtrl.awesomeThings.length).toBe(3);
  });
});
