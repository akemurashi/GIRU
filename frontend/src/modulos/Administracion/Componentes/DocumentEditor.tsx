import { useEffect, useMemo, useState } from "react";
import { IdentificacionSection } from "./IdentificacionSection";
import { CategorizacionSection } from "./CategorizacionSection";
import { SesionSection } from "./SesionSection";
import { VigenciaSection } from "./VigenciaSection";
import { AreaSection } from "./AreaSection";
import { AlcanceAcademicoSection, AudienciaSection } from "./AlcanceSection";
import { RelacionesSection } from "./RelacionesSection";
import { MetadatosSection } from "./MetadatosSection";
import { EditorActions } from "./EditorActions";
import { ConfirmModal } from "./ConfirmModal";
import { computeChanges, getMetadatoPrefix, validateDocument } from "./documentUtils";
import type { CatalogOption, Catalogs, EditableDocument, OnChange } from "./types";

export type { EditableDocument } from "./types";

type DocumentEditorProps = {
  /** Documento tal como está guardado. El editor mantiene su propio borrador. */
  initial: EditableDocument;
  catalogs: Catalogs;
  /** Todos los documentos (para elegir el destino de una relación) */
  documentOptions: CatalogOption[];
  onSave: (document: EditableDocument) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function DocumentEditor({ initial, catalogs, documentOptions, onSave, onCancel, onDirtyChange }: DocumentEditorProps) {
  const [draft, setDraft] = useState<EditableDocument>(initial);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const otherDocuments = useMemo(
    () => documentOptions.filter((o) => o.value !== initial.iddocumento),
    [documentOptions, initial.iddocumento]
  );
  const metadatoPrefix = useMemo(() => getMetadatoPrefix(draft.idcategoria, catalogs), [draft.idcategoria, catalogs]);
  const changes = useMemo(
    () => computeChanges(initial, draft, catalogs, documentOptions),
    [initial, draft, catalogs, documentOptions]
  );
  const isModified = changes.length > 0;
  const errors = useMemo(
    () => (showErrors ? validateDocument(draft, catalogs, metadatoPrefix) : {}),
    [showErrors, draft, catalogs, metadatoPrefix]
  );
  const errorCount = Object.keys(errors).length;

  useEffect(() => {
    onDirtyChange?.(isModified);
  }, [isModified, onDirtyChange]);

  // Actualización funcional: permite encadenar varios cambios sin pisarse
  const onChange: OnChange = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSaveClick = () => {
    if (Object.keys(validateDocument(draft, catalogs, metadatoPrefix)).length > 0) {
      setShowErrors(true);
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <section id="document-editor" className="mt-8 w-full overflow-clip rounded-3xl border border-slate-200 bg-slate-100/70 p-3 sm:p-5 lg:p-6">
      <div className="mb-6 rounded-2xl border border-l-4 border-slate-200 border-l-[#003d7a] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#003d7a] text-white">
            <i className="pi pi-pencil" style={{ fontSize: "23px" }} />
          </div>
          <div className="min-w-0">
            <h2 className="m-0 text-xl font-bold tracking-tight text-slate-900">Editar documento</h2>
            <p className="m-0 mt-1 break-all text-sm text-slate-500">
              {initial.nommetadato || initial.numero} · ID {initial.iddocumento}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-7">
        <IdentificacionSection document={draft} tiposDocumento={catalogs.tiposDocumento}
          metadatoPrefix={metadatoPrefix} errors={errors} onChange={onChange} />

        <CategorizacionSection idcategoria={draft.idcategoria} macroCategorias={catalogs.macroCategorias}
          categorias={catalogs.categorias} error={errors.idcategoria}
          onChange={(id) => onChange("idcategoria", id)} />

        <SesionSection document={draft} tiposSesion={catalogs.tiposSesion}
          tiposDecision={catalogs.tiposDecision} onChange={onChange} />

        <VigenciaSection document={draft} estadosVigencia={catalogs.estadosVigencia}
          errors={errors} onChange={onChange} />

        <AreaSection areasemisoras={draft.areasemisoras} tiposArea={catalogs.tiposArea}
          subAreas={catalogs.subAreas} onChange={(ids) => onChange("areasemisoras", ids)} />

        <AlcanceAcademicoSection document={draft} catalogs={catalogs} onChange={onChange} />

        <AudienciaSection document={draft} catalogs={catalogs} onChange={onChange} />

        <RelacionesSection relaciones={draft.relaciones} catalogs={catalogs} documentOptions={otherDocuments}
          errors={errors} onChange={(r) => onChange("relaciones", r)} />

        <MetadatosSection document={draft} errors={errors} onChange={onChange} />
      </div>

      <div className="sticky bottom-3 z-10 mt-7 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg shadow-slate-900/10 backdrop-blur sm:p-4">
        {errorCount > 0 && (
          <p role="alert" className="m-0 mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <i className="pi pi-exclamation-circle" />
            Hay {errorCount} {errorCount === 1 ? "campo" : "campos"} por corregir antes de guardar.
          </p>
        )}
        <EditorActions isModified={isModified} changeCount={changes.length} onCancel={onCancel} onSave={handleSaveClick} />
      </div>

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
