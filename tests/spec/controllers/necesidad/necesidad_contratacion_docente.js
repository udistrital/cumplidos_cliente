'use strict';

describe('Controller: NecesidadContratacionDocenteCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var NecesidadNecesidadContratacionDocenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NecesidadContratacionDocenteCtrl = $controller('NecesidadContratacionDocenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NecesidadContratacionDocenteCtrl.awesomeThings.length).toBe(3);
  });
});
