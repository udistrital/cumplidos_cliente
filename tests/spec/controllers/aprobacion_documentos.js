'use strict';

describe('Controller: AprobacionDocumentosCtrl', function () {

  // load the controller's module
  beforeEach(module('contractualClienteApp'));

  var AprobacionDocumentosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AprobacionDocumentosCtrl = $controller('AprobacionDocumentosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AprobacionDocumentosCtrl.awesomeThings.length).toBe(3);
  });
});
