"use strict";

/**
 * @ngdoc service
 * @name funcionalidadesGeneralesService.funcGen
 * @description
 * # funcGen
 * Factory in the funcionalidadesGeneralesService.
 */
angular
  .module("funcionalidadesGeneralesService", [])
  .factory("funcGen", function (cumplidosMidRequest, utils, $window) {
    // Service logic
    // ...
    // Public API here
    return {
      /*
             Función para ver los soportes de los contratistas a cargo
            */
      obtener_doc: function (pago_mensual_id) {
        return new Promise((resolve, reject) => {
          var documentos = {};
          cumplidosMidRequest
            .get(
              "contratos_contratista/documentos_pago_mensual/" + pago_mensual_id
            )
            .then(function (response) {
              if (response.data.Status === "200") {
                documentos = response.data.Data;
                angular.forEach(documentos, function (soporte) {
                  soporte.Documento.Metadatos = JSON.parse(
                    soporte.Documento.Metadatos
                  );
                });
              } else {
                documentos = undefined;
                swal(
                  "Error",
                  "Ocurrio un error al traer los registros",
                  "error"
                );
                reject(undefined);
              }
              resolve(documentos);
            })
            .catch(function (error) {
              swal("Error", "Ocurrio un error al traer los registros", "error");
              reject(undefined);
            });
        });
      },

      /*
             Función que permite obtener y mostrar un documento de nuxeo por el Id
            */
      getDocumento: function (file_base64, nameWindow) {
        var file = new Blob([utils.base64ToArrayBuffer(file_base64)], {
          type: "application/pdf",
        });
        var fileURL = URL.createObjectURL(file);
        $window.open(
          fileURL,
          nameWindow,
          "resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900"
        );
      },

      //Funcion para decargar rar con documentos de un pago
      getRar: function (fileJson) {
        let file = new Blob([utils.base64ToArrayBuffer(fileJson.file)], {
          type: "application/zip",
        });
        let fileURL = URL.createObjectURL(file);

        let link = document.createElement("a");
        link.href = fileURL;
        link.download = fileJson.nombre;
        link.click();
        URL.revokeObjectURL(fileURL);
      },
    };
  });
