import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { CatalogOption, EditableDocument, FieldErrors, OnChange } from "./types";

interface Props {
  document: EditableDocument;
  tiposDocumento: CatalogOption[];
  /** Prefijo esperado de nomMetaDato según la categoría elegida, p. ej. "AC-10-" */
  metadatoPrefix: string;
  errors: FieldErrors;
  onChange: OnChange;
}

export function IdentificacionSection({ document, tiposDocumento, metadatoPrefix, errors, onChange }: Props) {
  return (
    <EditorSection
      title="Identificación del documento"
      description="Información principal que permite identificar la normativa."
      icon={<i className="pi pi-id-card text-xl" />}
    >
      <FormField label="Número" type="text" required value={document.numero} error={errors.numero}
        helperText="Código institucional único, p. ej. Decreto N° 052/2008."
        onChange={(v) => onChange("numero", v)} />
      <FormField label="Tipo de documento" type="select" required value={document.idtipodocumento}
        options={tiposDocumento} error={errors.idtipodocumento}
        onChange={(v) => onChange("idtipodocumento", v)} />
      <div className="md:col-span-2">
        <FormField label="Título" type="text" required value={document.titulo} error={errors.titulo}
          onChange={(v) => onChange("titulo", v)} />
      </div>
      <FormField label="Metadato" type="text" required value={document.nommetadato} error={errors.nommetadato}
        helperText={
          metadatoPrefix
            ? `Debe comenzar con «${metadatoPrefix}» seguido del identificador único dentro de la categoría.`
            : "Formato: <macrocategoría>-<categoría>-<identificador>. Elija la categoría para ver el prefijo."
        }
        onChange={(v) => onChange("nommetadato", v)} />
      <FormField label="Cantidad de páginas" type="number" required min={1} value={document.cant_paginas}
        error={errors.cant_paginas} onChange={(v) => onChange("cant_paginas", v)} />
      <div className="md:col-span-2">
        <FormField label="Descripción" type="textarea" value={document.descripcion}
          onChange={(v) => onChange("descripcion", v)} />
      </div>
    </EditorSection>
  );
}
