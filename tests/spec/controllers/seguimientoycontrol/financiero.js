'use strict';

describe('Controller: SeguimientoycontrolFinancieroCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroCtrl = $controller('SeguimientoycontrolFinancieroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('Verificar si se estan reseteando las ordenes, disponibilidades y registros', function () {
    expect(SeguimientoycontrolFinancieroCtrl.orden.length).toBe(0);
    expect(SeguimientoycontrolFinancieroCtrl.disponibilidad.length).toBe(0);
    expect(SeguimientoycontrolFinancieroCtrl.registro.length).toBe(0);
  });

});
