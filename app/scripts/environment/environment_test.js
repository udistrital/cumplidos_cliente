'use strict';

/**
 * @ngdoc service
 * @name contractualClienteApp.config
 * @description
 * # config
 * Constant in the contractualClienteApp.
 */

angular.module('contractualClienteApp')
  .constant('CONF', {
    APP: "cumplidos",
    APP_MENU: "contratistas",
    GENERAL: {
      WSO2_SERVICE: "https://jbpm.udistritaloas.edu.co:8280/services",
      ADMINISTRATIVA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
      ADMINISTRATIVA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
      ADMINISTRATIVA_JBPM_V2: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v2/",
      ADMINISTRATIVA_PRUEBAS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
      CONFIGURACION_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
      CORE_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
      FINANCIERA_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_mid_api/v1/",
      FINANCIERA_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/financiera_crud_api/v1/",
      MODELS_SERVICE: "scripts/models/",
      NOTIFICACION_WS: "wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws/join",
      OIKOS_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/",
      CONTRATO_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v1/",
      NUXEO_SERVICE: "https://documental.portaloas.udistrital.edu.co/nuxeo/",
      NUXEO_MID: "https://autenticacion.portaloas.udistrital.edu.co/apioas/nuxeo_mid/v1/",
      CATEGORIA: "GAIA", //  GAIA - Gestión Administrativa, URANO - Gestión Académica, NIX - Gestión Financiera, ATHENEA - Analíticos
      TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID: "LG8BZ_EE87Qw2y3hAsAZKoDBvasa",
        REDIRECT_URL: "https://pruebascumplidos.portaloas.udistrital.edu.co",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "https://pruebascatalogo.portaloas.udistrital.edu.co",
        SIGN_OUT_APPEND_TOKEN: "true",
      },
    },
  });
