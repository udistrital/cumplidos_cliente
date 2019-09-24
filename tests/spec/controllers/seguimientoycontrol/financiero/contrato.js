'use strict';

describe('Controller: SeguimientoycontrolFinancieroContratoCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroContratoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroContratoCtrl = $controller('SeguimientoycontrolFinancieroContratoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('Verificar si se estan reseteando las ordenes, disponibilidades y registros', function () {
    expect(SeguimientoycontrolFinancieroContratoCtrl.orden.length).toBe(0);
    expect(SeguimientoycontrolFinancieroContratoCtrl.disponibilidad.length).toBe(0);
    expect(SeguimientoycontrolFinancieroContratoCtrl.registro.length).toBe(0);
  });
});
