'use strict';

describe('Controller: AprobacionCoordinadorCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var AprobacionCoordinadorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AprobacionCoordinadorCtrl = $controller('AprobacionCoordinadorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AprobacionCoordinadorCtrl.awesomeThings.length).toBe(3);
  });
});
