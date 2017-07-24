"use strict";

/**
 * @ngdoc function
 * @name contractualClienteApp.decorator:TextTranslate
 * @description
 * # TextTranslate
 * Decorator of the contractualClienteApp
 */
var text_es = {
  BTN: {
    VER: "Ver",
    SELECCIONAR: "Seleccionar",
    CANCELAR: "Cancelar",
    CONFIRMAR: "Confirmar",
    AGREGAR: "Agregar",
    REGISTRAR: "Registrar",
    SOLICITAR_RP:"Solicitar RP",
    QUITAR_RUBRO: "Quitar",
    VER_SEGUIMIENTO_FINANCIERO:"Ver seguimiento financiero",
    APROBAR: "Aprobar",
    RECHAZAR: "Rechazar",
    SOLICITAR_CDP: "Solicitar CDP",
    GENERAR_RESOLUCION: "Generar Plantilla",
    AGREGAR_CLAUSULA: "Agregar Cláusula",
    ELIMINAR_CLAUSULA: "Eliminar Cláusula",
    ACEPTAR: "Aceptar",
    AGREGAR_PARAGRAFO: "Agregar Parágrafo",
    ELIMINAR_PARAGRAFO: "Eliminar Parágrafo",
    GUARDAR: "Guardar"
  },
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  SELECCIONAR: "Seleccionar",
  //solicitud_necesidad
  NECESIDADES: "Necesidades",
  NECESIDAD: "Necesidad",
  SOLICITUD: "Solicitud",
  SOLICITUD_NECESIDAD: "Solicitud de Necesidad",
  DURACION: "Duración",
  UNICO_PAGO: "Único Pago",
  HASTA_AGOTAR_PRESUPUESTO: "Hasta Agotar Presupuesto",
  AÑOS: "Años",
  MESES: "Meses",
  DIAS: "Días",
  RESPONSABLES: "Responsables",
  DEPENDENCIA_SOLICITANTE: "Dependencia Solicitante",
  JEFE_DEPENDENCIA_SOLICITANTE: "Jefe Dependencia Solicitante",
  DEPENDENCIA_DESTINO: "Dependencia Destino",
  JEFE_DEPENDENCIA_DESTINO: "Jefe Dependencia Destino",
  ROL: "Rol",
  ORDENADOR_GASTO: "Ordenador del Gasto",
  GENERAL: "General",
  PLAN_ANUAL_ADQUISICIONES: "Plan Anual de Adquisiones",
  ESTUDIO_MERCADO: "Estudio de Mercado",
  ANALISIS_RIESGOS: "Análisis de Riesgos",
  SUPERVISOR: "Supervisor",
  OBJETO_CONTRACTUAL: "Objeto Contractual",
  OBJETO_CONTRATO: "Objeto de Contrato",
  JUSTIFICACION_CONTRATO: "Justificación de Contrato",
  DOCUMENTOS: "Documentos",
  ENLACE: "Enlace",
  ESPECIFICACIONES: "Especificaciones",
  TIPO_SERVICIO: "Tipo de Servicio",
  PERFIL: "Perfil",
  EL_TIPO_DE: "el Tipo de",
  SNIES_AREA: "Snies Área",
  SNIES_NUCLEO_BASICO: "Snies Núcleo Básico",
  CANTIDAD: "Cantidad",
  ACTIVIDADES_ESPECIFICAS: "Actividades Específicas",
  ELEMENTOS: "Elementos",
  ELEMENTO: "Elemento",
  UNIDAD_MEDIDA: "Unidad de Medida",
  VALOR_UNITARIO: "Valor Unitario",
  IVA: "IVA",
  VALOR_IVA: "Valor IVA",
  VALOR_TOTAL: "Valor Total",
  REQUISITOS_MINIMOS: "Requisitos mínimos",
  FINANCIACION: "Financiación",
  TIPO_RUBRO: "Tipo de Rubro",
  VALOR_SOLICITADO: "Valor Solicitado",
  TOTAL_FINANCIACION: "Total Financiación",
  //lista_documentos_legales
  MARCO_LEGAL: "Marco Legal",
  NOMBRE_DOCUMENTO: "Nombre del Documento",
  VER: "Ver",
  //lista_actividades_economicas
  ACTIVIDADES_ECONOMICAS: "Actividades Económicas",
  //lista_subgrupos_catalogos
  CATALOGO: "Catálogo",
  PRODCUTOS: "Productos",
  //lista_apropiaciones
  APROPIACIONES: "Apropiaciones",
  APROPIACIONES_VIGENCIA: "Apropiaciones de la Vigencia",
  CODIGO_RUBRO: "Código del Rubro",
  DESCRIPCION_RUBRO: "Descripción del Rubro",
  SALDO: "Saldo",
  //fuentes_apropiacion
  FUENTES_FINANCIAMIENTO_APROPIACION: "Fuentes de Financiamiento de la Apropiación",
  //necesidades
  GESTION_NECESIDADES: "Gestión de Necesidades",
  NUMERO_ELABORACION: "No. de Elaboración",
  //visualizar_necesidad
  DE: "de",
  MONTO: "Monto",
  //SOLICITUD RP
  ERROR: "Error",
  SALIR:"Salir",
  VOLVER_CONTRATOS: "Volver a contratos",
  NUMERO_SOLICITUD:"Número solicitud",
  INSERCION_RP:"Se insertó correctamente la solicitud del registro presupuestal con los siguientes datos",
  VIGENCIA_SOLICITUD: "Vigencia solicitud",
  FECHA_SOLICITUD: "Fecha solicitud",
  NUMERO_CONTRATO: "Número contrato",
  SELECCIONE_UNA_VIGENCIA:"Seleccione una vigencia diferente",
  RESPONSABLE_DOCUMENTO: "Responsable documento",
  RESPONSABLE: "Responsable",
  DATOS_APROPIACIONES: "Datos de las apropiaciones",
  MODALIDAD_SELECCION: "Modalidad de Selección",
  CONTRATO: "Contrato",
  VIGENCIA_CONTRATO: "Vigencia contrato",
  FUENTE:"Fuente de Financiamiento",
  SOLICITUD_PERSONAS:"Contratos para solicitud del registro presupuestal",
  VIGENCIA_ACTUAL:"Vigencia Actual ",
  VIGENCIA_SELECCIONADA:"Vigencia Seleccionada ",
  SELECCION_CDP:"Selección de CDP",
  UNIDAD_EJECUTORA:"Unidad ejecutora",
  ESTADO:"Estado",
  SELECCION_COMPROMISO:"Selección de Compromiso",
  SOLICITUD_RP: "Solicitud Registro Presupuestal",
  DATOS_RP:"Datos del Registro Presupuestal",
  BENEFICIARIO:"Beneficiario",
  NOMBRE_CONTRATISTA: "Nombre",
  DOCUMENTO_CONTRATISTA: "No Documento",
  NOMBRE: "Nombre",
  FUENTE_FINANCIAMIENTO: "Fuente Financiamiento",
  VALOR: "Valor",
  COMPROMISO: "Compromiso",
  NUMERO:"Número",
  VIGENCIA:"Vigencia",
  COMPROMISO_TIPO:"Tipo",
  VALOR_RP:"Valor registro presupuestal",
  SALDO_AP:"Saldo apropiación",
  CDP:"CDP",
  CODIGO: "Código",
  CONSECUTIVO:"Consecutivo",
  OBJETIVO:"Objetivo",
  OBJETO:"Objeto",
  ORDENADOR:"Ordenador",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Seguimiento financiero del contrato",
  DATOS_CONTRATO:"Datos contrato",
  ORDENES_PAGO: "Órdenes pago",
  ESTADISTICAS : "Estadísticas",
  DATOS_FINANCIEROS_CONTRATO: "Datos financieros del contrato",
  DATOS_CONTRATISTA: "Datos contratista",
  APELLIDOS: "Apellidos",
  NOMBRES: "Nombres",
  TIPO_DOCUMENTO: "Tipo documento",
  NUMERO_DOCUMENTO : "No documento",
  FECHA_INICIO:"Fecha inicio",
  FECHA_FIN:"Fecha fin",
  FECHA:"Fecha",
  TIPO:"Tipo",
  DATOS_REGISTRO_PRESUPUESTAL:"Datos del registro presupuestal",
  NUMERO_REGISTRO_PRESUPUESTAL: "No RP",
  NOMBRE_REGISTRO_PRESUPUESTAL: "Nombre RP",
  NUMERO_DISPONIBILIDAD: "No CDP",
  NOMBRE_DISPONIBILIDAD: "Nombre CDP",
  ORDEN_PAGO: "Orden pago",
  FECHA_ORDEN: "Fecha orden",
  VALOR_BRUTO: "Valor bruto",
  LINEA_ORDEN_PAGO:"Linea del tiempo de ordenes de pago",
  ESTADISTICAS_GENERALES: "Estadísticas generales",
  VALOR_TOTAL_CONTRATO: "Valor total contrato",
  VALOR_MENSUAL: "Valor mensual",
  VALOR_TOTAL_PAGADO:"Valor total pagado",
  VALOR_RESTANTE:"Valor restante",
  PORCENTAJE_PAGADO:"Porcentaje pagado",
  PORCENTAJE_RESTANTE:"Porcentaje restante",
  PORCENTAJE:"Porcentaje",
  GRAFICO_BARRAS_CONTRATO:"Gráfico de barras del contrato",
  CARGO:"Cargo",
  NUMERO_COMPROMISO:"No compromiso" ,
  FECHA_REGISTRO: "Fecha registro",
  VIGENCIA_PRESUPUESTO: "Vigencia presupuesto",
  PRESUPUESTO: "Presupuesto",
  VALOR_ORDEN:"Valor orden",
  VALOR_NETO:"Valor neto",
  VIGENCIA_ORDEN: "Vigencia orden",
  SELECCIONAR_ORDEN_PAGO:"Seleccione una orden de pago",
  NO_CDP_REGISTRADAS: "No existe disponibilidades o registros presupuestales registradas para este contrato",
  POR_FAVOR_ESPERE:"Por favor espere",
  CARGANDO_DATOS: "Los datos se están cargando",
  VALOR_ACUMULADO: "Valor acumulado",
  PORCENTAJE_ORDEN: "Porcentaje orden",
  PORCENTAJE_ACUMULADO: "Porcentaje acumulado",
  ORDEN:"Orden",
  ACUMULADO:"Acumulado",
  TOTAL:"Total",
  UNITARIO:"Unitario",
  NO_HAY_DATOS_REDIRIGIR:"No hay datos para mostrar, será redirigido al menú anterior",
  // Minutas
  GENERACION_MINUTA: "Gestión de Plantillas",
  DEPENDENCIA: "Dependencia",
  TITULO_MINUTA: "Titulo de la Minuta",
  TIPO_CONTRATO: "Tipo Contrato",
  INTRODUCCION: "Introducción",
  CONSIDERACION: "Consideración",
  FORMATO_MINUTA: "Información de la Minuta",
  RESUELVE: "Resuelve",
  VISTA_PREVIA: "Vista previa",
  CLAUSULA: "Cláusula",
  TITULO: "Titulo",
  DESCRIPCION: "Descripción",
  PARAGRAFO: "Parágrafo"
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  BTN: {
    VER: "See",
    SELECCIONAR: "Choose",
    CANCELAR: "Cancel",
    CONFIRMAR: "Confirm",
    AGREGAR: "Add",
    REGISTRAR: "Register",
    SOLICITAR_RP:"RP request",
    QUITAR_RUBRO: "Delete",
    APROBAR: "Approbe",
    RECHAZAR: "Reject",
    SOLICITAR_CDP: "CDP Request",
    VER_SEGUIMIENTO_FINANCIERO:"See financial monitoring",
    GENERAR_RESOLUCION: "Generate",
    AGREGAR_CLAUSULA: "Adding a Clause",
    ELIMINAR_CLAUSULA: "Delete Clause",
    ACEPTAR: "Accept",
    AGREGAR_PARAGRAFO: "Add Paragraph",
    ELIMINAR_PARAGRAFO: "Delete Paragraph",
    GUARDAR: "Save"
  },
  SELECCIONAR: "Select",
  NECESIDADES: "Needs",
  NECESIDAD: "Need",
  //SOLICITUD RP
  ERROR: "Error",
  SALIR:"Exit",
  VOLVER_CONTRATOS: "Back to contracts",
  NUMERO_SOLICITUD:"Request number",
  INSERCION_RP:"The budget register request was insert correctly with the following data:",
  VIGENCIA_SOLICITUD: "Request validity",
  FECHA_SOLICITUD: "Request date",
  NUMERO_CONTRATO: "Contract number",
  SOLICITUD: "Request",
  SOLICITUD_NECESIDAD: "Need Request",
  DURACION: "Duration",
  UNICO_PAGO: "Single Payment",
  HASTA_AGOTAR_PRESUPUESTO: "Until the Budget Had Been Used Up",
  AÑOS: "Years",
  MESES: "Months",
  DIAS: "Days",
  RESPONSABLES: "Responsible",
  DEPENDENCIA_SOLICITANTE: "Requesting Unit",
  JEFE_DEPENDENCIA_SOLICITANTE: "Boss of Requesting Unit",
  DEPENDENCIA_DESTINO: "Destination Unit",
  JEFE_DEPENDENCIA_DESTINO: "Boss of Destination Unit",
  ROL: "Role",
  ORDENADOR_GASTO: "Expenditure Authorizer",
  GENERAL: "General",
  PLAN_ANUAL_ADQUISICIONES: "Annual Procurement Plan",
  ESTUDIO_MERCADO: "Market Survey",
  ANALISIS_RIESGOS: "Risk Analysis",
  SUPERVISOR: "Supervisor",
  OBJETO_CONTRACTUAL: "Contractual Object",
  OBJETO_CONTRATO: "Contract Object",
  JUSTIFICACION_CONTRATO: "Contract Justification",
  DOCUMENTOS: "Documents",
  ENLACE: "Link",
  ESPECIFICACIONES: "Specifications",
  TIPO_SERVICIO: "Type of Service",
  PERFIL: "Profile",
  EL_TIPO_DE: "the Type of",
  SNIES_AREA: "Snies Area",
  SNIES_NUCLEO_BASICO: "Snies Basic Core",
  CANTIDAD: "Quantity",
  ACTIVIDADES_ESPECIFICAS: "Specific Activities",
  ELEMENTOS: "Elements",
  ELEMENTO: "Element",
  UNIDAD_MEDIDA: "Unit of Measurement",
  VALOR_UNITARIO: "Unit Value",
  IVA: "IVA",
  VALOR_IVA: "IVA Value",
  VALOR_TOTAL: "Total Value",
  REQUISITOS_MINIMOS: "Minimum Requirements",
  FINANCIACION: "Financing",
  TIPO_RUBRO: "Type of Line Item",
  VALOR_SOLICITADO: "Requested Value",
  TOTAL_FINANCIACION: "Total Financing",
  //lista_documentos_legales
  MARCO_LEGAL: "Legal Framework",
  NOMBRE_DOCUMENTO: "Document Name",
  VER: "Details",
  //lista_actividades_economicas
  ACTIVIDADES_ECONOMICAS: "Economic Activities",
  //lista_subgrupos_catalogos
  CATALOGO: "Catalogue",
  PRODCUTOS: "Products",
  //lista_apropiaciones
  APROPIACIONES: "Appropiations",
  APROPIACIONES_VIGENCIA: "Validity Appropiations of",
  CODIGO_RUBRO: "Line Item Code",
  DESCRIPCION_RUBRO: "Line Item Description",
  SALDO: "Balance",
  //fuentes_apropiacion
  FUENTES_FINANCIAMIENTO_APROPIACION: "Appropiations Funding Source",
  //necesidades
  GESTION_NECESIDADES: "Managment Needs",
  NUMERO_ELABORACION: "No. of Elaboration",
  //visualizar_necesidad
  DE: "of",
  MONTO: "Amount",
  //SOLICITUD RP
  RESPONSABLE_DOCUMENTO: "Person responsible identification",
  SELECCIONE_UNA_VIGENCIA:"Choose a diferente validity",
  RESPONSABLE: "Person responsible",
  DATOS_APROPIACIONES: "Appropiation data",
  MODALIDAD_SELECCION: "Selection method",
  CONTRATO: "Contract",
  VIGENCIA_CONTRATO: "Contract validity",
  FUENTE:"Source",
  SOLICITUD_PERSONAS:"Contracts for budget registers",
  VIGENCIA_ACTUAL:"Current validity",
  VIGENCIA_SELECCIONADA:"Chosen validity",
  SELECCION_CDP:"CDP choise",
  UNIDAD_EJECUTORA:"Performer unity",
  ESTADO:"State",
  SELECCION_COMPROMISO:"Agreement choose",
  SOLICITUD_RP: "Budget register request",
  DATOS_RP:"Buget register data",
  BENEFICIARIO:"Beneficiary",
  NOMBRE_CONTRATISTA: "Name",
  DOCUMENTO_CONTRATISTA: "Identification",
  NOMBRE: "Name",
  FUENTE_FINANCIAMIENTO: "Funding source",
  VALOR: "Value",
  COMPROMISO: "Agreement",
  NUMERO:"Number",
  VIGENCIA:"Validity",
  COMPROMISO_TIPO:"Tipe",
  VALOR_RP:"Budget register value",
  SALDO_AP:"Appropiation reminder",
  CDP:"CDP",
  CODIGO: "Code",
  CONSECUTIVO:"Consecutive",
  OBJETIVO:"Objective",
  OBJETO:"Object",
  ORDENADOR:"Authorizer",
  //SEGUMIENTO FINANCIERO
  SEGUIMIENTO_FINANCIERO:"Financial monitoring of the contract",
  DATOS_CONTRATO:"Contract data",
  ORDENES_PAGO: "Pay orders",
  ESTADISTICAS : "Statistics",
  DATOS_FINANCIEROS_CONTRATO: "Financial data of the contract",
  DATOS_CONTRATISTA: "Contractor data",
  APELLIDOS: "Surnames",
  NOMBRES: "Names",
  TIPO_DOCUMENTO: "Identification type",
  NUMERO_DOCUMENTO : "Document number",
  FECHA_INICIO:"Start date",
  FECHA_FIN:"End date",
  FECHA:"Date",
  TIPO:"Type",
  DATOS_REGISTRO_PRESUPUESTAL:"Budget register data",
  NUMERO_REGISTRO_PRESUPUESTAL: "Budget register number",
  NOMBRE_REGISTRO_PRESUPUESTAL: "Budget register name",
  NUMERO_DISPONIBILIDAD: "Availability number",
  NOMBRE_DISPONIBILIDAD: "Availability name",
  ORDEN_PAGO: "Pay order",
  FECHA_ORDEN: "Order date",
  VALOR_BRUTO: "Gross value",
  LINEA_ORDEN_PAGO:"Pay orders timeline",
  ESTADISTICAS_GENERALES: "General statistics",
  VALOR_TOTAL_CONTRATO: "Contract total value",
  VALOR_MENSUAL: "Monthly value",
  VALOR_TOTAL_PAGADO:"Paid total value",
  VALOR_RESTANTE:"Remaining value",
  PORCENTAJE_PAGADO:"Paid percentage",
  PORCENTAJE_RESTANTE:"Remaining percentage",
  PORCENTAJE:"Percentage",
  GRAFICO_BARRAS_CONTRATO:"Contract bar graph",
  CARGO:"Position",
  NUMERO_COMPROMISO:"Compromise number" ,
  FECHA_REGISTRO: "Register date",
  VIGENCIA_PRESUPUESTO: "Budget validity",
  PRESUPUESTO: "Budget",
  VALOR_ORDEN:"Order value",
  VALOR_NETO:"Net value",
  VIGENCIA_ORDEN: "Validity order",
  SELECCIONAR_ORDEN_PAGO:"Choose a pay order",
  NO_CDP_REGISTRADAS: "There are not availabilities registered for this contract",
  POR_FAVOR_ESPERE:"Please wait",
  CARGANDO_DATOS: "Data is loading",
  VALOR_ACUMULADO: "Accumulate value",
  PORCENTAJE_ORDEN: "Order percentage",
  PORCENTAJE_ACUMULADO: "Accumulate percentage",
  ORDEN:"Order",
  ACUMULADO:"Accumulate",
  TOTAL:"Total",
  UNITARIO:"Unit",
  NO_HAY_DATOS_REDIRIGIR:"There are no data to show you will be redirected to the previous menu",
  // Minutas
  GENERACION_MINUTA: "Template Management",
  TITULO_MINUTA: "Agreement Title",
  TIPO_CONTRATO: "Agreement Type",
  TITULO_MINUTA: "Agreement Title",
  INTRODUCCION: "Introduction",
  CONSIDERACION: "Consideration",
  FORMATO_MINUTA: "Agreement Information",
  RESUELVE: "Resolve",
  VISTA_PREVIA: "Preview",
  CLAUSULA: "Clause",
  TITULO: "Title",
  DESCRIPCION: "Description",
  PARAGRAFO: "Paragraph"
};

angular.module('contractualClienteApp')
  .config(function($translateProvider) {
    $translateProvider
      .translations("es", text_es)
      .translations("en", text_en);
    $translateProvider.preferredLanguage("es");
    $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
});
