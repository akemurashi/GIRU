import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { CatalogOption, EditableDocument, OnChange } from "./types";

interface Props {
  document: EditableDocument;
  tiposSesion: CatalogOption[];
  tiposDecision: CatalogOption[];
  onChange: OnChange;
}

export function SesionSection({ document, tiposSesion, tiposDecision, onChange }: Props) {
  return (
    <EditorSection
      title="Sesión y acuerdo"
      description="Contexto del órgano colegiado donde se adoptó la decisión (si aplica)."
      icon={<i className="pi pi-comments text-xl" />}
    >
      <FormField label="Tipo de sesión" type="select" value={document.idtiposesion} options={tiposSesion}
        onChange={(v) => onChange("idtiposesion", v)} />
      <FormField label="N° de sesión" type="number" min={0} value={document.numsesion}
        helperText="Reunión del Consejo, p. ej. Sesión Ordinaria N° 337."
        onChange={(v) => onChange("numsesion", v)} />
      <FormField label="Tipo de decisión" type="select" value={document.idtipodecision} options={tiposDecision}
        onChange={(v) => onChange("idtipodecision", v)} />
      <FormField label="N° de acuerdo" type="number" min={0} value={document.numacuerdo}
        helperText="Decisión específica dentro del acta, p. ej. Acuerdo N° 1493."
        onChange={(v) => onChange("numacuerdo", v)} />
    </EditorSection>
  );
}
