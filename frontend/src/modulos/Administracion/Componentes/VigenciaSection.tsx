import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { CatalogOption, EditableDocument, FieldErrors, OnChange } from "./types";

interface Props {
  document: EditableDocument;
  estadosVigencia: CatalogOption[];
  errors: FieldErrors;
  onChange: OnChange;
}

export function VigenciaSection({ document, estadosVigencia, errors, onChange }: Props) {
  return (
    <EditorSection
      title="Vigencia y estado"
      description="Controla la validez y estado temporal del documento."
      icon={<i className="pi pi-calendar text-xl" />}
    >
      <FormField label="Estado de vigencia" type="select" required value={document.idestadovigencia}
        options={estadosVigencia} error={errors.idestadovigencia}
        onChange={(v) => onChange("idestadovigencia", v)} />
      <FormField label="Fecha de creación" type="date" required value={document.creacion} error={errors.creacion}
        onChange={(v) => onChange("creacion", v)} />
      <FormField label="Fecha de derogación" type="date" value={document.derogacion} error={errors.derogacion}
        onChange={(v) => onChange("derogacion", v)} />
      <FormField label="Aplicación inmediata" type="boolean" value={document.aplicacioninmediata}
          onChange={(v) => onChange("aplicacioninmediata", v)} />
      <FormField label="Documento activo en el buscador (RAG)" type="boolean" value={document.isactive}
          onChange={(v) => onChange("isactive", v)} />
      <p className="m-0 text-sm text-slate-500 md:col-span-2">
        Al registrar una relación «Deroga» verificada, la base de datos cambia automáticamente el estado del documento
        derogado a «Derogado», le asigna la fecha de efecto y lo desactiva.
      </p>
    </EditorSection>
  );
}
