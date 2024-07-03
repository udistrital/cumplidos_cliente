angular.module('contractualClienteApp')
  .factory('NavigationService', ['$rootScope', function($rootScope) {
    var internalNavigation = false;

 
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      internalNavigation = true; 
    });

    console.log("Se ejecutoEl service");


    function checkNavigation() {
      return internalNavigation;
    }

    return {
      checkNavigation: checkNavigation
    };
  }]);