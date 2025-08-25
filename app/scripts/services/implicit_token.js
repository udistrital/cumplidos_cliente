'use strict';

if (!window.localStorage.getItem('access_token')) {
  var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
  while ((m = regex.exec(queryString)) !== null) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  if (params.id_token) {
    var expires_at = new Date();
    window.localStorage.setItem('access_token', params.access_token);
    window.localStorage.setItem('id_token', params.id_token);
    window.localStorage.setItem('state', params.state);
    window.localStorage.setItem('expires_in', params.expires_in);
    expires_at.setSeconds(expires_at.getSeconds() + parseInt(window.localStorage.getItem('expires_in')) - 40);
    window.localStorage.setItem('expires_at', expires_at);
  } else {
    window.localStorage.clear();
  }
}

angular.module('implicitToken', [])
  .factory('token_service', function ($q, CONF, md5, $interval, autenticacionMidRequest, $window, $rootScope) {
    var mem = {};
    var store = (function () {
      try { sessionStorage.setItem('__t','1'); sessionStorage.removeItem('__t'); return sessionStorage; }
      catch(e){ return { getItem:function(k){return mem[k]||null;}, setItem:function(k,v){mem[k]=v;}, removeItem:function(k){delete mem[k];} }; }
    })();

    var inFlightUserRol = null;
    var loginDataPromise = null;

    function tokenFingerprint() {
      var at = $window.localStorage.getItem('access_token') || '';
      return md5.createHash(at);
    }

    function rolesCacheValid() {
      var fp = store.getItem('roles_for_token');
      var code = store.getItem('access_code');
      var role = store.getItem('access_role');
      return !!fp && fp === tokenFingerprint() && !!code && !!role;
    }

    function saveRolesToCache(doc, role) {
      store.setItem('access_code', btoa(JSON.stringify(doc)));
      store.setItem('access_role', btoa(JSON.stringify(role)));
      store.setItem('roles_for_token', tokenFingerprint());
    }

    function clearRolesCache() {
      store.removeItem('access_code');
      store.removeItem('access_role');
      store.removeItem('roles_for_token');
    }

    function loginOnce() {
      if (store.getItem('auth_redirecting') === '1') return;
      store.setItem('auth_redirecting', '1');
      service.login();
    }

    var service = {
      header: null,
      token: null,
      logout_url: null,
      loaded_data: false,

      getLoginData: function(autoRedirect) {
        autoRedirect = !!autoRedirect;
        if (loginDataPromise) return loginDataPromise;

        var deferred = $q.defer();
        loginDataPromise = deferred.promise;

        if (!$window.localStorage.getItem('access_token')) {
          if (autoRedirect) loginOnce();
          deferred.resolve(true); loginDataPromise = null;
          return deferred.promise;
        }

        var raw = $window.localStorage.getItem('id_token');
        if (!raw) {
          if (autoRedirect) loginOnce();
          deferred.resolve(true); loginDataPromise = null;
          return deferred.promise;
        }

        var appUserInfo = {};
        try { appUserInfo = JSON.parse(atob(raw.split('.')[1])); }
        catch (e) {
          if (autoRedirect) loginOnce();
          deferred.resolve(true); loginDataPromise = null;
          return deferred.promise;
        }

        if (rolesCacheValid()) {
          deferred.resolve(true); loginDataPromise = null;
          return deferred.promise;
        }

        var needsUserRol = (
          (appUserInfo.role === null || appUserInfo.role === undefined) &&
          (appUserInfo.documento === null || appUserInfo.documento === undefined) &&
          (appUserInfo.email != null && appUserInfo.email != undefined)
        );

        if (needsUserRol) {
          if (!inFlightUserRol) {
            inFlightUserRol = autenticacionMidRequest.post('token/userRol', { user: appUserInfo.email }, {
              headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + $window.localStorage.getItem('access_token'),
              }
            })
            .then(function (resp) {
              saveRolesToCache(resp.data.documento, resp.data.role);
              service.setExpiresAt && service.setExpiresAt();
              service.timer && service.timer();
              $rootScope.$broadcast('auth:rolesLoaded', resp.data);
              deferred.resolve(true);
            })
            .catch(function () { deferred.reject(false); })
            .finally(function () {
              inFlightUserRol = null;
              loginDataPromise = null;
            });
          } else {
            inFlightUserRol.then(function(){ deferred.resolve(true); })
                           .catch(function(){ deferred.reject(false); })
                           .finally(function(){ loginDataPromise = null; });
          }
        } else {
          deferred.resolve(true);
          loginDataPromise = null;
        }

        return deferred.promise;
      },

      generateState: function () {
        var text = ((Date.now() + Math.random()) * Math.random()).toString().replace('.', '');
        return md5.createHash(text);
      },

      setting_bearer: { headers: {} },

      getHeader: function () {
        service.setting_bearer = {
          headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + $window.localStorage.getItem('access_token'),
            "Content-Type": "application/json",
          }
        };
        return service.setting_bearer;
      },

      login: function () {
        if (!CONF.GENERAL.TOKEN.nonce) CONF.GENERAL.TOKEN.nonce = service.generateState();
        if (!CONF.GENERAL.TOKEN.state) CONF.GENERAL.TOKEN.state = service.generateState();
        var base = CONF.GENERAL.TOKEN.AUTORIZACION_URL || CONF.GENERAL.TOKEN.AUTORIZATION_URL;
        var url = base + '?' +
          'client_id=' + encodeURIComponent(CONF.GENERAL.TOKEN.CLIENTE_ID) + '&' +
          'redirect_uri=' + encodeURIComponent(CONF.GENERAL.TOKEN.REDIRECT_URL) + '&' +
          'response_type=' + encodeURIComponent(CONF.GENERAL.TOKEN.RESPONSE_TYPE) + '&' +
          'scope=' + encodeURIComponent(CONF.GENERAL.TOKEN.SCOPE);
        if (CONF.GENERAL.TOKEN.nonce) url += '&nonce=' + encodeURIComponent(CONF.GENERAL.TOKEN.nonce);
        url += '&state=' + encodeURIComponent(CONF.GENERAL.TOKEN.state);
        $window.location = url;
        return url;
      },

      live_token: function () {
        if ($window.localStorage.getItem('id_token') === 'undefined' ||
            !$window.localStorage.getItem('id_token') || service.logoutValid()) {
          return false;
        } else {
          service.setting_bearer = {
            headers: {
              'Accept': 'application/json',
              "Authorization": "Bearer " + $window.localStorage.getItem('access_token'),
            }
          };
          service.logout_url = CONF.GENERAL.TOKEN.SIGN_OUT_URL;
          service.logout_url += '?id_token_hint=' + $window.localStorage.getItem('id_token');
          service.logout_url += '&post_logout_redirect_uri=' + CONF.GENERAL.TOKEN.SIGN_OUT_REDIRECT_URL;
          service.logout_url += '&state=' + $window.localStorage.getItem('state');
          return true;
        }
      },

      getPayload: function () {
        var id_token = $window.localStorage.getItem('id_token').split('.');
        return JSON.parse(atob(id_token[1]));
      },

      getAppPayload: function() {
        var id_token = $window.localStorage.getItem('id_token').split('.');
        var access_code = store.getItem('access_code');
        var access_role = store.getItem('access_role');
        var data = angular.fromJson(atob(id_token[1]));
        if (!data.documento && access_code) data.documento = angular.fromJson(atob(access_code));
        if (!data.role && access_role) data.role = angular.fromJson(atob(access_role));
        return data;
      },

      logout: function () {
        store.removeItem('auth_redirecting');
        clearRolesCache();
        store.removeItem('expires_at');
        $window.localStorage.clear();
        $window.location.replace("/");
      },

      expired: function () {
        var ea = store.getItem('expires_at');
        return (ea && new Date(ea) < new Date());
      },

      setExpiresAt: function () {
        if (!store.getItem('expires_at')) {
          var expires_at = new Date();
          var ei = parseInt($window.localStorage.getItem('expires_in')) || 3600;
          expires_at.setSeconds(expires_at.getSeconds() + ei - 40);
          store.setItem('expires_at', expires_at);
        }
      },

      timer: function () {
        if (store.getItem('expires_at') && store.getItem('expires_at') !== 'Invalid Date') {
          var mostrado = false;
          $interval(function () {
            var restante = new Date(); restante.setMinutes(restante.getMinutes() + 5);
            var ea = store.getItem('expires_at');
            if (ea && new Date(ea) < restante && !mostrado){
              mostrado = true;
              swal({
                title: 'Su sesión caducará pronto, por favor asegúrese de guardar todos los cambios',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
              });
            } else if (service.expired()) {
              swal({
                title: 'Su sesión ha caducado, por favor vuelva a ingresar',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
              }).then(function () {
                loginOnce();
              });
            }
          }, 5000);
        }
      },

      logoutValid: function () {
        var state, valid, queryString = location.search.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
        while (!!(m = regex.exec(queryString))) { state = decodeURIComponent(m[2]); }
        if ($window.localStorage.getItem('state') === state) {
          service.clearStorage(); valid = true;
        } else valid = false;
        return valid;
      },

      clearStorage: function () {
        clearRolesCache();
        store.removeItem('expires_at');
        $window.localStorage.removeItem('access_token');
        $window.localStorage.removeItem('id_token');
        $window.localStorage.removeItem('expires_in');
        $window.localStorage.removeItem('state');
      }
    };

    service.timer();
    store.removeItem('auth_redirecting');
    return service;
  });
