import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { EditableDocument, FieldErrors, OnChange } from "./types";

interface Props {
  document: EditableDocument;
  errors: FieldErrors;
  onChange: OnChange;
}

// Nota: "Respaldo legal" ya no vive aquí. En el modelo pertenece a cada RelacionDocumental (ver RelacionesSection).
export function MetadatosSection({ document, errors, onChange }: Props) {
  return (
    <EditorSection
      title="Archivo original"
      description="Ubicación del documento original en el almacenamiento S3."
      icon={<i className="pi pi-cloud text-xl" />}
    >
      <div className="md:col-span-2">
        <FormField label="URL del archivo original" type="url" required value={document.urlarchivooriginals3}
          error={errors.urlarchivooriginals3} placeholder="s3://bucket/ruta/documento.pdf"
          onChange={(v) => onChange("urlarchivooriginals3", v)} />
      </div>
    </EditorSection>
  );
}
