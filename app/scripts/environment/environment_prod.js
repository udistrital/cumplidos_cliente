"use strict";

// Reemplace contractualClienteApp por el nombre del módulo de la aplicación principal

/**
 * @ngdoc service
 * @name contractualClienteApp.config
 * @description
 * # config
 * Constant in the contractualClienteApp.
 */

angular.module("contractualClienteApp").constant("CONF", {
  APP: "cumplidos", // Nombre de la app, esto cargará el logo.
  APP_MENU: "contratistas", // Ingrese valor de la aplicación asociado al menú registrado en wso2
  GENERAL: {
    WSO2_SERVICE: "http://jbpm.udistritaloas.edu.co:8280/services",
    ADMINISTRATIVA_MID_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_mid_api/v1/",
    ADMINISTRATIVA_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_crud_api/v1/",
    CUMPLIDOS_CRUD_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/cumplidos_crud/v1/",
    CUMPLIDOS_MID_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/cumplidos_mid/v2/",
    ADMINISTRATIVA_JBPM_V2:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_jbpm/v2/",
    ADMINISTRATIVA_PRUEBAS_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/",
    CONFIGURACION_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/",
    CORE_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/core_api/v1/",
    DOCUMENTO_CRUD_SERVICE:
      "https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/",
    NOTIFICACION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/notificacion_mid/v1/",
    ARM_AWS_NOTIFICACIONES:"arn:aws:sns:us-east-1:699001025740:production-Cumplidos",
    GESTION_DOCUMENTAL_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1",
    AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/",
    MODELS_SERVICE: "scripts/models/",
    TOKEN: {
      AUTORIZATION_URL:
        "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
      URL_USER_INFO:
        "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
      CLIENTE_ID: "YM3WYl4Q0EujfkNkqeBlH7KvIpsa",
      REDIRECT_URL: "https://contratistas.portaloas.udistrital.edu.co",
      RESPONSE_TYPE: "id_token token",
      SCOPE: "openid email documento",
      BUTTON_CLASS: "btn btn-custom btn-sm",
      SIGN_OUT_URL:
        "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
      SIGN_OUT_REDIRECT_URL: "https://contratistas.portaloas.udistrital.edu.co",
      SIGN_OUT_APPEND_TOKEN: "true"
    }
  }
});
