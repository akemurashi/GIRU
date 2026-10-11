import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Toast } from "primereact/toast";

import { DocumentEditor } from "./DocumentEditor";
import type {
  CatalogOption,
  EditableDocument,
  Catalogs,
} from "./types";

import {
  getAdminCatalogs,
  getEditableDocument,
  saveEditableDocument,
} from "../../../services/documentService";

export const DocumentSearch = () => {
  const toast = useRef<Toast>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const docIdParam = searchParams.get("docId");

  const [selectedDocument, setSelectedDocument] =
    useState<EditableDocument | null>(null);

  const [dirty, setDirty] = useState(false);
  const [catalogs, setCatalogs] = useState<Catalogs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Cargar catálogos
  useEffect(() => {
    getAdminCatalogs()
      .then((res: Catalogs) => setCatalogs(res))
      .catch((err) => {
        console.error(err);

        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudieron cargar los catálogos.",
          life: 5000,
        });
      });
  }, []);

  // Cargar documento seleccionado
  useEffect(() => {
    let cancelled = false;

    if (!docIdParam) {
      setSelectedDocument(null);
      setLoading(false);
      setError(false);
      setDirty(false);
      return;
    }

    setLoading(true);
    setError(false);
    setSelectedDocument(null);
    setDirty(false);

    getEditableDocument(docIdParam)
      .then((doc) => {
        if (!cancelled) {
          setSelectedDocument(doc);
        }
      })
      .catch((err) => {
        console.error(err);

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
  }, [docIdParam]);

  // Opciones del documento para el editor
  const documentOptions = useMemo<CatalogOption[]>(
    () =>
      selectedDocument
        ? [
            {
              value: selectedDocument.iddocumento,
              label: `${selectedDocument.numero} – ${selectedDocument.titulo}`,
            },
          ]
        : [],
    [selectedDocument]
  );

  // Cancelar edición
  const handleCancel = () => {
    if (
      dirty &&
      !window.confirm("Hay cambios sin guardar. ¿Descartarlos?")
    ) {
      return;
    }

    setSelectedDocument(null);
    setDirty(false);

    const params = new URLSearchParams(searchParams);
    params.delete("docId");
    setSearchParams(params);
  };

  // Guardar documento
  const handleSave = async (draft: EditableDocument) => {
    try {
      await saveEditableDocument(
        draft.iddocumento as string,
        draft
      );

      setSelectedDocument(draft);
      setDirty(false);

      toast.current?.show({
        severity: "success",
        summary: "Cambios guardados",
        detail: draft.numero,
        life: 3500,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error al guardar",
        detail:
          err?.message || "Ocurrió un error inesperado.",
        life: 5000,
      });
    }
  };

  if (!catalogs) {
    return (
      <div className="p-8 text-center text-slate-500">
        Cargando catálogos de edición...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50">
      <Toast ref={toast} />

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        {/* CARGANDO */}
        {loading && (
          <div className="flex flex-col items-center p-8">
            <i className="pi pi-spin pi-spinner mb-2 text-3xl text-sidebar" />
            <p className="text-xs font-semibold uppercase text-slate-500">
              Cargando documento...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-12 text-center">
            <i className="pi pi-exclamation-circle mb-3 text-3xl text-red-400" />
            <p className="m-0 text-lg font-medium text-slate-700">
              No se pudo cargar el documento
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Comprueba que el documento exista e inténtalo nuevamente.
            </p>
          </div>
        )}

        {/* SIN DOCUMENTO */}
        {!loading && !error && !docIdParam && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <i className="pi pi-file-edit mb-3 text-4xl text-slate-300" />
            <p className="m-0 text-lg font-medium text-slate-700">
              No hay ningún documento seleccionado
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Abre un documento desde la sección de administración para editarlo.
            </p>
          </div>
        )}

        {/* NOMBRE DEL DOCUMENTO Y EDITOR */}
        {selectedDocument && !loading && !error && (
          <>
            <h1 className="mb-6 wrap-break-word text-xl font-bold leading-snug text-slate-800 sm:text-2xl">
              {selectedDocument.titulo || "Documento sin título"}
            </h1>

            <DocumentEditor
              key={selectedDocument.iddocumento}
              initial={selectedDocument}
              catalogs={catalogs}
              documentOptions={documentOptions}
              onSave={handleSave}
              onCancel={handleCancel}
              onDirtyChange={setDirty}
            />
          </>
        )}
      </div>
    </div>
  );
};