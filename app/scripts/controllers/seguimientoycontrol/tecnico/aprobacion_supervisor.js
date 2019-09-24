'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:AprobacionSupervisorCtrl
 * @description
 * # AprobacionSupervisorCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('AprobacionSupervisorCtrl', function (token_service, cookie, $sessionStorage, $scope, $http, $translate, uiGridConstants, contratoRequest, administrativaRequest, nuxeo, $q, coreRequest, $window,$sce, adminMidRequest,$routeParams, wso2GeneralService, amazonAdministrativaRequest) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
    var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

    //Se utiliza la variable self estandarizada
    var self = this;
    self.Documento = token_service.getPayload().documento;
    self.objeto_docente = [];
    self.nombres_docentes_incumplidos = '';
    self.mes = {};
    self.dependencias_supervisor = {};

    self.meses = [{
        Id: 1,
        Nombre: $translate.instant('ENERO')
      },
      {
        Id: 2,
        Nombre: $translate.instant('FEBRERO')
      },
      {
        Id: 3,
        Nombre: $translate.instant('MARZO')
      },
      {
        Id: 4,
        Nombre: $translate.instant('ABRIL')
      },
      {
        Id: 5,
        Nombre: $translate.instant('MAYO')
      },
      {
        Id: 6,
        Nombre: $translate.instant('JUNIO')
      },
      {
        Id: 7,
        Nombre: $translate.instant('JULIO')
      },
      {
        Id: 8,
        Nombre: $translate.instant('AGOSTO')
      },
      {
        Id: 9,
        Nombre: $translate.instant('SEPT')
      },
      {
        Id: 10,
        Nombre: $translate.instant('OCTU')
      },
      {
        Id: 11,
        Nombre: $translate.instant('NOV')
      },
      {
        Id: 12,
        Nombre: $translate.instant('DIC')
      }
    ];

    self.d = new Date();
    self.anios = [(self.d.getFullYear()), (self.d.getFullYear() + 1)];

        /*
      Función para obtener la imagen del escudo de la universidad
    */
    $http.get("scripts/models/imagen_ud.json")
     .then(function(response) {
       self.imagen = response.data;
    });

    /*
      Creación tabla que tendrá todos los docentes relacionados al supervisor
    */
    self.gridOptions1 = {
      enableSorting: true,
      enableFiltering: true,
      resizable: true,
      rowHeight: 40,
      columnDefs: [
        {
          field: 'NombreDependencia',
          cellTemplate: tmpl,
          displayName: 'DEPENDENCIA',//$translate.instant('PRO_CURR')//,
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "15%"
        },
        {
          field: 'PagoMensual.Persona',
          cellTemplate: tmpl,
          displayName: $translate.instant('DOCUMENTO'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
          width: "15%"
        },
        {
          field: 'NombrePersona',
          cellTemplate: tmpl,
          displayName: 'NOMBRE CONTRATISTA',//$translate.instant('NAME_TEACHER'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },

        {
          field: 'PagoMensual.NumeroContrato',
          cellTemplate: tmpl,
          displayName: 'NUMERO CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.VigenciaContrato',
          cellTemplate: tmpl,
          displayName: 'VIGENCIA CONTRATO',
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.Mes',
          cellTemplate: tmpl,
          displayName: $translate.instant('MES_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
        {
          field: 'PagoMensual.Ano',
          cellTemplate: tmpl,
          displayName: $translate.instant('ANO_SOLICITUD'),
          sort: {
            direction: uiGridConstants.ASC,
            priority: 1
          },
        },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="Ver soportes" type="button" class="fa fa-eye fa-lg  faa-shake animated-hover"' +
          'ng-click="grid.appScope.aprobacionSupervisor.obtener_doc(row.entity.PagoMensual)" data-toggle="modal" data-target="#modal_ver_soportes"</a>&nbsp;' +
          '<a type="button" title="Visto bueno" type="button" class="fa fa-check fa-lg  faa-shake animated-hover"' +
          'ng-click="grid.appScope.aprobacionSupervisor.dar_visto_bueno(row.entity.PagoMensual)"></a>&nbsp;'+
          '<a type="button" title="Rechazar" type="button" class="fa fa-close fa-lg  faa-shake animated-hover"' +
          'ng-click="grid.appScope.aprobacionSupervisor.rechazar(row.entity.PagoMensual)"></a>',
        width: "10%"
      }
      ]
};


    /*
      Función que permite obtener la data de la fila seleccionada
    */
    self.gridOptions1.onRegisterApi = function (gridApi) {
      self.gridApi = gridApi;
    };



    /*
    Función que al recibir el número de documento del coordinador cargue los correspondientes
    */
    self.obtener_contratistas_supervisor = function () {
      self.gridOptions1.data = [];


      self.obtener_informacion_supervisor(self.Documento);
      //Petición para obtener el Id de la relación de acuerdo a los campos
      adminMidRequest.get('aprobacion_pago/solicitudes_supervisor_contratistas/' + self.Documento).then(function (response) {
        self.documentos = response.data;
        //console.log(self.documentos);
        //self.obtener_informacion_docente();
        self.gridOptions1.data = self.documentos;
        self.gridApi.core.refresh();

      });
};


    /*
      Función que obtiene la información correspondiente al supervisor
    */
    self.obtener_informacion_supervisor = function (documento) {
      //Se realiza petición a servicio de academica que retorna la información del coordinador
      amazonAdministrativaRequest.get('informacion_proveedor', $.param({
        query: "NumDocumento:" + documento,
        limit: 0
      })).then(function (response) {
        //console.log(response.data);
        //Información contratista
        self.info_supervisor = response.data;
        self.nombre_supervisor = self.info_supervisor[0].NomProveedor;
        //console.log(self.nombre_supervisor);
    });
  };

    /**/

    self.obtener_contratistas_supervisor();

    self.dar_visto_bueno = function (pago_mensual) {
      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
      .then(function (response) {
        self.aux_pago_mensual = pago_mensual;

        self.contrato = response.data.contrato;

        //Obtiene la información correspondiente del ordenador
        adminMidRequest.get('aprobacion_pago/informacion_ordenador/' + self.contrato.numero_contrato + '/' + pago_mensual.VigenciaContrato)
        .then(function (responseOrdenador){
          self.ordenador = responseOrdenador.data;
          self.aux_pago_mensual.Responsable = self.ordenador.NumeroDocumento.toString();
          self.aux_pago_mensual.CargoResponsable = self.ordenador.Cargo;




        administrativaRequest.get('estado_pago_mensual', $.param({
          limit: 0,
          query: 'CodigoAbreviacion:AS'
        })).then(function (responseCod) {

          var sig_estado = responseCod.data;
          //console.log(sig_estado);
          self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;

          //console.log(self.aux_pago_mensual);


          administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual)
          .then(function (response) {
            swal(
              'Error',
              'No se ha podido registrar la validación del supervisor',
              'error'
            );



         })//Termina promesa then

         //Manejo de error
         .catch(function(response) {
             swal(
               'Visto bueno ',
               'Tiene la validación del supervisor del contrato',
               'success'
             )
             self.obtener_contratistas_supervisor();
             self.gridApi.core.refresh();
           });

        })
     });
     });

    };

    self.rechazar = function (pago_mensual) {

      contratoRequest.get('contrato', pago_mensual.NumeroContrato + '/' + pago_mensual.VigenciaContrato)
      .then(function (response) {
        self.aux_pago_mensual = pago_mensual;
       // self.contrato = response.data.contrato;
        //self.aux_pago_mensual.Responsable = self.contrato.supervisor.documento_identificacion;

        administrativaRequest.get('estado_pago_mensual', $.param({
          limit: 0,
          query: 'CodigoAbreviacion:RS'
        })).then(function (responseCod) {

          var sig_estado = responseCod.data;
          self.aux_pago_mensual.EstadoPagoMensual.Id = sig_estado[0].Id;

          administrativaRequest.put('pago_mensual', self.aux_pago_mensual.Id, self.aux_pago_mensual)
          .then(function (response) {
              swal(
                'Error',
                'No se ha podido registrar el rechazo',
                'error'
              );




          })//Termina promesa then

          //Manejo de error
          .catch(function(response) {
                swal(
                  'Rechazo registrado',
                  'Se ha registrado el rechazo de los soportes',
                  'success'
                )
                self.obtener_contratistas_supervisor();
                self.gridApi.core.refresh();
            });

        })
      });

    };

    /*
      Función para ver los soportes de los contratistas a cargo
    */
    self.obtener_doc = function (fila){
      self.fila_sol_pago = fila;
      var nombre_docs = self.fila_sol_pago.VigenciaContrato + self.fila_sol_pago.NumeroContrato + self.fila_sol_pago.Persona + self.fila_sol_pago.Mes + self.fila_sol_pago.Ano;
      coreRequest.get('documento', $.param ({
       query: "Nombre:" + nombre_docs + ",Activo:true",
       limit:0
     })).then(function(response){
       //console.log(self.documentos);
       self.documentos = response.data;
       angular.forEach(self.documentos, function(value) {
         self.descripcion_doc = value.Descripcion;
         value.Contenido = JSON.parse(value.Contenido);
       });
     })
   };

   /*
     Función que permite obtener un documento de nuxeo por el Id
   */
   self.getDocumento = function(docid){
    nuxeo.header('X-NXDocumentProperties', '*');

    self.obtenerDoc = function () {
      var defered = $q.defer();

      nuxeo.request('/id/'+docid)
          .get()
          .then(function(response) {
            self.doc=response;
            var aux=response.get('file:content');
            self.document=response;
            defered.resolve(response);
          })
          .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

    self.obtenerFetch = function (doc) {
      var defered = $q.defer();

      doc.fetchBlob()
        .then(function(res) {
          defered.resolve(res.blob());

        })
        .catch(function(error){
              defered.reject(error)
          });
      return defered.promise;
    };

      self.obtenerDoc().then(function(){

         self.obtenerFetch(self.document).then(function(r){
             self.blob=r;
             var fileURL = URL.createObjectURL(self.blob);
             self.content = $sce.trustAsResourceUrl(fileURL);
             $window.open(fileURL, 'Soporte', 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900', true);
          });
      });
    };


    /*
      Función para enviar un comentario en el soporte    */
    self.enviar_comentario = function(documento){
        swal({
          title: '¿Está seguro(a) de enviar la observación?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar'
        }).then(function () {
             documento.Contenido = JSON.stringify(documento.Contenido);
             coreRequest.put('documento', documento.Id, documento).
             then(function(response){
              swal({
                title: 'Error',
                text: 'No se ha podido guardar el comentario',
                type: 'error',
                target: document.getElementById('modal_ver_soportes')
              });

            })

            //Manejo de error
            .catch(function(response) {

              swal({
                title: 'Comentario guardado',
                text: 'Se ha guardado el comentario del documento',
                type: 'success',
                target: document.getElementById('modal_ver_soportes')
              });
              self.obtener_doc(self.fila_sol_pago);

            });

        });
    };

    /*
      Función que obtiene las dependencias que se encuentran a cargo del supervisor
    */
    self.obtenerDependenciasSupervisor = function (){
      contratoRequest.get('dependencias_supervisor', self.Documento)
      .then(function (response) {
        self.dependencias_supervisor= response.data;
        console.log(self.dependencias_supervisor);
      });


    };
    self.obtenerDependenciasSupervisor();

    /*
      Función que genera el documento de quienes cumplieron con sus obligaciones
    */
    self.generarPDF = function (){
       self.mes.Id =  parseInt(self.mes.Id);

            if(self.mes.Id/10<1){

              self.mes.Id = '0'+self.mes.Id.toString();

            }

            adminMidRequest.get('aprobacion_pago/certificacion_cumplidos_contratistas/'+ self.dependencia.codigo+'/' + self.mes.Id + '/' + self.anio).
              then(function(responseMid){

               //console.log(responseMid.data[0]['Rubro']);
               self.docentes_incumplidos = responseMid.data;

                
               // self.facultad = responseHom.data[0];

                var date = new Date()
                var dia = moment(date).format('D');
                var mes = moment(date).format('M');
                var anio = moment(date).format('YYYY');
                var contenidoInv = [];
                var contenidoFun = [];
                
                var tablaInv =   {
                  style: 'tableExample',
                  table: {
                    body: [
                      ['Documento', 'Nombre', 'Contrato', 'Vigencia', 'Rubro' ]
                    ]
                  }
                }
                var tablaFun =   {
                  style: 'tableExample',
                  table: {
                    body: [
                      ['Documento', 'Nombre', 'Contrato', 'Vigencia', 'Rubro' ]
                    ]
                  }
                }
                var inversion = [];
                var funcionamiento = [];

                angular.forEach(self.docentes_incumplidos, function(value) {
                   if(value.Rubro=='Inversión'){
                      inversion.push(value);
                   }
                   else{
                      funcionamiento.push(value);
                   }
                });
                
                

                if(inversion.length>0 ){
                   contenidoInv.push( {text:'EL JEFE DE LA DEPENDENCIA ' +  self.dependencia.nombre  + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                   contenidoInv.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                   contenidoInv.push({text:'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
                   angular.forEach(inversion, function(valueInv) {
                   tablaInv.table.body.push([ valueInv.NumDocumento , valueInv.Nombre, valueInv.NumeroContrato , valueInv.Vigencia, valueInv.Rubro]);
                   });
                   contenidoInv.push(tablaInv);
                   contenidoInv.push('\n',{text:'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes-1].Nombre + ' de ' + anio +'.',  style:'general_font'}, '\n\n\n\n\n\n');
                   contenidoInv.push({text:'' + self.nombre_supervisor, style:'bottom_space'});
                   contenidoInv.push({text:'JEFE DE', style:'bottom_space'});
                   contenidoInv.push({text: self.dependencia.nombre , style:'bottom_space'});
                   //contenido.push({pageBreak: 'after'}); 
                }
                if(funcionamiento.length>0){
                   contenidoFun.push( {text:'EL JEFE DE LA DEPENDENCIA ' +  self.dependencia.nombre  + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                   contenidoFun.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                   contenidoFun.push({text:'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
                   angular.forEach(funcionamiento, function(valueFun) {
                   tablaFun.table.body.push([ valueFun.NumDocumento , valueFun.Nombre, valueFun.NumeroContrato , valueFun.Vigencia, valueFun.Rubro]);
                   });
                   contenidoFun.push(tablaFun);
                   contenidoFun.push('\n',{text:'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes-1].Nombre + ' de ' + anio +'.',  style:'general_font'}, '\n\n\n\n\n\n');
                   contenidoFun.push({text:'' + self.nombre_supervisor, style:'bottom_space'});
                   contenidoFun.push({text:'JEFE DE', style:'bottom_space'});
                   contenidoFun.push({text: self.dependencia.nombre , style:'bottom_space'});

                }
               

            /*
                //console.log(self.contenido);
                contenido.push( {text:'EL JEFE DE LA DEPENDENCIA ' +  self.dependencia.nombre  + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                //console.log(self.contenido);
                contenido.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                if(self.docentes_incumplidos){
                contenido.push({text:'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
                  angular.forEach(self.docentes_incumplidos, function(value) {
                   tabla.table.body.push([ value.NumDocumento , value.Nombre, value.NumeroContrato , value.Vigencia, value.Rubro]);
                 });
                 contenido.push(tabla);
                }else{
                contenido.push({text:'Ninguno de los contratos de prestación de servicios bajo esta supervisión cumplió con las actividades del objeto establecido en el contrato o con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')

                  
                }
                //contenido.push( );
                contenido.push('\n',{text:'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes-1].Nombre + ' de ' + anio +'.',  style:'general_font'}, '\n\n\n\n\n\n');
                contenido.push({text:'' + self.nombre_supervisor, style:'bottom_space'});
                contenido.push({text:'JEFE DE', style:'bottom_space'});
                contenido.push({text: self.dependencia.nombre , style:'bottom_space'});*/


                //Generación documento
                var docDefinitionInv = {
                  footer: function (currentPage, pageCount) {  
                    var columns = [
                       {
                        text:  'Inversión ' + currentPage.toString() + ' de ' + pageCount ,
                        width: 'auto',
                        alignment: 'right',
                        fontSize: 10,
                        margin: [5, 5,15,10],
                       }
                      ]
                    return columns;
                  }, 
                  pageMargins: [30, 140, 40, 40],
                  header: {
                   height: 120,
                   width: 120,
                   image: self.imagen.imagen,
                   margin: [100, 15,5,5],
                   alignment: 'center'
                 },
                 content: contenidoInv,
                 styles: {
                   top_space: {
                     fontSize: 11,
                     marginTop: 30
                   },
                   bottom_space: {
                     fontSize: 12,
                     bold: true,
                     alignment:'center'
                     //marginBottom: 30
                   },
                   general_font:{
                     fontSize: 11,
                     alignment: 'justify'
                   },
                   lista:{
                     fontSize: 9,
                     alignment:'justify'
                   }
                 }
                }
                var docDefinitionFun = {
                  footer: function (currentPage, pageCount) {  
                    var columns = [
                       {
                        text:  'Funcionamiento ' + currentPage.toString() + ' de ' + pageCount ,
                        width: 'auto',
                        alignment: 'right',
                        fontSize: 10,
                        margin: [5, 5,15,10],
                       }
                      ]
                    return columns;
                  },
                 pageMargins: [30, 140, 40, 40],
                  header: {
                   height: 120,
                   width: 120,
                   image: self.imagen.imagen,
                   margin: [100, 15,5,5],
                   alignment: 'center'
                 }, 
                 content: contenidoFun,
                 styles: {
                   top_space: {
                     fontSize: 11,
                     marginTop: 30
                   },
                   bottom_space: {
                     fontSize: 12,
                     bold: true,
                     alignment:'center'
                     //marginBottom: 30
                   },
                   general_font:{
                     fontSize: 11,
                     alignment: 'justify'
                   },
                   lista:{
                     fontSize: 9,
                     alignment:'justify'
                   }
                 }
                }

                //Variable para obtener la fecha y hora que se genera el dcoumento
                var date = new Date();
                date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');
                if(inversion.length>0){
                  pdfMake.createPdf(docDefinitionInv).download('Certificación cumplido Inversión ' + date + '.pdf');
                }
                if(funcionamiento.length>0){
                  pdfMake.createPdf(docDefinitionFun).download('Certificación cumplido Funcionamiento' + date + '.pdf');  
                }
                
              //  pdfMake.createPdf(docDefinition).download('Certificación cumplido coordinación ' + date + '.pdf');
               }).catch(function(responseMid){//nulos
                self.docentes_incumplidos = undefined;
                 // self.facultad = responseHom.data[0];
 
                 var date = new Date()
                 var dia = moment(date).format('D');
                 var mes = moment(date).format('M');
                 var anio = moment(date).format('YYYY');
                 var contenido = [];
                 var tabla =  {
                   style: 'tableExample',
                   table: {
                     body: [
                       ['Documento', 'Nombre', 'Contrato', 'Vigencia', 'Rubro' ]
                     ]
                   }
                 }
                 //console.log(self.contenido);
                 contenido.push( {text:'EL JEFE DE LA DEPENDENCIA ' +  self.dependencia.nombre  + ' DE LA UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                 //console.log(self.contenido);
                 contenido.push({text:'CERTIFICA QUE: ', bold: true,  alignment: 'center', style:'top_space'}, '\n\n\n\n');
                 if(self.docentes_incumplidos){
                 contenido.push({text:'Los contratos de prestación de servicios bajo esta supervisión listados a continuación cumplieron a satisfacción con el objeto establecido en el contrato y con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
                   angular.forEach(self.docentes_incumplidos, function(value) {
                    tabla.table.body.push([ value.NumDocumento , value.Nombre, value.NumeroContrato , value.Vigencia, value.Rubro]);
                  });
                  contenido.push(tabla);
                 }else{
                 contenido.push({text:'Ninguno de los contratos de prestación de servicios bajo esta supervisión cumplió con las actividades del objeto establecido en el contrato o con el pago reglamentario de los aportes al sistema de seguridad social del Mes de '  +self.mes.Nombre+ ' de ' +self.anio+ '.', style:'general_font'}, '\n\n')
 
                   
                 }
                 //contenido.push(  );
                 contenido.push('\n',{text:'Se expide para el trámite de pago ante la DIVISIÓN DE RECURSOS FINANCIEROS al mes de ' + self.meses[mes-1].Nombre + ' de ' + anio +'.',  style:'general_font'}, '\n\n\n\n\n\n');
                 contenido.push({text:'' + self.nombre_supervisor, style:'bottom_space'});
                 contenido.push({text:'JEFE DE', style:'bottom_space'});
                 contenido.push({text: self.dependencia.nombre , style:'bottom_space'});
 
 
                 //Generación documento
                 var docDefinition = {
                   pageMargins: [30, 140, 40, 40],
                   header: {
                    height: 120,
                    width: 120,
                    image: self.imagen.imagen,
                    margin: [100, 15,5,5],
                    alignment: 'center'
                  },
                  content: contenido,
                  styles: {
                    top_space: {
                      fontSize: 11,
                      marginTop: 30
                    },
                    bottom_space: {
                      fontSize: 12,
                      bold: true,
                      alignment:'center'
                      //marginBottom: 30
                    },
                    general_font:{
                      fontSize: 11,
                      alignment: 'justify'
                    },
                    lista:{
                      fontSize: 9,
                      alignment:'justify'
                    }
                  }
                 }
 
                 //Variable para obtener la fecha y hora que se genera el dcoumento
                 var date = new Date();
                 date = moment(date).format('DD_MMM_YYYY_HH_mm_ss');
                 pdfMake.createPdf(docDefinition).download('Certificación cumplido ' + date + '.pdf');
  
 
 
               //  pdfMake.createPdf(docDefinition).download('Certificación cumplido coordinación ' + date + '.pdf');
                }



               );
          
    };


  });
