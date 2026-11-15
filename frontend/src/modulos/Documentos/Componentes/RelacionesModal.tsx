import { useState } from "react";
import {
  useDocumentTrazabilidad,
  resolveDocumentoPorTitulo,
  type DocumentoTrazabilidadResponse,
  type HitoNormativo,
} from "../../../services/relacionService";

type RelacionesModalProps = Readonly<{
  documentId: string;
  onClose: () => void;
  onVerDocumento?: (id: string) => void;
}>;

/**
 * Formatea una fecha ISO YYYY-MM-DD en localización chilena (es-CL)
 * evitando desfases de zona horaria.
 */
const formatearFechaHito = (hito: HitoNormativo): string => {
  if (hito.fecha) {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(hito.fecha.trim());
    if (match) {
      const date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      );
      return date.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    const parsed = new Date(hito.fecha);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  if (hito.anio) {
    return `Año ${hito.anio}`;
  }

  return "Fecha no registrada";
};

const obtenerAnioHito = (hito: HitoNormativo): number | null => {
  if (hito.anio) {
    return hito.anio;
  }
  if (hito.fecha && /^\d{4}/.test(hito.fecha)) {
    return Number(hito.fecha.slice(0, 4));
  }
  return null;
};

const obtenerTextoVigencia = (
  estado: string | { id: number; nombre: string } | null | undefined
): string => {
  if (!estado) return "Vigente";
  if (typeof estado === "string") return estado;
  return estado.nombre || "Vigente";
};

const obtenerClaseVigencia = (estadoTexto: string): string => {
  const norm = estadoTexto.trim().toLowerCase();
  if (norm.includes("vigente") && !norm.includes("no")) {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }
  if (norm.includes("derogad")) {
    return "bg-rose-100 text-rose-800 border-rose-200";
  }
  if (norm.includes("modificad")) {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

type HitoTimelineItemProps = Readonly<{
  hito: HitoNormativo;
  etapa: "antes" | "despues";
  resolvingArchivo: string | null;
  onOpenArchivo: (nombreArchivo: string) => void;
}>;

const HitoTimelineItem = ({
  hito,
  etapa,
  resolvingArchivo,
  onOpenArchivo,
}: HitoTimelineItemProps) => {
  const nombreArchivo = hito.nombre_archivo?.trim() ?? "";
  const tieneArchivo = nombreArchivo !== "";
  const isResolving = tieneArchivo && resolvingArchivo === hito.nombre_archivo;
  const anioMostrar = obtenerAnioHito(hito);
  const esAntes = etapa === "antes";

  const nodoColor = esAntes
    ? "border-amber-500 text-amber-600"
    : "border-sky-600 text-sky-600";
  const puntoColor = esAntes ? "bg-amber-500" : "bg-sky-600";
  const badgeColor = esAntes
    ? "bg-amber-50 text-amber-800 border border-amber-200"
    : "bg-sky-50 text-sky-800 border border-sky-200";
  const etapaTexto = esAntes ? "Antecedente" : "Posterior";

  const botonArchivoContenido = isResolving ? (
    <>
      <i className="pi pi-spin pi-spinner text-[11px]" />
      <span>Abriendo...</span>
    </>
  ) : (
    <>
      <i className="pi pi-file-pdf text-[11px]" />
      <span>Ver documento</span>
    </>
  );

  return (
    <div className="relative pl-8">
      <span
        className={`absolute left-0 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white shadow-xs ${nodoColor}`}
        aria-hidden="true"
      >
        <span className={`h-2 w-2 rounded-full ${puntoColor}`} />
      </span>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badgeColor}`}
            >
              {etapaTexto}
            </span>

            {anioMostrar && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {anioMostrar}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 text-xs text-slate-500">
            <i className="pi pi-calendar text-[11px]" />
            <span>{formatearFechaHito(hito)}</span>
          </span>
        </div>

        <p className="m-0 text-sm font-bold text-slate-900">{hito.decreto}</p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
          {tieneArchivo ? (
            <>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                <i className="pi pi-check-circle text-[11px]" />
                <span>Documento digitalizado</span>
              </span>

              <button
                type="button"
                disabled={isResolving}
                onClick={() => onOpenArchivo(hito.nombre_archivo!)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-sidebar px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:cursor-wait disabled:opacity-60"
              >
                {botonArchivoContenido}
              </button>
            </>
          ) : (
            <span
              className="inline-flex cursor-default items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
              title="Norma histórica no digitalizada en el corpus"
            >
              <i className="pi pi-info-circle text-[11px] text-slate-400" />
              <span>Norma histórica no digitalizada</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

type TimelineBodyProps = Readonly<{
  docTrazabilidad: DocumentoTrazabilidadResponse | null | undefined;
  resolvingArchivo: string | null;
  onOpenArchivo: (nombreArchivo: string) => void;
}>;

const TimelineBody = ({
  docTrazabilidad,
  resolvingArchivo,
  onOpenArchivo,
}: TimelineBodyProps) => {
  const trazabilidad = docTrazabilidad?.trazabilidad;
  const antes = trazabilidad?.antes ?? [];
  const despues = trazabilidad?.despues ?? [];
  const cantAntes = trazabilidad?.cant_antes ?? antes.length;
  const cantDespues = trazabilidad?.cant_despues ?? despues.length;
  const sinHistorial = cantAntes === 0 && cantDespues === 0;

  const estadoTexto = obtenerTextoVigencia(docTrazabilidad?.estadovigencia);
  const claseVigencia = obtenerClaseVigencia(estadoTexto);

  return (
    <div className="relative">
      <div
        className="absolute bottom-4 left-2.25 top-4 w-0.5 bg-slate-200"
        aria-hidden="true"
      />

      <div className="space-y-5">
        {antes.length > 0 && (
          <div className="space-y-3">
            <div className="relative flex items-center gap-2 pl-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hitos Anteriores ({antes.length})
              </span>
            </div>

            {antes.map((hito) => (
              <HitoTimelineItem
                key={`antes-${hito.decreto}-${hito.fecha ?? ""}-${hito.anio ?? ""}-${hito.nombre_archivo ?? ""}`}
                hito={hito}
                etapa="antes"
                resolvingArchivo={resolvingArchivo}
                onOpenArchivo={onOpenArchivo}
              />
            ))}
          </div>
        )}

        <div className="relative pl-8">
          <span
            className="absolute left-0 top-5 flex h-5 w-5 items-center justify-center rounded-full bg-sidebar text-white ring-4 ring-blue-100"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>

          <div className="rounded-xl border-2 border-sidebar bg-blue-50/70 p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar px-2.5 py-0.5 text-[11px] font-bold text-white">
                <i className="pi pi-bookmark-fill text-[10px]" />
                <span>Documento actual</span>
              </span>

              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${claseVigencia}`}
              >
                {estadoTexto}
              </span>
            </div>

            <p className="m-0 text-sm font-bold text-slate-900 sm:text-base">
              {docTrazabilidad?.titulo || "Documento seleccionado"}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              {docTrazabilidad?.numero && (
                <span className="font-semibold text-sidebar">
                  N° {docTrazabilidad.numero}
                </span>
              )}
              {docTrazabilidad?.nommetadato && (
                <span className="rounded border border-slate-200 bg-white/80 px-2 py-0.5 font-mono text-[11px] text-slate-700">
                  {docTrazabilidad.nommetadato}
                </span>
              )}
            </div>
          </div>
        </div>

        {despues.length > 0 && (
          <div className="space-y-3">
            <div className="relative flex items-center gap-2 pl-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hitos Posteriores ({despues.length})
              </span>
            </div>

            {despues.map((hito) => (
              <HitoTimelineItem
                key={`despues-${hito.decreto}-${hito.fecha ?? ""}-${hito.anio ?? ""}-${hito.nombre_archivo ?? ""}`}
                hito={hito}
                etapa="despues"
                resolvingArchivo={resolvingArchivo}
                onOpenArchivo={onOpenArchivo}
              />
            ))}
          </div>
        )}

        {sinHistorial && (
          <div className="relative pl-8">
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
              <i className="pi pi-info-circle mb-2 text-2xl text-slate-400" />
              <p className="m-0 text-sm font-medium text-slate-700">
                Sin modificaciones registradas
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                Este documento normativo no registra modificaciones anteriores ni
                posteriores en el corpus institucional.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const obtenerTextoSincronizacion = (
  ultimaSincronizacion: string | null | undefined
): string => {
  if (!ultimaSincronizacion) {
    return "Trazabilidad institucional G.I.R.U.";
  }
  return `Sincronizado: ${new Date(ultimaSincronizacion).toLocaleDateString("es-CL")}`;
};

type PanelBodyStateProps = Readonly<{
  isLoading: boolean;
  error: unknown;
  docTrazabilidad: DocumentoTrazabilidadResponse | null | undefined;
  resolvingArchivo: string | null;
  onRetry: () => void;
  onOpenArchivo: (archivo: string) => void;
}>;

const PanelBodyState = ({
  isLoading,
  error,
  docTrazabilidad,
  resolvingArchivo,
  onRetry,
  onOpenArchivo,
}: PanelBodyStateProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#004B85]" />
        <p className="mt-4 text-sm font-semibold text-slate-700">
          Consultando línea de tiempo normativa...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <i className="pi pi-exclamation-circle text-3xl text-red-600" />
        <p className="mt-2 text-sm font-semibold text-red-800">
          No se pudo cargar la trazabilidad del documento.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <TimelineBody
      docTrazabilidad={docTrazabilidad}
      resolvingArchivo={resolvingArchivo}
      onOpenArchivo={onOpenArchivo}
    />
  );
};

export const RelacionesModal = ({
  documentId,
  onClose,
  onVerDocumento,
}: RelacionesModalProps) => {
  const [resolvingArchivo, setResolvingArchivo] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const {
    data: docTrazabilidad,
    isLoading,
    error,
    refetch,
  } = useDocumentTrazabilidad(documentId);

  const trazabilidad = docTrazabilidad?.trazabilidad;
  const antes = trazabilidad?.antes ?? [];
  const despues = trazabilidad?.despues ?? [];
  const cantAntes = trazabilidad?.cant_antes ?? antes.length;
  const cantDespues = trazabilidad?.cant_despues ?? despues.length;
  const mostrarResumenContadores = !isLoading && !error && Boolean(docTrazabilidad);

  const handleOpenRelatedDocument = async (nombreArchivo: string) => {
    if (!onVerDocumento) return;
    setResolveError(null);
    setResolvingArchivo(nombreArchivo);

    try {
      const resolved = await resolveDocumentoPorTitulo(nombreArchivo);
      onVerDocumento(resolved.id);
    } catch (err) {
      console.error("Error al resolver documento por nombre_archivo:", err);
      setResolveError(
        `No se pudo abrir el documento "${nombreArchivo}". Es posible que aún no esté disponible en el visor.`
      );
    } finally {
      setResolvingArchivo(null);
    }
  };

  const syncText = obtenerTextoSincronizacion(
    trazabilidad?.ultima_sincronizacion
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar panel de relaciones"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default border-0 bg-black/40 backdrop-blur-[1px]"
      />

      <dialog
        open
        aria-modal="true"
        aria-labelledby="relaciones-panel-title"
        className="relative z-10 m-0 ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden border-0 border-l border-slate-200 bg-slate-50 p-0 text-left shadow-2xl"
      >
        {/* HEADER DEL PANEL LATERAL */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-sidebar px-5 py-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <i className="pi pi-share-alt text-lg" />
            </div>
            <div className="min-w-0">
              <h2
                id="relaciones-panel-title"
                className="m-0 truncate text-base font-bold sm:text-lg"
              >
                Relaciones y Trazabilidad
              </h2>
              <p className="m-0 truncate text-xs text-blue-100">
                Línea de tiempo normativa (Antes → Actual → Después)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            title="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <i className="pi pi-times text-lg" />
          </button>
        </div>

        {/* RESUMEN DE CONTADORES */}
        {mostrarResumenContadores && (
          <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-slate-200 bg-white px-5 py-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-amber-200/80 bg-amber-50/60 px-3 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                {cantAntes}
              </span>
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold text-amber-950">
                  Hitos Anteriores
                </p>
                <p className="m-0 text-[11px] text-amber-700">
                  Antecedentes y origen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-sky-200/80 bg-sky-50/60 px-3 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-xs font-bold text-sky-800">
                {cantDespues}
              </span>
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold text-sky-950">
                  Hitos Posteriores
                </p>
                <p className="m-0 text-[11px] text-sky-700">
                  Reformas y modificaciones
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CUERPO DEL PANEL */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {resolveError && (
            <div className="mb-4 flex items-start justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <div className="flex items-start gap-2">
                <i className="pi pi-exclamation-triangle mt-0.5 text-red-600" />
                <span>{resolveError}</span>
              </div>
              <button
                type="button"
                onClick={() => setResolveError(null)}
                className="text-red-500 hover:text-red-700"
                aria-label="Cerrar alerta"
              >
                <i className="pi pi-times text-xs" />
              </button>
            </div>
          )}

          <PanelBodyState
            isLoading={isLoading}
            error={error}
            docTrazabilidad={docTrazabilidad}
            resolvingArchivo={resolvingArchivo}
            onRetry={() => {
              void refetch();
            }}
            onOpenArchivo={(archivo) => {
              void handleOpenRelatedDocument(archivo);
            }}
          />
        </div>

        {/* FOOTER DEL PANEL */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
          <span className="text-[11px] text-slate-400">{syncText}</span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-sidebar px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </dialog>
    </div>
  );
};
