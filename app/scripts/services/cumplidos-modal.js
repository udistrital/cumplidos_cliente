// scripts/services/cumplidos-modal.js
(function () {
  // --- Compatibilidad SweetAlert2 ---
  // En algunos despliegues está expuesto como window.Swal (v7+), en otros como window.swal (v6.x).
  if (typeof window.swal !== "function" && typeof window.Swal === "function") {
    window.swal = window.Swal;
  }

  // Enlaza el botón sin usar onclick inline (evita problemas con CSP en release)
  function bindManualesButton() {
    var btn = document.getElementById("btnManuales");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      if (typeof window.swal !== "function") {
        console.error("SweetAlert2 no está cargado (swal/Swal). Revisa que 'bower_components/sweetalert2/dist/sweetalert2.js' se esté sirviendo en release.");
        return;
      }
      openCumplidosModal();
    });
  }

  // Exponemos global por si quieres llamarlo desde otros lugares
  window.openCumplidosModal = function () {
    window.swal({
      title: "Manuales y Videos del Módulo de Cumplidos",
      html: `
        <div style="text-align:left; font-size:14px;">
          <div class="cumplidos-toolbar">
            <input type="text" id="cumplidosSearch" class="form-control cumplidos-search"
                   placeholder="Filtrar por palabra… (ej. 'supervisor', 'video', 'contratistas')">
            <div class="btn-group" role="group" aria-label="Filtros">
              <button type="button" class="btn btn-default btn-xs" id="filterAll">
                <i class="fa fa-list" aria-hidden="true"></i> Todos
              </button>
              <button type="button" class="btn btn-default btn-xs" id="filterPdf">
                <i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF
              </button>
              <button type="button" class="btn btn-default btn-xs" id="filterVideo">
                <i class="fa fa-play-circle" aria-hidden="true"></i> Video
              </button>
            </div>
          </div>

          <div class="cumplidos-grid" id="cumplidosList">
            <div class="group">
              <div class="group-title">Supervisor / Ordenador / Jurídica</div>

              <div class="resource" data-type="pdf">
                <div class="icon pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://udistritaleduco-my.sharepoint.com/:b:/g/personal/computo_udistrital_edu_co/EdGxO4e8BHJEqZVGSYFBrIUBaiLRhSWzdPo4X-8klz05LA?e=1WXKAu"
                       target="_blank" rel="noopener noreferrer">
                      Aprobación del cumplido (Supervisor del contrato)
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-danger cumplidos-badge">PDF</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <div class="resource" data-type="pdf">
                <div class="icon pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://udistritaleduco-my.sharepoint.com/:b:/g/personal/computo_udistrital_edu_co/ESTqW51KEN5CsEw7_ToxdAQBd_ukp4wieBk7GgR6k6um4g?e=17T3hJ"
                       target="_blank" rel="noopener noreferrer">
                      Aprobación y reversión del pago (Ordenador gasto)
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-danger cumplidos-badge">PDF</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <div class="resource" data-type="pdf">
                <div class="icon pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://cutt.ly/KWVoogK" target="_blank" rel="noopener noreferrer">
                      Visualizar cumplidos aprobados (Asistente Jurídica)
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-danger cumplidos-badge">PDF</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="group">
              <div class="group-title">Contratistas</div>

              <div class="resource" data-type="video">
                <div class="icon video"><i class="fa fa-play-circle" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://youtu.be/LHVnafE99X0" target="_blank" rel="noopener noreferrer">
                      Generación de informe y certificado de cumplimiento (Contratistas)
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-info cumplidos-badge">Video</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <div class="resource" data-type="video">
                <div class="icon video"><i class="fa fa-play-circle" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://youtu.be/5kg1gx29rO4" target="_blank" rel="noopener noreferrer">
                      Login y tips de Cumplidos
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-info cumplidos-badge">Video</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <div class="resource" data-type="pdf">
                <div class="icon pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://acortar.link/nJoEDL" target="_blank" rel="noopener noreferrer">
                      Consulta de histórico de cumplidos
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-danger cumplidos-badge">PDF</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>

              <div class="resource" data-type="pdf">
                <div class="icon pdf"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>
                <div class="content">
                  <div class="title">
                    <a href="https://udistritaleduco-my.sharepoint.com/:b:/g/personal/computo_udistrital_edu_co/EUN-nNKIxbtKt70iVqy6oawBGcmstXb7x8PV2lWrKtwnZg?e=qbkzLS"
                       target="_blank" rel="noopener noreferrer">
                      Solicitud de cumplidos (Contratistas)
                    </a>
                  </div>
                  <div class="meta">
                    <span class="label label-danger cumplidos-badge">PDF</span>
                    <i class="fa fa-external-link ext" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      width: 900,
      showCloseButton: true,
      confirmButtonText: "Cerrar",
      allowOutsideClick: true,
      onOpen: function () {
        var container = document.getElementById("cumplidosList");
        var search = document.getElementById("cumplidosSearch");
        var btnAll = document.getElementById("filterAll");
        var btnPdf = document.getElementById("filterPdf");
        var btnVideo = document.getElementById("filterVideo");

        var currentType = "all";

        function applyFilters() {
          var q = (search.value || "").trim().toLowerCase();
          [].slice.call(container.querySelectorAll(".resource")).forEach(function (row) {
            var type = row.getAttribute("data-type");
            var text = row.textContent.toLowerCase();
            var typeMatch = (currentType === "all") || (type === currentType);
            var textMatch = q === "" || text.indexOf(q) > -1;
            row.style.display = (typeMatch && textMatch) ? "flex" : "none";
          });
        }

        function setActive(btn) {
          [btnAll, btnPdf, btnVideo].forEach(function (b) {
            b.classList.remove("btn-primary"); b.classList.add("btn-default");
          });
          btn.classList.remove("btn-default"); btn.classList.add("btn-primary");
        }

        btnAll.addEventListener("click", function () { currentType = "all"; setActive(btnAll); applyFilters(); });
        btnPdf.addEventListener("click", function () { currentType = "pdf"; setActive(btnPdf); applyFilters(); });
        btnVideo.addEventListener("click", function () { currentType = "video"; setActive(btnVideo); applyFilters(); });

        search.addEventListener("keyup", applyFilters);

        setActive(btnAll);
        applyFilters();
      }
    });
  };

  // Enlazamos cuando el DOM esté listo (compatible con CSP)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindManualesButton);
  } else {
    bindManualesButton();
  }
})();
