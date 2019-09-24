'use strict';

describe('Controller: SeguimientoycontrolFinancieroOrdenesPagoCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroOrdenesPagoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroOrdenesPagoCtrl = $controller('SeguimientoycontrolFinancieroOrdenesPagoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeguimientoycontrolFinancieroOrdenesPagoCtrl.awesomeThings.length).toBe(3);
  });
});
