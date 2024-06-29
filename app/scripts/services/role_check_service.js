angular.module('contractualClienteApp').factory('RoleCheckService', ['$location', '$q', 'token_service', function($location, $q, token_service) {
    var RoleCheckService = {};

    RoleCheckService.checkRole = function(roles) {
        var deferred = $q.defer();

        var playLoad = token_service.getPayload();

        var userRoles = playLoad.role;

        if(!playLoad || !playLoad.role){

            $location.path("/");
            deferred.reject();
            return deferred.promise;
        }

        var hasPermission = roles.some(function(role) {
            return userRoles.includes(role);
        });

        console.log("Has Permission:", hasPermission);

        if (hasPermission) {
            deferred.resolve();
        } else {
            $location.path('/');
            deferred.reject();
        }

        return deferred.promise;
    };

    return RoleCheckService;
}]);
