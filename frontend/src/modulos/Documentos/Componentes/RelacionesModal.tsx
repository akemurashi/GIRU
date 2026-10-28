import { useState } from "react";
import { useDocumentCanonicalDetail } from "../../../services/relacionService";

type RelacionesModalProps = {
  documentId: string;
  onClose: () => void;
  onVerDocumento?: (id: string) => void;
};

const getTipoRelacionBadge = (nombreTipo?: string) => {
  const norm = (nombreTipo || "").trim().toLowerCase();
  if (norm.includes("deroga")) {
    return "bg-rose-100 text-rose-800 border-rose-200 ring-rose-300";
  }
  if (norm.includes("modifica")) {
    return "bg-amber-100 text-amber-800 border-amber-200 ring-amber-300";
  }
  if (norm.includes("reemplaza")) {
    return "bg-purple-100 text-purple-800 border-purple-200 ring-purple-300";
  }
  return "bg-blue-100 text-blue-800 border-blue-200 ring-blue-300";
};

export const RelacionesModal = ({
  documentId,
  onClose,
  onVerDocumento,
}: RelacionesModalProps) => {
  const [activeTab, setActiveTab] = useState<"origen" | "destino">("origen");

  const {
    data: docDetail,
    isLoading,
    error,
    refetch,
  } = useDocumentCanonicalDetail(documentId);

  const relsOrigen = docDetail?.relaciones_como_origen ?? [];
  const relsDestino = docDetail?.relaciones_como_destino ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="relaciones-modal-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-linear-to-r from-sidebar to-[#1769AA] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
              <i className="pi pi-share-alt text-xl" />
            </div>
            <div>
              <h2
                id="relaciones-modal-title"
                className="m-0 text-base font-bold sm:text-lg"
              >
                Trazabilidad y Linaje Jurídico
              </h2>
              <p className="m-0 text-xs text-blue-100">
                {docDetail?.numero
                  ? `Norma ${docDetail.numero} · `
                  : ""}
                {docDetail?.titulo || "Cargando documento..."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <i className="pi pi-times text-lg" />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#004B85]" />
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Consultando linaje y relaciones normativas...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <i className="pi pi-exclamation-circle text-3xl text-red-600" />
              <p className="mt-2 text-sm font-semibold text-red-800">
                No se pudo cargar la información de relaciones.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div>
              {/* TABS DE RELACIONES */}
              <div className="mb-5 flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("origen")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "origen"
                      ? "border-sidebar text-sidebar"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <i className="pi pi-arrow-up-right text-xs" />
                  Normas que modifica o deroga
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "origen"
                        ? "bg-blue-100 text-sidebar font-bold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {relsOrigen.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("destino")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === "destino"
                      ? "border-sidebar text-sidebar"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <i className="pi pi-arrow-down-left text-xs" />
                  Normas que modifican o derogan a este
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "destino"
                        ? "bg-blue-100 text-sidebar font-bold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {relsDestino.length}
                  </span>
                </button>
              </div>

              {/* LISTADO TAB: ORIGEN */}
              {activeTab === "origen" && (
                <div className="space-y-3">
                  {relsOrigen.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                      <i className="pi pi-info-circle mb-2 text-2xl text-slate-400" />
                      <p className="m-0 text-sm">
                        Este documento no tiene registradas modificaciones, derogaciones ni complementos sobre otros documentos.
                      </p>
                    </div>
                  ) : (
                    relsOrigen.map((rel, index) => {
                      const tipo = rel.nombretiporelacion || "Vínculo legal";
                      const docDestino = rel.documentodestino;
                      const badgeCls = getTipoRelacionBadge(tipo);

                      return (
                        <div
                          key={rel.idrelacion || index}
                          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ring-1 ${badgeCls}`}
                              >
                                {tipo}
                              </span>

                              {rel.fechaefecto && (
                                <span className="text-xs text-slate-500">
                                  <i className="pi pi-calendar mr-1 text-[11px]" />
                                  Efecto: {String(rel.fechaefecto).slice(0, 10)}
                                </span>
                              )}

                              {rel.verificada && (
                                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  <i className="pi pi-check text-[10px]" />
                                  Verificada
                                </span>
                              )}
                            </div>

                            <p className="m-0 text-sm font-semibold text-slate-900">
                              {docDestino?.numero
                                ? `${docDestino.numero} · `
                                : ""}
                              {docDestino?.titulo || `Documento ID: ${rel.iddocumentodestino}`}
                            </p>

                            {rel.detalledemodificacion && (
                              <p className="m-0 mt-1.5 text-xs text-slate-600">
                                <span className="font-medium text-slate-700">
                                  Detalle:
                                </span>{" "}
                                {rel.detalledemodificacion}
                              </p>
                            )}
                          </div>

                          {onVerDocumento && (
                            <button
                              type="button"
                              onClick={() => onVerDocumento(rel.iddocumentodestino)}
                              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                            >
                              <i className="pi pi-external-link text-[11px]" />
                              Consultar norma
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* LISTADO TAB: DESTINO */}
              {activeTab === "destino" && (
                <div className="space-y-3">
                  {relsDestino.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                      <i className="pi pi-check-circle mb-2 text-2xl text-emerald-500" />
                      <p className="m-0 text-sm">
                        Este documento no ha sido modificado ni derogado por documentos posteriores.
                      </p>
                    </div>
                  ) : (
                    relsDestino.map((rel, index) => {
                      const tipo = rel.nombretiporelacion || "Vínculo legal";
                      const docOrigen = rel.documentoorigen;
                      const badgeCls = getTipoRelacionBadge(tipo);

                      return (
                        <div
                          key={rel.idrelacion || index}
                          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ring-1 ${badgeCls}`}
                              >
                                {tipo}
                              </span>

                              {rel.fechaefecto && (
                                <span className="text-xs text-slate-500">
                                  <i className="pi pi-calendar mr-1 text-[11px]" />
                                  Efecto: {String(rel.fechaefecto).slice(0, 10)}
                                </span>
                              )}

                              {rel.verificada && (
                                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  <i className="pi pi-check text-[10px]" />
                                  Verificada
                                </span>
                              )}
                            </div>

                            <p className="m-0 text-sm font-semibold text-slate-900">
                              {docOrigen?.numero
                                ? `${docOrigen.numero} · `
                                : ""}
                              {docOrigen?.titulo || `Documento ID: ${rel.iddocumentoorigen}`}
                            </p>

                            {rel.detalledemodificacion && (
                              <p className="m-0 mt-1.5 text-xs text-slate-600">
                                <span className="font-medium text-slate-700">
                                  Detalle:
                                </span>{" "}
                                {rel.detalledemodificacion}
                              </p>
                            )}
                          </div>

                          {onVerDocumento && (
                            <button
                              type="button"
                              onClick={() => onVerDocumento(rel.iddocumentoorigen)}
                              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                            >
                              <i className="pi pi-external-link text-[11px]" />
                              Consultar norma
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-sidebar px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
