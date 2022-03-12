'use strict';

/**
 * @ngdoc overview
 * @name contractualClienteApp
 * @description
 * # contractualClienteApp
 *
 * Main module of the application.
 */
angular
    .module('contractualClienteApp', [
        // Librerias
        'ngCookies',
        'angular-loading-bar',
        'angular-md5',
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        //'ngSanitize',
        'afOAuth2',
        'treeControl',
        'ngMaterial',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.treeView',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.exporter',
        'ui.grid.autoResize',
        'ui.grid.exporter',
        'ui.grid.expandable',
        'ui.grid.pinning',
        'ngStorage',
        'ngWebSocket',
        'angularMoment',
        'ui.utils.masks',
        'pascalprecht.translate',
        'nvd3',
        'ui.knob',
        'file-model',
        'angularBootstrapFileinput',
        // Servicios
        'financieraService',
        'coreService',
        'documentoService',
        'administrativaService',
        'cumplidosCrudService',
        'cumplidosMidService',
        'agoraService',
        'oikosService',
        'financieraMidService',
        'adminMidService',
        'gestorDocumentalMidService',
        'adminJbpmV2Service',
        'amazonAdministrativaService',
        'contratoService',
        'gridOptionsService',
        'configuracionService',
        'requestService',
        'implicitToken',
        'gridApiService',
        'colombiaHolidaysService',
        'nuxeoClient',
        'autenticacionMidService',
        'themeService',
        'notificacionService',
        'utilsService',
        'titanMidService'
    ])
    .run(function(amMoment) {
        amMoment.changeLocale('es');
    })
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        // cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-div"><div><span class="fa loading-spinner"></div><div class="fa sub-loading-div">Por favor espere, cargando...</div></div>';
    }])
    .config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment.utc(date).format('YYYY-MM-DD') : '';
        };
    })
    .config(['$locationProvider', '$routeProvider' ,'$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $locationProvider.hashPrefix(""); 
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/notificaciones', {
                templateUrl: 'views/notificaciones.html',
                controller: 'NotificacionesCtrl',
                controllerAs: 'notificaciones'

            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/seguimientoycontrol/tecnico/carga_documentos_contratista', {
              templateUrl: 'views/seguimientoycontrol/tecnico/carga_documentos_contratista.html',
              controller: 'cargaDocumentosContratistaCtrl',
              controllerAs: 'cargaDocumentosContratista'
            })
            .when('/seguimientoycontrol/tecnico/aprobacion_supervisor', {
              templateUrl: 'views/seguimientoycontrol/tecnico/aprobacion_supervisor.html',
              controller: 'AprobacionSupervisorCtrl',
              controllerAs: 'aprobacionSupervisor'
            })
            .when('/seguimientoycontrol/tecnico/aprobacion_ordenador', {
              templateUrl: 'views/seguimientoycontrol/tecnico/aprobacion_ordenador.html',
              controller: 'AprobacionOrdenadorCtrl',
              controllerAs: 'aprobacionOrdenador'
            })
            .when('/seguimientoycontrol/tecnico/InformeG_y_CertificadoC/:contrato/:vigencia/:cdp/:vigencia_cdp/:anio/:mes', {
                templateUrl: 'views/seguimientoycontrol/tecnico/informe_gestion_y_certificado_cumplimiento.html',
                controller: 'InformeGyCertificadoCCtrl',
                controllerAs: 'InformeGyCertificadoC'
            })
            .when('/cumplidos_aprobados_por_ordenador', {
                templateUrl: 'views/cumplidosaprobadosordenador/visualizacion_cumplidos.html',
                controller: 'VisualizarCumplidosCtrl',
                controllerAs: 'VisualizarCumplidos'
            })
            .when('/seguimientoycontrol/supervisor/parametrizacion_fechas',{
                templateUrl: 'views/parametrizacionfechas/parametrizacion_fechas.html',
                controller: 'ParametrizacionFechasCtrl',
                controllerAs: 'ParametrizacionFechas'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
