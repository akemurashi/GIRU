
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
import { RelacionesSection } from "./RelacionesSection";
import { ConfirmModal } from "./ConfirmModal";

import {
  computeChanges,
  getMetadatoPrefix,
  getValidationIssues,
  validateDocument,
} from "./documentUtils";

import type {
  CatalogOption,
  Catalogs,
  EditableDocument,
  OnChange,
} from "./types";

export type { EditableDocument } from "./types";

type DocumentEditorProps = {
  /** Documento tal como está guardado. El editor mantiene su propio borrador. */
  initial: EditableDocument;
  catalogs: Catalogs;
  documentOptions?: CatalogOption[];
  onSave: (document: EditableDocument) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function DocumentEditor({
  initial,
  catalogs,
  documentOptions = [],
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

  const validationIssues = useMemo(
    () => getValidationIssues(draft, catalogs, metadatoPrefix),
    [draft, catalogs, metadatoPrefix]
  );

  const errors = useMemo(
    () =>
      showErrors
        ? validateDocument(draft, catalogs, metadatoPrefix)
        : {},
    [showErrors, draft, catalogs, metadatoPrefix]
  );

  const scrollToField = (targetId: string) => {
    setShowErrors(true);
    window.requestAnimationFrame(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof element.focus === "function") {
          element.focus({ preventScroll: true });
        }
      }
    });
  };

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
    if (validationIssues.length > 0) {
      setShowErrors(true);
      scrollToField(validationIssues[0].targetId);
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

      {/* Resumen de campos obligatorios pendientes */}
      {validationIssues.length > 0 && (
        <div
          role="region"
          aria-label="Campos obligatorios pendientes"
          className={`mb-6 rounded-2xl border p-4 shadow-sm sm:p-5 ${
            showErrors
              ? "border-red-300 bg-red-50/90"
              : "border-amber-300 bg-amber-50/90"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                showErrors
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <i className="pi pi-exclamation-triangle text-base" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  className={`m-0 text-sm font-bold ${
                    showErrors ? "text-red-900" : "text-amber-900"
                  }`}
                >
                  {validationIssues.length === 1
                    ? "Falta 1 campo obligatorio por completar o revisar"
                    : `Faltan ${validationIssues.length} campos obligatorios por completar o revisar`}
                </h3>

                {!showErrors && (
                  <button
                    type="button"
                    onClick={() => setShowErrors(true)}
                    className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    Resaltar en el formulario
                  </button>
                )}
              </div>

              <p
                className={`m-0 mt-1 text-xs ${
                  showErrors ? "text-red-800" : "text-amber-800"
                }`}
              >
                Selecciona cualquiera de los siguientes elementos para ir directamente al campo que debes completar:
              </p>

              <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                {validationIssues.map((issue) => (
                  <li key={issue.key}>
                    <button
                      type="button"
                      onClick={() => scrollToField(issue.targetId)}
                      className={`flex w-full items-start justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-left transition hover:shadow-sm ${
                        showErrors
                          ? "border-red-200 hover:border-red-400"
                          : "border-amber-200 hover:border-amber-400"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {issue.section}
                        </span>
                        <span className="block text-xs font-bold text-slate-800">
                          {issue.field}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs ${
                            showErrors ? "text-red-700" : "text-amber-800"
                          }`}
                        >
                          {issue.message}
                        </span>
                      </div>

                      <span
                        className={`mt-1 inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${
                          showErrors
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        Ir
                        <i className="pi pi-arrow-right text-[10px]" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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

        <RelacionesSection
          relaciones={draft.relaciones ?? []}
          catalogs={catalogs}
          documentOptions={documentOptions}
          errors={errors}
          onChange={(relaciones) => onChange("relaciones", relaciones)}
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

        {validationIssues.length > 0 && (
          <div
            role="alert"
            className={`mb-3 rounded-xl border p-3 text-sm ${
              showErrors
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <i className="pi pi-exclamation-circle" />
              <span>
                {validationIssues.length === 1
                  ? "Falta 1 campo obligatorio antes de guardar:"
                  : `Faltan ${validationIssues.length} campos obligatorios antes de guardar:`}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {validationIssues.map((issue) => (
                <button
                  key={issue.key}
                  type="button"
                  onClick={() => scrollToField(issue.targetId)}
                  title={issue.message}
                  className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1 text-xs font-medium transition ${
                    showErrors
                      ? "border-red-200 text-red-800 hover:border-red-400 hover:bg-red-100/50"
                      : "border-amber-300 text-amber-900 hover:border-amber-400 hover:bg-amber-100/50"
                  }`}
                >
                  <span className="font-semibold">{issue.field}:</span>
                  <span>{issue.message}</span>
                  <i className="pi pi-arrow-up-right text-[10px]" />
                </button>
              ))}
            </div>
          </div>
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
