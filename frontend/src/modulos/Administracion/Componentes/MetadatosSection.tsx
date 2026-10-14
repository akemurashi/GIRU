import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { EditableDocument, FieldErrors, OnChange } from "./types";

interface Props {
  document: EditableDocument;
  errors: FieldErrors;
  onChange: OnChange;
}

export function MetadatosSection({
  document,
  errors,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Archivo original"
        description="Gestiona la ubicación del archivo original almacenado en S3."
        icon={<i className="pi pi-cloud text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-cloud text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Ubicación del archivo
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Referencia al documento original almacenado en S3.
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-lg border border-[#c5d9ef] bg-white/70 px-3 py-2 sm:flex">
              <i className="pi pi-lock text-xs text-[#1769AA]" />
              <span className="text-xs font-medium text-[#365675]">
                Almacenamiento
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:p-5">
              {/* Acento lateral */}
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                  <i className="pi pi-file text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Archivo original del documento
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Especifica la ruta que permite localizar el archivo
                    almacenado.
                  </p>
                </div>
              </div>

              <FormField
                label="URL del archivo original"
                type="url"
                required
                value={document.urlarchivooriginals3}
                error={errors.urlarchivooriginals3}
                placeholder="s3://bucket/ruta/documento.pdf"
                helperText="Utiliza la ruta del archivo original en el almacenamiento S3."
                onChange={(value) =>
                  onChange("urlarchivooriginals3", value)
                }
              />
            </div>

            {/* Información contextual */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#cbdced] bg-[#e1ebf6] px-4 py-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#d5e2f0] bg-white/80 text-[#1769AA]">
                <i className="pi pi-info-circle text-sm" />
              </div>

              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold text-[#234565]">
                  Referencia del archivo
                </p>
                <p className="m-0 mt-1 text-xs leading-5 text-[#405a73]">
                  Verifica que la ruta corresponda al archivo original
                  correcto y que coincida con la ubicación utilizada por
                  el sistema para acceder al documento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}
