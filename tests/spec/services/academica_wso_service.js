'use strict';

describe('Service: academicaWsoService', function () {

  // load the service's module
  beforeEach(module('contractualClienteApp'));

  // instantiate service
  var academicaWsoService;
  beforeEach(inject(function (_academicaWsoService_) {
    academicaWsoService = _academicaWsoService_;
  }));

  it('should do something', function () {
    expect(!!academicaWsoService).toBe(true);
  });

});
