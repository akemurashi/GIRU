
import { useEffect, useMemo, useState } from "react";

import { IdentificacionSection } from "./IdentificacionSection";
import { CategorizacionSection } from "./CategorizacionSection";
import { SesionSection } from "./SesionSection";
import { VigenciaSection } from "./VigenciaSection";
import { AreaSection } from "./AreaSection";
import {
  AlcanceAcademicoSection,
  AudienciaSection,
} from "./AlcanceSection";
import { ConfirmModal } from "./ConfirmModal";

import {
  computeChanges,
  getMetadatoPrefix,
  validateDocument,
} from "./documentUtils";

import type {
  Catalogs,
  EditableDocument,
  OnChange,
} from "./types";

export type { EditableDocument } from "./types";

type DocumentEditorProps = {
  /** Documento tal como está guardado. El editor mantiene su propio borrador. */
  initial: EditableDocument;
  catalogs: Catalogs;
  onSave: (document: EditableDocument) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function DocumentEditor({
  initial,
  catalogs,
  onSave,
  onCancel,
  onDirtyChange,
}: DocumentEditorProps) {
  const [draft, setDraft] = useState<EditableDocument>(initial);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const metadatoPrefix = useMemo(
    () => getMetadatoPrefix(draft.idcategoria, catalogs),
    [draft.idcategoria, catalogs]
  );

  const changes = useMemo(
    () => computeChanges(initial, draft, catalogs),
    [initial, draft, catalogs]
  );

  const isModified = changes.length > 0;

  const errors = useMemo(
    () =>
      showErrors
        ? validateDocument(draft, catalogs, metadatoPrefix)
        : {},
    [showErrors, draft, catalogs, metadatoPrefix]
  );

  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    onDirtyChange?.(isModified);
  }, [isModified, onDirtyChange]);

  const onChange: OnChange = (key, value) => {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSaveClick = () => {
    const validationErrors = validateDocument(
      draft,
      catalogs,
      metadatoPrefix
    );

    if (Object.keys(validationErrors).length > 0) {
      setShowErrors(true);
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <section
      id="document-editor"
      className="mt-8 w-full overflow-clip rounded-3xl border border-slate-200 bg-slate-100/70 p-3 sm:p-5 lg:p-6"
    >
      {/* Encabezado */}
      <div className="mb-6 rounded-2xl border border-l-4 border-slate-200 border-l-sidebar bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sidebar text-white">
            <i className="pi pi-pencil" style={{ fontSize: "23px" }} />
          </div>

          <div className="min-w-0">
            <h2 className="m-0 text-xl font-bold tracking-tight text-slate-900">
              Editar documento
            </h2>

            <p className="m-0 mt-1 wrap-break-word text-sm font-medium text-slate-700">
              {initial.titulo || "Documento sin título"}
            </p>

            <p className="m-0 mt-1 break-all text-sm text-slate-500">
              {initial.numero} · ID {initial.iddocumento}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex flex-col gap-7">
        <IdentificacionSection
          document={draft}
          tiposDocumento={catalogs.tiposDocumento}
          metadatoPrefix={metadatoPrefix}
          errors={errors}
          onChange={onChange}
        />

        <CategorizacionSection
          idcategoria={draft.idcategoria}
          macroCategorias={catalogs.macroCategorias}
          categorias={catalogs.categorias}
          error={errors.idcategoria}
          onChange={(id) => onChange("idcategoria", id)}
        />

        <SesionSection
          document={draft}
          tiposSesion={catalogs.tiposSesion}
          tiposDecision={catalogs.tiposDecision}
          onChange={onChange}
        />

        <VigenciaSection
          document={draft}
          estadosVigencia={catalogs.estadosVigencia}
          errors={errors}
          onChange={onChange}
        />

        <AreaSection
          areasemisoras={draft.areasemisoras}
          tiposArea={catalogs.tiposArea}
          subAreas={catalogs.subAreas}
          onChange={(ids) => onChange("areasemisoras", ids)}
        />

        <AlcanceAcademicoSection
          document={draft}
          catalogs={catalogs}
          onChange={onChange}
        />

        <AudienciaSection
          document={draft}
          catalogs={catalogs}
          onChange={onChange}
        />
      </div>

      {/* Acciones y contador de cambios */}
      <div className="sticky bottom-3 z-10 mt-7 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg shadow-slate-900/10 backdrop-blur sm:p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className="pi pi-file-edit text-sidebar" />

            <span>
              {changes.length === 0
                ? "Sin cambios pendientes"
                : `${changes.length} ${
                    changes.length === 1
                      ? "cambio detectado"
                      : "cambios detectados"
                  }`}
            </span>
          </div>

          {changes.length > 0 && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-sidebar">
              <i className="pi pi-pencil text-xs" />
              {changes.length} por revisar
            </span>
          )}
        </div>

        {errorCount > 0 && (
          <p
            role="alert"
            className="m-0 mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <i className="pi pi-exclamation-circle" />
            Hay {errorCount}{" "}
            {errorCount === 1 ? "campo" : "campos"} por corregir antes de
            guardar.
          </p>
        )}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <i className="pi pi-times" />
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sidebar px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            <i className="pi pi-check" />
            Guardar cambios
          </button>
        </div>
      </div>

      {/* Confirmación de cambios */}
      <ConfirmModal
        visible={confirmOpen}
        changes={changes}
        onHide={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onSave(draft);
        }}
      />
    </section>
  );
}

export default DocumentEditor;
