'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:InformeGyCertificadoCCtrl
 * @description
 * #InformeGyCertificadoCCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('InformeGyCertificadoCCtrl', function (token_service, cumplidosCrudRequest, $window, $sce, gestorDocumentalMidRequest, $routeParams, utils, cumplidosMidRequest, titanMidRequest, financieraJBPMRequest,amazonAdministrativaRequest) {
    //console.log($routeParams);
    //Pasos a seguir
    //1. traer la informacion del mid del informe 
    //2. Verificar en el crud si hay un informe bajo este contrato/mes/año
    //(true) Cargar la informacion de esa version
    //(false) Mostrar un formulario limpio
    //3. Generar PDF
    //4. Si se acepta el pdf, subirlo a cumplidos

    var self = this;

    self.contrato = $routeParams.contrato;
    self.anio = $routeParams.anio;
    self.mes = $routeParams.mes;
    self.mes_nombre = utils.nombreMes(self.mes).Nombre;
    self.vigencia = $routeParams.vigencia
    self.cdp = $routeParams.cdp
    self.vigencia_cdp = $routeParams.vigencia_cdp
    //console.log(self.contrato)

    self.documento_contratista = token_service.getAppPayload().documento;

    self.pdf_dataUrl = '';

    self.procesos = [
      "Planeación Estratégica e Institucional",
      "Gestión Integrada",
      "Autoevaluación y Acreditación",
      "Interinstitucionalización e Internacionalización",
      "Comunicaciones",
      "Gestión de Docencia",
      "Gestión de Investigación",
      "Extensión y Proyección Social",
      "Admisiones, Registro y Control",
      "Bienestar Institucional",
      "Gestión de la Información Bibliográfica",
      "Gestión de Laboratorios",
      "Servicio al Ciudadano",
      "Gestión de los Sistemas de Información y las Telecomunicaciones",
      "Gestión y Desarrollo del Talento Humano",
      "Gestión Documental",
      "Gestión de Infraestructura Física",
      "Gestión de Recursos Financieros",
      "Gestión Contractual",
      "Gestión Jurídica",
      "Evaluación y Control",
      "Control Disciplinario"
    ]

    self.actividades_especificas_Usadas = []

    //console.log(self.actividades_especificas_disponibles);

    self.actividades_especificas_usadas = []

    self.informacion_informe = null

    self.darFormato = function (Preliquidacion) {
      Preliquidacion.TotalDevengadoConFormato = utils.formatoNumero(Preliquidacion.TotalDevengado, 0, ',', '.')
      Preliquidacion.TotalDescuentosConFormato = utils.formatoNumero(Preliquidacion.TotalDescuentos, 0, ',', '.')
      Preliquidacion.TotalPagoConFormato = utils.formatoNumero(Preliquidacion.TotalPago, 0, ',', '.')
      for (let index = 0; index < Preliquidacion.Detalle.length; index++) {
        Preliquidacion.Detalle[index].ValorCalculadoConFormato = utils.formatoNumero(Preliquidacion.Detalle[index].ValorCalculado, 0, ',', '.');
      }
      //console.log(Preliquidacion)
    }

    self.escogerUltimaNovedad = function (novedades) {
      var fechaUltimaNovedad = null
      for (let index = 0; index < novedades.length; index++) {
        const novedad = novedades[index];
        if (fechaUltimaNovedad == null) {
          fechaUltimaNovedad = new Date(utils.ajustarFecha(novedad.FechaProrroga))
        } else {
          fechaNovedad = new Date(utils.ajustarFecha(novedad.FechaProrroga))
          if (fechaNovedad > fechaUltimaNovedad) {
            fechaUltimaNovedad = fechaNovedad
          }
        }
      }
      return fechaUltimaNovedad
    }

    self.validarNovedades = function () {
      //console.log('novedades: ', self.informacion_informe.Novedades)
      self.informacion_informe.Novedades.UltimoOtrosi = {}
      self.informacion_informe.Novedades.UltimaCesion = {}
      if (self.informacion_informe.Novedades.Otrosi == null) {
        self.informacion_informe.Novedades.UltimoOtrosi.Existe = ''
        self.informacion_informe.Novedades.UltimoOtrosi.FechaInicio = ''
        self.informacion_informe.Novedades.UltimoOtrosi.FechaFin = ''
      } else {
        self.informacion_informe.Novedades.UltimoOtrosi.Existe = 'X'
        self.informacion_informe.Novedades.UltimoOtrosi.FechaInicio = self.escogerUltimaNovedad(self.informacion_informe.Novedades.Otrosi)
        self.informacion_informe.Novedades.UltimoOtrosi.FechaFin = self.informacion_informe.Novedades.Otrosi.FechaInicio.getDate() + dias
      }

      if (self.informacion_informe.Novedades.Cesion == null) {
        self.informacion_informe.Novedades.UltimaCesion.Existe = ''
        self.informacion_informe.Novedades.UltimaCesion.FechaCesion = ''
      } else {
        self.informacion_informe.Novedades.UltimaCesion.Existe = 'X'
        self.informacion_informe.Novedades.UltimaCesion.FechaCesion = self.escogerUltimaNovedad(self.informacion_informe.Novedades.Cesion)
      }
    }

    self.calcularPorcentajeTiempo = function (fechaInicio, fechaFin, fechaFinActividades) {
      //console.log('fechas: ', fechaInicio, fechaFin, fechaFinActividades)
      var diasContrato = utils.diferenciaFechasDias(fechaInicio, fechaFin)
      var diasContratoEjecutado = utils.diferenciaFechasDias(fechaInicio, fechaFinActividades)
      var porcentajeEjecutado = ((diasContratoEjecutado * 100) / diasContrato)
      var porcentajeFaltante = 100 - porcentajeEjecutado
      return { Ejecutado: porcentajeEjecutado.toFixed(2), Faltante: porcentajeFaltante.toFixed(2) }
    }

    self.calcularEjecutadoDinero = function (fechaInicio, fechaFin, fechaFinActividades) {
      amazonAdministrativaRequest.get('contrato_general', $.param({
        query: "ContratoSuscrito.NumeroContratoSuscrito:" + self.contrato+',VigenciaContrato:'+self.vigencia,
        limit: 0
      })).then(function (response_contrato_general) {
        console.log(response_contrato_general)
        var unidadEjecutora=response_contrato_general.data[0].UnidadEjecutora;
        console.log(unidadEjecutora)
        if(response_contrato_general.status==200){
          financieraJBPMRequest.get('giros_tercero/'+ self.cdp + '/' + self.vigencia_cdp+'/'+unidadEjecutora,'').then(function (response) {
            console.log("giro_terceros:",response)
            if(response.data.giros.tercero!=undefined){
              var pagosAnuales=response.data.giros.tercero;
              var total=0;
              for (let index = 0; index < pagosAnuales.length; index++) {
                const pagado = parseInt(pagosAnuales[index].valor_bruto_girado);
                total=total+pagado;
              }
              //total=total+self.Preliquidacion.TotalDevengado;
              self.informacion_informe.ejecutadoDinero = { Pagado: total, Faltante: parseInt(self.informacion_informe.ValorContrato)-total }
            }else{
              self.informacion_informe.ejecutadoDinero = { Pagado: "Sin Informacion", Faltante: "Sin Informacion" }
            }
          })
        }else{
          self.informacion_informe.ejecutadoDinero = { Pagado: "Sin Informacion", Faltante: "Sin Informacion" }
        }
       
      })
    }

    self.obtenerInforme = function () {
      cumplidosMidRequest.get('informe/' + self.contrato + '/' + self.vigencia + '/' + self.mes + '/' + self.anio).then(function (response) {
        //console.log(response)
        if (response.status == 200) {
          if (response.data.Data == null) {
            //Nuevo Informe
            self.nuevoInforme = true;
            //Crea la estructura base para un nuevo Informe
            self.Informe = {};
            self.Informe.Contrato = self.contrato;
            self.Informe.Vigencia = Number(self.vigencia);
            self.Informe.Mes = Number(self.mes);
            self.Informe.Anio = Number(self.anio);
            self.Informe.DocumentoContratista = self.documento_contratista;
            self.Informe.ActividadesEspecificas = [{
              "ActividadEspecifica": '',
              "Avance": 0,
              "ActividadesRealizadas": [{
                "Actividad": '',
                "ProductoAsociado": '',
                "Evidencia": '',
              }]
            }]
          } else {
            //Informe ya creado

            //console.log("Informe obtenido del mid:", response);
            if (response.data.Data.length != 0) {
              var inf_aux = response.data.Data[0];
              inf_aux.PeriodoInformeInicio = new Date(inf_aux.PeriodoInformeInicio.split('T')[0]);
              inf_aux.PeriodoInformeInicio.setHours(inf_aux.PeriodoInformeInicio.getHours() + 5)
              inf_aux.PeriodoInformeFin = new Date(inf_aux.PeriodoInformeFin.split('T')[0]);
              inf_aux.PeriodoInformeFin.setHours(inf_aux.PeriodoInformeFin.getHours() + 5)
              self.Informe = inf_aux;
              self.nuevoInforme = false;
              //console.log(self.Informe)
            } else {
              swal(
                'ERROR AL OBTENER EL INFORME',
                'Ocurrio un problema al obtener el informe',
                'error'
              )
            }
          }
        } else {
          swal({
            title: 'Ocurrio un error al traer el informe, intente nuevamente mas tarde',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
          })
        }
        //console.log("Informe inicial", self.Informe)
      }).catch(
        function (error) {
          //console.log(error)
          swal({
            title: 'Ocurrio un error al traer el informe, intente nuevamente mas tarde',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
          })
        }
      );

    }

    self.obtenerInformacionInforme = function () {
      cumplidosMidRequest.get('informacion_informe/' + self.documento_contratista + '/' + self.contrato + '/' + self.vigencia + '/' + self.cdp + '/' + self.vigencia_cdp).then(function (response) {
        //console.log(response)
        if (response.status == 200) {
          if (response.data.Data != null) {
            self.informacion_informe = response.data.Data
            self.informacion_informe.FechaCPS = new Date(utils.ajustarFecha(self.informacion_informe.FechaCPS))
            self.informacion_informe.CDP.Fecha = new Date(utils.ajustarFecha(self.informacion_informe.CDP.Fecha))
            self.informacion_informe.RP.Fecha = new Date(utils.ajustarFecha(self.informacion_informe.RP.Fecha))
            self.obtenerPreliquidacion();
            self.validarNovedades();
            self.calcularEjecutadoDinero();
          } else {

            swal({
              title: 'Ocurrio un error al traer la informacion, intente nuevamente mas tarde',
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Aceptar'
            }).then(function () {
              $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
            })
          }
        } else {

        }
      }).catch(
        function (error) {
          //console.log(error)
          swal({
            title: 'Ocurrio un error al traer la informacion, intente nuevamente mas tarde',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
          })
        }
      );
    }

    self.obtenerPreliquidacion = function () {
      titanMidRequest.get('detalle_preliquidacion/obtener_detalle_CT/' + self.anio + '/' + self.mes + '/' + self.contrato + '/' + self.vigencia + '/' + self.documento_contratista).then(
        function (response) {
          console.log(response)
          self.Preliquidacion = response.data.Data
          self.darFormato(self.Preliquidacion);
          //console.log('Fecha inicio', new Date(utils.ajustarFecha(self.Preliquidacion.Detalle[0].ContratoPreliquidacionId.ContratoId.FechaInicio)))
          //console.log('Fecha fin', new Date(utils.ajustarFecha(self.Preliquidacion.Detalle[0].ContratoPreliquidacionId.ContratoId.FechaFin)))
          self.informacion_informe.FechaInicio = new Date(utils.ajustarFecha(self.Preliquidacion.Detalle[0].ContratoPreliquidacionId.ContratoId.FechaInicio))
          self.informacion_informe.FechaFin = new Date(utils.ajustarFecha(self.Preliquidacion.Detalle[0].ContratoPreliquidacionId.ContratoId.FechaFin))
        }
      ).catch(
        function (error) {
          //console.log('Error preliquidacion', error)
          swal({
            title: 'Ocurrio un error al traer la preliquidacion, intente nuevamente mas tarde',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then(function () {
            $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
          })
        }
      );
    }

    self.obtenerInforme();
    self.obtenerInformacionInforme();



    self.agregarActividadEspecifica = function () {
      //console.log("entro a agregarMeta")
      // if (self.Informe.ActividadesEspecificas.length === self.actividades_especificas.length) {
      //   //console.log("Maximo numero de actividades especificas")
      //   return
      // }
      //self.Informe.Metas.push(Object.create(Meta))
      self.Informe.ActividadesEspecificas.push({
        "ActividadEspecifica": "",
        "Avance": 0,
        "ActividadesRealizadas": [{
          "Actividad": '',
          "ProductoAsociado": '',
          "Evidencia": '',
        }]
      })
    }

    self.agregarActividad = function (index_actividadEspecifica) {
      //console.log("entro a agregar Actvidad", index_actividadEspecifica)
      // if (self.Informe.ActividadesEspecificas.length === self.actividades_especificas.length) {
      //   //console.log("Maximo numero de actividades_especificas")
      //   return
      // }
      //self.Informe.Metas[index_Meta].Actividades.push(Object.create(Actividad))
      self.Informe.ActividadesEspecificas[index_actividadEspecifica].ActividadesRealizadas.push({
        "Actividad": '',
        "ProductoAsociado": '',
        "Evidencia": '',
      })
    }

    self.eliminarActividadEspecifica = function (index_actividadEspecifica) {
      //console.log("entro a eliminar Actividad Especifica", index_actividadEspecifica)
      if (self.Informe.ActividadesEspecificas.length === 1) {
        //console.log("minimo numero de metas")
        return
      }
      self.Informe.ActividadesEspecificas.splice(index_actividadEspecifica, 1);
    }

    self.eliminarActividad = function (index_actividadEspecifica, index_Actividad) {
      //console.log("entro a eliminaractividad")
      //console.log("index_actividadEspecifica", index_actividadEspecifica)
      //console.log("index_actividad", index_Actividad)
      if (self.Informe.ActividadesEspecificas[index_actividadEspecifica].ActividadesRealizadas.length === 1) {
        //console.log("minimo numero de actividades")
        return
      }
      self.Informe.ActividadesEspecificas[index_actividadEspecifica].ActividadesRealizadas.splice(index_Actividad, 1);
    }

    self.guardar = function () {
      //console.log(angular.toJson(self.Informe));
      if (self.nuevoInforme) {
        //endpoint para crear
        cumplidosMidRequest.post('informe', angular.toJson(self.Informe)).then(function (response) {
          //console.log("resultado post informe", response)
          if (response.status == 201) {
            self.nuevoInforme = false;
            swal(
              'INFORME GUARDADO',
              'Su informe fue guardado con exito',
              'success'
            )
          } else {
            swal(
              'ERROR AL GUARDAR INFORME',
              'Ocurrio un problema al guardar el informe',
              'error'
            )
          }
        })
      } else {
        //endpoint para actualizar
        //console.log("Informe a actualizar:",self.Informe)
        cumplidosMidRequest.put('informe', self.Informe.Id, angular.toJson(self.Informe)).then(function (response) {
          //console.log("resultado put informe", response)
          if (response.status == 200) {
            self.nuevoInforme = false;
            swal(
              'INFORME GUARDADO',
              'Su informe fue guardado con exito',
              'success'
            )
          } else {
            swal(
              'ERROR AL GUARDAR INFORME',
              'Ocurrio un problema al guardar el informe',
              'error'
            )
          }
        })
      }
    }

    self.actualizar_index_actividadEspecifica = function (Meta) {
      //console.log(Meta);
      //Meta.activo = !Meta.activo;
      /*//console.log(index_Meta);
      self.metas_disponibles[index_Meta].activo=!self.metas_disponibles[index_Meta].activo;
      //console.log(self.metas_disponibles);*/
    }

    self.crear_lista_evidencias = function (Evidencia) {
      var evidencias = Evidencia.split(',');
      var ul = [];
      for (var z = 0; z < evidencias.length; z++) {
        ul.push({ text: 'Evidencia ' + (z + 1), link: evidencias[z], color: '#0645AD', decoration: 'underline', bold: true })
      }
      return ul;
    }

    self.construirTabla = function (informe) {
      var body = []
      var indexPrimera = 1;
      body.push([{ text: 'No.', style: 'tableActividadesHeader' }, { text: 'ACTIVIDADES ESPECIFICAS DEL VÍNCULO CONTRACTUAL ', style: 'tableActividadesHeader' }, { text: 'PORCENTAJE DE AVANCE', style: 'tableActividadesHeader' }, { text: 'ACTIVIDADES REALIZADAS EN EL PERIODO', style: 'tableActividadesHeader' }, { text: 'PRODUCTO ASOCIADO', style: 'tableActividadesHeader' }, { text: 'EVIDENCIAS', style: 'tableActividadesHeader' }])
      for (var i = 0; i < informe.ActividadesEspecificas.length; i++) {
        //console.log(i);
        var numActividades = informe.ActividadesEspecificas[i].ActividadesRealizadas.length;
        var actividadEsp = informe.ActividadesEspecificas[i];
        for (var j = 0; j < informe.ActividadesEspecificas[i].ActividadesRealizadas.length; j++) {
          var actividad = informe.ActividadesEspecificas[i].ActividadesRealizadas[j];
          body.push([{}, {}, {}, { text: actividad.Actividad }, { text: actividad.ProductoAsociado }, {
            ul: self.crear_lista_evidencias(actividad.Evidencia)
          }])
        }
        body[indexPrimera][0] = { rowSpan: numActividades, text: i + 1, bold: true, alignment: 'center' }
        body[indexPrimera][1] = { rowSpan: numActividades, text: actividadEsp.ActividadEspecifica }
        body[indexPrimera][2] = { rowSpan: numActividades, text: actividadEsp.Avance, alignment: 'center' }
        indexPrimera = indexPrimera + numActividades;
      }
      return body
    }

    self.formato_InformeGyCertificadoC = function () {
      return {
        pageSize: 'FOLIO',
        pageOrientation: 'landscape',
        pageMargins: [10, 10, 10, 10],
        content: [
          {
            style: 'tableHeader',

            table: {
              widths: ['*', 'auto', 'auto', '*'],
              heights: 19,
              headerRows: 1,
              body: [

                [{
                  rowSpan: 3, image: 'logo_ud', width: 70,
                  height: 60
                }, { text: 'CERTIFICADO DE CUMPLIMIENTO E INFORME DE GESTIÓN', bold: true, margin: [0, 2, 0, 0] }, { text: 'Código: PEI-PR-003-FR-009', margin: [0, 3, 0, 0] }, {
                  rowSpan: 3, image: 'logo_sigud', width: 150,
                  height: 60
                }],
                ['', { text: 'Macroproceso: Direccionamiento Estratégico', margin: [0, 3, 0, 0] }, { text: 'Versión: 02', margin: [0, 3, 0, 0] }, ''],
                ['', { text: 'Proceso: Planeación Estratégica e Institucional', margin: [22, 3, 0, 0] }, { text: 'Fecha de Aprobación: 14/03/2022', margin: [35, 3, 0, 0] }, ''],

              ]
            }
          },
          {
            columns: [
              { width: 125, text: '' },
              {
                style: 'tableContractInfo',
                width: '*',
                table: {
                  widths: ['auto', 'auto', 'auto', '*'],
                  heights: 19,
                  body: [
                    [{ text: 'CONTRATO DE PRESTACIÓN DE SERVICIOS', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] },
                    { text: 'C.P.S. No.', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] },
                    { text: self.contrato, bold: true, fontSize: 11, margin: [0, 3, 0, 0] },
                    { text: utils.formatoFecha(self.informacion_informe.FechaCPS), bold: true, fontSize: 11, margin: [0, 3, 0, 0] }]
                  ]
                }
              },
              { width: 152, text: '' }
            ]
          },
          {
            //informacion contractual
            style: 'tableContractInfo',
            widths: '*',
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
              body: [
                [{ text: 'NOMBRE CONTRATISTA:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { colSpan: 3, text: self.informacion_informe.InformacionContratista.Nombre, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}, { text: 'FECHA DE INICIO', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] }, { text: self.informacion_informe.FechaInicio.toLocaleDateString(), fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'FECHA FINALIZACIÓN:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.FechaFin.toLocaleDateString(), fontSize: 11, margin: [0, 5, 0, 0] }],
                [{ text: 'PROCESO:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.Informe.Proceso, fontSize: 11, margin: [0, 3, 0, 0] }, { text: 'OTROSÍ:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Novedades.UltimoOtrosi.Existe, bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'FECHA INICIO OTROSÍ:', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Novedades.UltimoOtrosi.FechaInicio, fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'FECHA FINALIZACIÓN:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Novedades.UltimoOtrosi.FechaFin, fontSize: 11, margin: [0, 5, 0, 0] }],
                [{ text: 'UNIDAD ACADÉMICA Y/O ADMINISTRATIVA:', bold: true, height: 40, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Dependencia, fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'CESIÓN:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Novedades.UltimaCesion.Existe, bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'FECHA CESIÓN: ', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] }, { colSpan: 3, text: self.informacion_informe.Novedades.UltimaCesion.FechaCesion, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}],
                [{ text: 'SEDE:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.Sede, fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 2, text: 'PERIODO INFORME:', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] }, {}, { text: 'DESDE:', bold: true, fillColor: '#CCCCCC', fontSize: 11, margin: [0, 3, 0, 0] }, { text: self.Informe.PeriodoInformeInicio.toLocaleDateString(), fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'HASTA:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.Informe.PeriodoInformeFin.toLocaleDateString(), fontSize: 11, margin: [0, 5, 0, 0] }],
                [{ text: 'DISPONIBILIDAD PRESUPUESTAL', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, { text: self.informacion_informe.CDP.Consecutivo + ' ' + utils.formatoFecha(self.informacion_informe.CDP.Fecha), fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 3, text: 'CERTIFICADO REGISTRO PRESUPUESTAL:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 3, 0, 0] }, {}, {}, { colSpan: 3, text: self.informacion_informe.RP.Consecutivo + ' ' + utils.formatoFecha(self.informacion_informe.RP.Fecha), fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}],
              ]
            }
          },
          {
            style: 'tableContractInfo',
            widths: '*',

            table: {
              widths: ['auto', '*'],
              heights: 40,
              body: [
                [{ text: 'OBJECTO DEL CONTRATO:', bold: true, fontSize: 11, fillColor: '#CCCCCC', margin: [0, 15, 0, 0] }, { text: self.informacion_informe.Objeto, alignment: 'justify', fontSize: 10 }]
              ]
            }
          },
          {
            //actividades
            style: 'tableContractInfo',
            widths: '*',
            table: {
              dontBreakRows: true,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
              body: self.construirTabla(self.Informe)

            }
          },
          {
            //Certificado de cumplimiento  
            style: 'tableContractInfo',
            widths: '*',
            table: {
              dontBreakRows: true,
              widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ colSpan: 8, text: 'EL JEFE DE ' + self.informacion_informe.Dependencia + ' DE LA UNIVERSIDAD DISTRITAL “FRANCISCO JOSÉ DE CALDAS” CERTIFICA QUE EL/LA CONTRATISTA:', alignment: 'center', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}, {}, {}, {}, {}, {}],
                [{ text: 'NOMBRE DEL CONTRATISTA:', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: self.informacion_informe.InformacionContratista.Nombre, fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'TIPO DE IDENTIFICACIÓN:', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: self.informacion_informe.InformacionContratista.TipoIdentificacion, alignment: 'center', fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'No.', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: self.documento_contratista, alignment: 'center', fontSize: 11, margin: [0, 5, 0, 0] }, { text: 'De', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { text: self.informacion_informe.InformacionContratista.CiudadExpedicion, alignment: 'center', fontSize: 11, margin: [0, 5, 0, 0] }],
                [{
                  colSpan: 8, text: 'Viene cumpliendo a satisfacción con el objeto establecido en el contrato de prestación de servicios No. ' + self.contrato + ' del ' + utils.formatoFecha(self.informacion_informe.FechaCPS) + ', que el valor causado por este concepto, es la suma de: (' + utils.numeroALetras(self.Preliquidacion.TotalDevengado).toUpperCase() + ') (' + utils.formatoNumero(self.Preliquidacion.TotalDevengado) + ' M/CTE.), del mes de ' + self.mes_nombre
                    + ' del año ' + self.anio + '; y con el pago reglamentario de los aportes al sistema de seguridad social correspondientes al mes de ' + utils.mesAnterior(self.mes, self.anio) + '.', alignment: 'justify', fontSize: 11, margin: [0, 5, 0, 0]
                }, {}, {}, {}, {}, {}, {}, {}],
                [{ text: 'VALOR DEL CONTRATO', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 2, text: 'EJECUTADO EN TIEMPO (PORCENTAJE %)', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, { text: '%' + self.informacion_informe.porcentajeTiempo.Ejecutado, alignment: 'center', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 3, text: 'PENDIENTE POR EJECUTAR EN TIEMPO (PORCENTAJE %)', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}, { text: '%' + self.informacion_informe.porcentajeTiempo.Faltante, alignment: 'center', fontSize: 11, margin: [0, 5, 0, 0] }],
                [{ text: utils.formatoNumero(parseInt(self.informacion_informe.ValorContrato)), alignment: 'center', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 2, text: 'EJECUTADO EN DINERO ($)', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, { text: utils.formatoNumero(self.informacion_informe.ejecutadoDinero.Pagado), alignment: 'center', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, { colSpan: 3, text: 'PENDIENTE POR EJECUTAR EN DINERO ($)', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}, { text: utils.formatoNumero(self.informacion_informe.ejecutadoDinero.Faltante), alignment: 'center', fontSize: 11, margin: [0, 5, 0, 0] }],
                [{ colSpan: 8, text: 'Nota: Yo, ' + self.informacion_informe.InformacionContratista.Nombre + ' , autorizo a la Universidad Distrital para hacer el abono de mis pagos a la cuenta bancaria relacionada. Bajo gravedad del juramento, certifico que estoy realizando los aportes a seguridad social, de conformidad con lo establecido por la Ley. ', alignment: 'justify', bold: true, fontSize: 11, margin: [0, 5, 0, 0] }, {}, {}, {}, {}, {}, {}, {}]
              ]
            }
          }, {
            margin: [0, 20, 0, 0],
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                table: {
                  body: [
                    [
                      {
                        border: [false, false, false, true],
                        text: self.informacion_informe.InformacionContratista.Nombre, alignment: 'center'
                      }
                    ],
                    [
                      {
                        border: [false, true, false, false],
                        text: 'CONTRATISTA', bold: true,
                        alignment: 'center'
                      }
                    ]]
                }
              },
              { width: '*', text: '' },
              {
                width: 'auto',
                table: {
                  body: [
                    [
                      {
                        border: [false, false, false, true],
                        text: self.informacion_informe.Supervisor.Nombre, alignment: 'center'
                      }
                    ],
                    [
                      {
                        border: [false, true, false, false],
                        text: 'SUPERVISOR', bold: true,
                        alignment: 'center'
                      }
                    ]]
                }
              },
              { width: '*', text: '' },
            ]
          }

        ],
        styles: {
          tableHeader: {
            margin: [0, 0, 0, 0],
            alignment: 'center',
            color: 'black',
            fontSize: 10
          },
          tableContractInfo: {
            margin: [0, 15, 0, 0],
            color: 'black',
            fontSize: 10
          },
          tableActividadesHeader: {
            bold: true,
            fontSize: 11,
            fillColor: '#CCCCCC',
            alignment: 'center',
            margin: [0, 3, 0, 0]
          }

        },

        images: {
          logo_ud: 'data:image/png;base64,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',
          logo_sigud: 'data:image/png;base64,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'
        }

      }
    }

    self.formato_generacion_pdf = function () {
      self.informacion_informe.porcentajeTiempo = self.calcularPorcentajeTiempo(self.informacion_informe.FechaInicio, self.informacion_informe.FechaFin, self.Informe.PeriodoInformeFin);
      console.log(self.informacion_informe)
      var docDefinition = self.formato_InformeGyCertificadoC();
      //console.log(docDefinition);
      // pdfMake.createPdf(docDefinition).download();
      pdfMake.createPdf(docDefinition).getDataUrl(function (data) {
        //console.log(data);
        self.pdf_dataUrl = $sce.trustAsResourceUrl(data);
        self.pdf_base64 = data.split(',')[1]
        $('#modal_visualizar_documento').modal('show');
      });
    }

    self.subirInforme = function () {
      //console.log('hola?')
      swal({
        title: '¿Está seguro(a) de subir el Informe de gestion y certificado de cumplimiento?',
        type: 'warning',
        showCancelButton: true,
        target: document.getElementById('modal_visualizar_documento'),
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar'
      }).then(function () {
        //console.log(self.pdf_dataUrl)
        var nombre_doc = self.vigencia + self.contrato + self.documento_contratista + self.mes + self.anio;
        var pago_mensual_id;
        var error = false;

        cumplidosCrudRequest.get('pago_mensual', $.param({
          query: "NumeroContrato:" + self.contrato +
            ",VigenciaContrato:" + self.vigencia +
            ",Mes:" + self.mes +
            ",Ano:" + self.anio +
            ",DocumentoPersonaId:" + self.documento_contratista,
          limit: 0
        })).then(function (response_pago_mensual) {
          if (Object.keys(response_pago_mensual.data.Data[0]).length !== 0) {
            pago_mensual_id = response_pago_mensual.data.Data[0].Id
            //Condicional del item y del file model
            if (self.pdf_base64 !== undefined && !error && pago_mensual_id !== undefined) {
              var nombre_Archivo = 'Informe Gestion y Certificado de Cumplimiento_' + self.contrato + '_' + self.mes + '_' + self.anio;

              var data = [{
                IdTipoDocumento: 19, //id tipo documento de documentos_crud
                nombre: nombre_doc,// nombre formado por vigencia+contrato+cedula+mes+año
                file: self.pdf_base64,
                metadatos: {
                  NombreArchivo: nombre_Archivo,
                  Tipo: "Archivo",
                  Observaciones: ''
                },
                descripcion: 'INFORME DE GESTIÓN Y CERTIFICADO DE CUMPLIMIENTO',

              }];
              //guarda el soporte por medio del gestor documental
              gestorDocumentalMidRequest.post('/document/upload', data).then(function (response) {
                //console.log(response.data);

                if (response.data.Status == 200) {

                  self.id_documento = response.data.res.Id;

                  cumplidosCrudRequest.get('item_informe_tipo_contrato', $.param({
                    query: "Activo:true,TipoContratoId:6,ItemInformeId.CodigoAbreviacion:IGYCC",
                    limit: 0
                  })).then(function (response_item_informe_tipo_contrato) {
                    var ItemInformeTipoContratoId = response_item_informe_tipo_contrato.data.Data[0].Id;
                    self.objeto_soporte = {
                      "PagoMensualId": {
                        "Id": pago_mensual_id
                      },
                      "Documento": self.id_documento,
                      "ItemInformeTipoContratoId": {
                        "Id": ItemInformeTipoContratoId
                      },
                      "Aprobado": false
                    };
                    cumplidosCrudRequest.post('soporte_pago_mensual', self.objeto_soporte)
                      .then(function (response) {
                        //Bandera de validacion
                        swal({
                          title: 'Documento guardado',
                          text: 'Se ha guardado el documento con exito',
                          type: 'success',
                          target: document.getElementById('modal_visualizar_documento')
                        });
                        $window.location.href = '/#/seguimientoycontrol/tecnico/carga_documentos_contratista';
                      });
                  })
                }
              }).catch(function (error) {
                swal({
                  title: 'Error',
                  text: 'Ocurrio un error al guardar el documento',
                  type: 'error',
                  target: document.getElementById('modal_visualizar_documento')
                });
              });

            } else {

              swal({
                title: 'Error',
                text: 'Ocurrio un error al guardar el documento',
                type: 'error',
                target: document.getElementById('modal_visualizar_documento')
              });

            }
          } else {
            error = true;
            swal({
              title: 'Error',
              text: 'Ocurrio un error al guardar el documento',
              type: 'error',
              target: document.getElementById('modal_visualizar_documento')
            });
          }
        })

      });
    }


  });

angular.module('contractualClienteApp').filter('excludeUsed', function () {
  var filter = function (items, selects, index) {
    var checkItem = function (item) {
      for (let i = 0; i < selects.length; i++) {
        if (i != index) {
          if (item == selects[i].ActividadEspecifica) {
            return false;
          }
        }
      }
      return true;
      //return (item != excludeVal1) && (item != excludeVal2);
    };

    return items.filter(checkItem);
  };

  return filter;
});