'use strict';

/**
 * @ngdoc overview
 * @name implicitToken
 * @description
 * # implicitToken
 * Service in the implicitToken.
 */
// First, parse the query string
if (window.localStorage.getItem('access_token') === null ||
  window.localStorage.getItem('access_token') === undefined) {
  var params = {},
    queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g;
  var m;
  while ((m = regex.exec(queryString)) !== null) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  // And send the token over to the server
  var req = new XMLHttpRequest();
  // consider using POST so query isn't logged
  var query = 'https://' + window.location.host + '?' + queryString;
  //
  req.open('GET', query, true);
  if (params.id_token !== null && params.id_token !== undefined) {
    var expires_at = new Date();
    //console.log('id_token inicial: ',params.id_token)
    window.localStorage.setItem('access_token', params.access_token);
    window.localStorage.setItem('id_token', params.id_token);
    window.localStorage.setItem('state', params.state);
    window.localStorage.setItem('expires_in', params.expires_in);
    expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in')) - 40); // 40 seconds less to secure browser and response latency
    window.localStorage.setItem('expires_at', expires_at);
  } else {
    window.localStorage.clear();
  }
  req.onreadystatechange = function (e) {
    if (req.readyState === 4) {
      if (req.status === 200) {
        //
      } else if (req.status === 400) {

      } else {

      }
    }
  };
}

angular.module('inactivityModule', [])
  .service('inactivityService', ['$rootScope', '$timeout', '$window', function ($rootScope, $timeout, $window) {
    var inactivityTimeout;
    var inactivityTime = 1800000; // 30 minutes

    function startInactivityTimer() {
      inactivityTimeout = $timeout(function () {
        $rootScope.$broadcast('inactivityEvent');
      }, inactivityTime);
    }

    function resetInactivityTimer() {
      if (inactivityTimeout) {
        $timeout.cancel(inactivityTimeout);
      }
      startInactivityTimer();
    }

    this.init = function () {
      startInactivityTimer();
      angular.element($window.document).on('mousemove click keydown', function () {
        resetInactivityTimer();
      });
    };
  }]);

angular.module('implicitToken', ['inactivityModule'])
  .factory('token_service', ['$q', 'CONF', 'md5', '$interval', 'autenticacionMidRequest', 'inactivityService',
    function ($q, CONF, md5, $interval, autenticacionMidRequest, inactivityService) {

      var service = {
        //session: $localStorage.default(params),
        header: null,
        token: null,
        logout_url: null,
        loaded_data: false,
        getLoginData: function () {
          //Para  llamar el api de autenticacion
          var deferred = $q.defer();
          if (window.localStorage.getItem('access_token') !== null &&
            window.localStorage.getItem('access_token') !== undefined) {
            //console.log('access_code existe',window.localStorage.getItem('access_code'))
            if (window.localStorage.getItem('access_code') === null ||
              window.localStorage.getItem('access_code') === undefined) {
              var appUserInfo = JSON.parse(atob(window.localStorage.getItem('id_token').split('.')[1]));
              var appUserDocument;
              var appUserRole;
              var userRol = {
                user: appUserInfo.email
              };
              //console.log('entro ',appUserInfo)
              //console.log((appUserInfo.role===null ||appUserInfo.role===undefined) &&(appUserInfo.documento===null ||appUserInfo.documento===undefined) && (appUserInfo.email!=null && appUserInfo.email!=undefined))
              if ((appUserInfo.role === null || appUserInfo.role === undefined) && (appUserInfo.documento === null || appUserInfo.documento === undefined) && (appUserInfo.email != null && appUserInfo.email != undefined)) {
                autenticacionMidRequest.post("token/userRol", userRol, {
                  headers: {
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
                  }
                })
                  .then(function (respuestaAutenticacion) {
                    appUserDocument = respuestaAutenticacion.data.documento;

                    appUserRole = respuestaAutenticacion.data.role;
                    //console.log('respuesta autenticacion',appUserDocument,appUserRole)
                    window.location.reload();
                    window.localStorage.setItem('access_code', btoa(JSON.stringify(appUserDocument)));
                    window.localStorage.setItem('access_role', btoa(JSON.stringify(appUserRole)));
                    // setExpiresAt();
                    // timer();
                    //
                    deferred.resolve(true);
                  })
                  .catch(function (excepcionAutenticacion) {
                    //console.log("fallo la autenticacion");
                    //service.logout();
                  });
              } else {
                deferred.resolve(true);
              }
            } else {
              deferred.resolve(true);
            }
          } else {
            deferred.resolve(true);
          }
          return deferred.promise;
        },
        generateState: function () {
          var text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
          return md5.createHash(text);
        },
        setting_bearer: {
          headers: {}
        },
        getHeader: function () {
          service.setting_bearer = {
            headers: {
              'Accept': 'application/json',
              "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
              "Content-Type": "application/json",
            }
          };
          return service.setting_bearer;
        },
        login: function () {
          if (!CONF.GENERAL.TOKEN.nonce) {
            CONF.GENERAL.TOKEN.nonce = service.generateState();
          }
          if (!CONF.GENERAL.TOKEN.state) {
            CONF.GENERAL.TOKEN.state = service.generateState();
          }
          var url = CONF.GENERAL.TOKEN.AUTORIZATION_URL + '?' +
            'client_id=' + encodeURIComponent(CONF.GENERAL.TOKEN.CLIENTE_ID) + '&' +
            'redirect_uri=' + encodeURIComponent(CONF.GENERAL.TOKEN.REDIRECT_URL) + '&' +
            'response_type=' + encodeURIComponent(CONF.GENERAL.TOKEN.RESPONSE_TYPE) + '&' +
            'scope=' + encodeURIComponent(CONF.GENERAL.TOKEN.SCOPE);
          if (CONF.GENERAL.TOKEN.nonce) {
            url += '&nonce=' + encodeURIComponent(CONF.GENERAL.TOKEN.nonce);
          }
          url += '&state=' + encodeURIComponent(CONF.GENERAL.TOKEN.state);
          window.location = url;
          return url;
        },
        live_token: function () {
          if (window.localStorage.getItem('id_token') === 'undefined' || window.localStorage.getItem('id_token') === null || service.logoutValid()) {
            //service.login();
            return false;
          } else {
            service.setting_bearer = {
              headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
              }
            };
            service.logout_url = CONF.GENERAL.TOKEN.SIGN_OUT_URL;
            service.logout_url += '?id_token_hint=' + window.localStorage.getItem('id_token');
            service.logout_url += '&post_logout_redirect_uri=' + CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
            service.logout_url += '&state=' + window.localStorage.getItem('state');
            return true;
          }
        },
        getPayload: function () {
          var id_token = window.localStorage.getItem('id_token').split('.');
          return JSON.parse(atob(id_token[1]));
        },
        getAppPayload: function () {

          var id_token = window.localStorage.getItem('id_token').split('.');
          var access_code = window.localStorage.getItem('access_code');
          var access_role = window.localStorage.getItem('access_role');
          var data = angular.fromJson(atob(id_token[1]));
          //console.log('access_code:',access_code,'access_role: ',access_role);
          if (!data.documento) {
            data.documento = angular.fromJson(atob(access_code));
          }
          if (!data.role) {
            data.role = angular.fromJson(atob(access_role));
          }
          //console.log('data:',data)
          return data;
        },
        logout: function () {
          window.localStorage.clear();
          window.location.replace("/");
          // console.log(service.logout_url);
          // se elimina el redirect
          // window.location.replace(service.logout_url);
        },
        // expired: function () {
        //   return (window.localStorage.getItem('expires_at') !== null && new Date(window.localStorage.getItem('expires_at')) < new Date());
        // },

        // setExpiresAt: function () {
        //   if (angular.isUndefined(window.localStorage.getItem('expires_at')) || window.localStorage.getItem('expires_at') === null) {
        //     var expires_at = new Date();
        //     expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in')) - 40); // 40 seconds less to secure browser and response latency
        //     window.localStorage.setItem('expires_at', expires_at);
        //   }
        // },

        // timer: function () {
        //   if (!angular.isUndefined(window.localStorage.getItem('expires_at')) || window.localStorage.getItem('expires_at') === null || window.localStorage.getItem('expires_at') === 'Invalid Date') {
        //     var mostrado = false
        //     $interval(function () {
        //       var restante = new Date()
        //       restante.setMinutes(restante.getMinutes() + 5)
        //       if (window.localStorage.getItem('expires_at') !== null && new Date(window.localStorage.getItem('expires_at')) < restante && !mostrado) {
        //         mostrado = true
        //         swal({
        //           title: 'Su sesión caducará pronto, por favor asegurese de guardar todos los cambios',
        //           type: 'error',
        //           showCancelButton: false,
        //           confirmButtonColor: '#d33',
        //           confirmButtonText: 'Aceptar'
        //         })
        //       } else if (service.expired()) {
        //         swal({
        //           title: 'Su sesión ha caducado, por favor vuelva a ingresar',
        //           type: 'error',
        //           showCancelButton: false,
        //           confirmButtonColor: '#d33',
        //           confirmButtonText: 'Aceptar'
        //         }).then(function () {
        //           service.logout();
        //         })
        //       }
        //     }, 5000);
        //   } else {
        //     window.location.reload();
        //   }
        // },

        logoutValid: function () {
          var state;
          var valid;
          var queryString = location.search.substring(1);
          var regex = /([^&=]+)=([^&]*)/g;
          var m;
          while (!!(m = regex.exec(queryString))) {
            state = decodeURIComponent(m[2]);
          }
          if (window.localStorage.getItem('state') === state) {
            service.clearStorage();
            valid = true;
          } else {
            valid = false;
          }
          return valid;
        },
        clearStorage: function () {
          window.localStorage.removeItem('access_token');
          window.localStorage.removeItem('id_token');
          window.localStorage.removeItem('expires_in');
          window.localStorage.removeItem('state');
          window.localStorage.removeItem('expires_at');
        }
      };
      //service.setExpiresAt();
      inactivityService.init();
      return service;
    }
  ]);

angular.module('implicitToken').run(['$rootScope', 'token_service', function ($rootScope, token_service) {
  $rootScope.$on('inactivityEvent', function () {
    // 
    token_service.logout();
  });
}]);