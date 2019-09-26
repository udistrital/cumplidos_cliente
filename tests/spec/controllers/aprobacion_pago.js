'use strict';

describe('Controller: AprobacionPagoCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var AprobacionPagoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AprobacionPagoCtrl = $controller('AprobacionPagoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AprobacionPagoCtrl.awesomeThings.length).toBe(3);
  });
});
