'use strict';

describe('Controller: SeguimientoycontrolFinancieroEstadisticasCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var SeguimientoycontrolFinancieroEstadisticasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SeguimientoycontrolFinancieroEstadisticasCtrl = $controller('SeguimientoycontrolFinancieroEstadisticasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SeguimientoycontrolFinancieroEstadisticasCtrl.awesomeThings.length).toBe(3);
  });
});
