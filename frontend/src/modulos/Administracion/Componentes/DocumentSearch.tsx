import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";

import { DocumentEditor } from "./DocumentEditor";
import type { EditableDocument, Catalogs, CatalogOption } from "./types";
import api from "../../../services/api";

import {
  getAdminCatalogs,
  getEditableDocument,
  saveEditableDocument,
} from "../../../services/documentService";

const useLoadingProgress = (active: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    setProgress(5);

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current < 30) return Math.min(current + 5, 30);
        if (current < 60) return Math.min(current + 2, 60);
        if (current < 80) return Math.min(current + 1, 80);
        if (current < 90) return Math.min(current + 0.3, 90);

        return current;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [active]);

  const finishProgress = useCallback(() => {
    setProgress(100);
  }, []);

  return { progress, finishProgress };
};

const LoadingIndicator = ({
  message,
  progress,
}: {
  message: string;
  progress: number;
}) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div
      className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm"
      role="status"
      aria-live="polite"
    >
      {!videoError ? (
        <video
          className="mb-5 h-36 w-36 object-contain drop-shadow-[0_0_3px_rgba(0,61,122,0.35)]"
          src="/giruLupa.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          aria-label="Animación de carga de GIRU"
        />
      ) : (
        <div className="mb-5 flex h-20 w-20 items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-[#004B85]" />
        </div>
      )}

      <p className="m-0 text-base font-semibold text-[#003D7A]">
        {message}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Por favor, espera un momento.
      </p>

      <div
        className="mt-5 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Progreso de carga"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full rounded-full bg-[#F7AE00] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="mt-2 text-xs font-semibold tabular-nums text-[#003D7A]">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

export const DocumentSearch = () => {
  const toast = useRef<Toast>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const docIdParam = searchParams.get("docId");

  const [selectedDocument, setSelectedDocument] =
    useState<EditableDocument | null>(null);

  const [docOptions, setDocOptions] = useState<CatalogOption[]>([]);
  const [dirty, setDirty] = useState(false);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedDocumentName, setSavedDocumentName] = useState("");

  const documentProgress = useLoadingProgress(loading || !catalogs);
  const saveProgress = useLoadingProgress(isSaving);

  useEffect(() => {
    let cancelled = false;

    api
      .get<any[]>("/documents", { params: { limit: 200 } })
      .then((res) => {
        if (!cancelled && Array.isArray(res.data)) {
          const opts: CatalogOption[] = res.data.map((d: any) => ({
            label: `${d.numero ? d.numero + " · " : ""}${d.titulo}`,
            value: d.iddocumento,
          }));
          setDocOptions(opts);
        }
      })
      .catch((err) =>
        console.warn("No se pudieron cargar opciones de documentos:", err)
      );

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDocOptions = useMemo(() => {
    if (!selectedDocument) return docOptions;
    return docOptions.filter(
      (d) => String(d.value) !== String(selectedDocument.iddocumento)
    );
  }, [docOptions, selectedDocument]);

  useEffect(() => {
    let cancelled = false;

    getAdminCatalogs()
      .then((res: Catalogs) => {
        if (!cancelled) {
          setCatalogs(res);
        }
      })
      .catch((err) => {
        console.error("Error al cargar los catálogos:", err);

        if (!cancelled) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar los catálogos.",
            life: 5000,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!docIdParam) {
      setSelectedDocument(null);
      setLoading(false);
      setError(false);
      setDirty(false);
      setSaveSuccess(false);
      return;
    }

    if (!catalogs) return;

    setLoading(true);
    setError(false);
    setSelectedDocument(null);
    setDirty(false);
    setSaveSuccess(false);

    getEditableDocument(docIdParam, catalogs)
      .then((doc) => {
        if (!cancelled) {
          setSelectedDocument(doc);
        }
      })
      .catch((err) => {
        console.error("Error al cargar el documento:", err);

        if (!cancelled) {
          setError(true);

          toast.current?.show({
            severity: "error",
            summary: "Error al cargar",
            detail: "No se pudo cargar el documento para editar.",
            life: 5000,
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [docIdParam, catalogs]);

  const handleCancel = () => {
    if (
      dirty &&
      !window.confirm("Hay cambios sin guardar. ¿Descartarlos?")
    ) {
      return;
    }

    setSelectedDocument(null);
    setDirty(false);
    setSaveSuccess(false);

    const params = new URLSearchParams(searchParams);
    params.delete("docId");
    setSearchParams(params);
  };

  const handleSave = async (draft: EditableDocument) => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await saveEditableDocument(
        draft.iddocumento,
        draft,
        selectedDocument?.relaciones
      );

      saveProgress.finishProgress();

      // Permite apreciar el 100 % antes de mostrar la confirmación.
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 300);
      });

      setSelectedDocument(draft);
      setDirty(false);

      setSavedDocumentName(
        draft.titulo?.trim() || draft.numero || "Documento"
      );

      setSaveSuccess(true);
    } catch (err: unknown) {
      console.error("Error al guardar el documento:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado.";

      toast.current?.show({
        severity: "error",
        summary: "Error al guardar",
        detail: message,
        life: 5000,
      });

      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <Toast ref={toast} />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        {!catalogs && (
          <LoadingIndicator
            message="Cargando catálogos de edición..."
            progress={documentProgress.progress}
          />
        )}

        {catalogs && loading && (
          <LoadingIndicator
            message="Cargando documento..."
            progress={documentProgress.progress}
          />
        )}

        {catalogs && !loading && error && (
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <i className="pi pi-exclamation-circle mt-0.5 text-xl text-red-600" />

              <div>
                <h2 className="m-0 text-base font-semibold text-slate-800">
                  No se pudo cargar el documento
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Ocurrió un problema al consultar la información.
                  Intenta nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {catalogs && !loading && !error && !docIdParam && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <i className="pi pi-file-edit text-2xl text-[#004B85]" />
            </div>

            <h2 className="m-0 text-lg font-semibold text-[#003D7A]">
              Editar documento
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Selecciona un documento para consultar y editar sus metadatos.
            </p>
          </div>
        )}

        {selectedDocument && !loading && !error && (
          <>
            <h1 className="mb-6 text-xl font-bold leading-snug text-[#003D7A] sm:text-2xl">
              {selectedDocument.titulo || "Documento sin título"}
            </h1>

            <DocumentEditor
              key={selectedDocument.iddocumento}
              initial={selectedDocument}
              catalogs={catalogs!}
              documentOptions={filteredDocOptions}
              onSave={handleSave}
              onCancel={handleCancel}
              onDirtyChange={setDirty}
            />
          </>
        )}
      </div>

      {/* Indicador durante la actualización */}
      {isSaving && (
        <div className="fixed inset-0 z-900 flex items-center justify-center overflow-y-auto bg-slate-50/90 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md">
            <LoadingIndicator
              message="Guardando cambios del documento..."
              progress={saveProgress.progress}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {saveSuccess && !isSaving && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-success-title"
            aria-describedby="save-success-description"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <i className="pi pi-check-circle text-4xl text-[#004B85]" />
              </div>

              <h2
                id="save-success-title"
                className="m-0 text-xl font-bold text-[#003D7A]"
              >
                ¡Cambios guardados!
              </h2>

              <p
                id="save-success-description"
                className="mt-3 text-sm leading-6 text-slate-600"
              >
                El documento{" "}
                <span className="font-semibold text-slate-800">
                  {savedDocumentName}
                </span>{" "}
                se ha actualizado correctamente.
              </p>

              <button
                type="button"
                onClick={() => setSaveSuccess(false)}
                className="mt-6 w-full rounded-lg bg-[#004B85] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#003D7A] focus:outline-none focus:ring-2 focus:ring-[#F7AE00] focus:ring-offset-2"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
