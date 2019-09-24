'use strict';

describe('Service: homologacionDependenciaService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var homologacionDependenciaService;
  beforeEach(inject(function (_homologacionDependenciaService_) {
    homologacionDependenciaService = _homologacionDependenciaService_;
  }));

  it('should do something', function () {
    expect(!!homologacionDependenciaService).toBe(true);
  });

});
