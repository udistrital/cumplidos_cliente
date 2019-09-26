'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.config
 * @description
 * # config
 * Constant in the contractualClienteApp.
 */
var conf_cloud = {
  WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
  ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/administrativa_mid_api/v1/",
  ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/administrativa_crud_api/v1/",
  ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/administrativa_amazon_api/v1/",
  CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/configuracion_crud_api/v1/",
  CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/api/core_api/v1/",
  FINANCIERA_MID_SERVICE: "https://tuleap.udistrital.edu.co/go_api/financiera_mid_api/v1/",
  FINANCIERA_SERVICE: "https://tuleap.udistrital.edu.co/go_api/financiera_api/v1/",
  MODELS_SERVICE: "scripts/models/",
  NOTIFICACION_WS: "ws://10.20.2.134:8080/ws/join",
  OIKOS_SERVICE: "https://tuleap.udistrital.edu.co/go_api/oikos_api/v1/",
  CONTRATO_SERVICE: "https://autenticacion.udistrital.edu.co:8244/administrativa_jbpm/v1/",
  NUXEO_SERVICE: "https://documental.portaloas.udistrital.edu.co/nuxeo/",
  TOKEN: {
    AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
    URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
    CLIENTE_ID: "pszmROXqfec4pTShgF_fn2DAAX0a",
    REDIRECT_URL: "http://localhost:9000/",
    RESPONSE_TYPE: "id_token token",
    SCOPE: "openid email documento",
    BUTTON_CLASS: "btn btn-warning btn-sm",
    SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
    SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
    SIGN_OUT_APPEND_TOKEN: "true",
  },
  MENU_APP: [{
    id: "kronos",
    title: "KRONOS",
    url: "http://10.20.0.254/kronos"
  }, {
    id: "agora",
    title: "AGORA",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/agora"
  },
  {
    id: "argo",
    title: "ARGO",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/argo"
  },
  {
    id: "arka",
    title: "ARKA",
    url: "https://tpruebasfuncionarios.intranetoas.udistrital.edu.co/arka"
  },
  {
    id: "temis",
    title: "TEMIS",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
  },
  {
    id: "polux",
    title: "POLUX",
    url: "http://10.20.0.254/polux"
  },
  {
    id: "jano",
    title: "JANO",
    url: "http://10.20.0.254/kronos"
  },
  {
    id: "kyron",
    title: "KYRON",
    url: "http://10.20.0.254/kronos"
  },
  {
    id: "sga",
    title: "SGA",
    url: "http://10.20.0.254/kronos"
  }
  ]
};

var conf_test = {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
    ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
    CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
    CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
    FINANCIERA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8089/v1/",
    FINANCIERA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_crud_api/v1/",
    MODELS_SERVICE: "scripts/models/",
    NOTIFICACION_WS: "ws://pruebasapi.intranetoas.udistrital.edu.co:8116/ws/join",
    OIKOS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
    CONTRATO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/",
    NUXEO_SERVICE: "https://documental.portaloas.udistrital.edu.co/nuxeo/",
    TOKEN: {
      AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
      URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
      CLIENTE_ID: "LG8BZ_EE87Qw2y3hAsAZKoDBvasa",
      REDIRECT_URL: "https://pruebascumplidos.portaloas.udistrital.edu.co",
      RESPONSE_TYPE: "id_token token",
      SCOPE: "openid email documento",
      BUTTON_CLASS: "btn btn-warning btn-sm",
      SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
      SIGN_OUT_REDIRECT_URL: "https://pruebascumplidos.portaloas.udistrital.edu.co",
      SIGN_OUT_APPEND_TOKEN: "true",
    },
    MENU_APP: [{
      id: "kronos",
      title: "KRONOS",
      url: "http://10.20.0.254/kronos"
    },
    {
      id: "argo",
      title: "ARGO",
      url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/argo"
    },
    {
      id: "arka",
      title: "ARKA",
      url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/arka"
    },
    {
      id: "temis",
      title: "TEMIS",
      url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
    },
    {
      id: "polux",
      title: "POLUX",
      url: "http://10.20.0.254/polux"
    },
    {
      id: "jano",
      title: "JANO",
      url: "http://10.20.0.254/kronos"
    },
    {
      id: "kyron",
      title: "KYRON",
      url: "http://10.20.0.254/kronos"
    },
    {
      id: "sga",
      title: "SGA",
      url: "http://10.20.0.254/kronos"
    }
    ]
  };



var conf_local = {
  WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
  ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
  ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
  ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
  CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
  CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
  FINANCIERA_MID_SERVICE: "http://pruebasapi.intranetoas.udistrital.edu.co:8089/v1/",
  FINANCIERA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_crud_api/v1/",
  MODELS_SERVICE: "scripts/models/",
  NOTIFICACION_WS: "ws://pruebasapi.intranetoas.udistrital.edu.co:8116/ws/join",
  OIKOS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
  CONTRATO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/",
  NUXEO_SERVICE: "https://documental.portaloas.udistrital.edu.co/nuxeo/",
  TOKEN: {
    AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
    URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
    CLIENTE_ID: "sWe9_P_C76DWGOsLcOY4T7BYH6oa",
    REDIRECT_URL: "http://localhost:9000/",
    RESPONSE_TYPE: "id_token token",
    SCOPE: "openid email documento",
    BUTTON_CLASS: "btn btn-warning btn-sm",
    SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
    SIGN_OUT_REDIRECT_URL: "http://localhost:9000/",
    SIGN_OUT_APPEND_TOKEN: "true",
  },
  MENU_APP: [{
    id: "kronos",
    title: "KRONOS",
    url: "http://10.20.0.254/kronos"
  },
  {
    id: "argo",
    title: "ARGO",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/argo"
  },
  {
    id: "arka",
    title: "ARKA",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/arka"
  },
  {
    id: "temis",
    title: "TEMIS",
    url: "https://pruebasfuncionarios.intranetoas.udistrital.edu.co/gefad"
  },
  {
    id: "polux",
    title: "POLUX",
    url: "http://10.20.0.254/polux"
  },
  {
    id: "jano",
    title: "JANO",
    url: "http://10.20.0.254/kronos"
  },
  {
    id: "kyron",
    title: "KYRON",
    url: "http://10.20.0.254/kronos"
  },
  {
    id: "sga",
    title: "SGA",
    url: "http://10.20.0.254/kronos"
  }
  ]
};

angular.module('contractualClienteApp')
  .constant('CONF', {
    GENERAL: conf_test
  });
