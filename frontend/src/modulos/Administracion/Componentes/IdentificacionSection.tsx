import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type {
  CatalogOption,
  EditableDocument,
  FieldErrors,
  OnChange,
} from "./types";

interface Props {
  document: EditableDocument;
  tiposDocumento: CatalogOption[];
  metadatoPrefix: string;
  errors: FieldErrors;
  onChange: OnChange;
}

export function IdentificacionSection({
  document,
  tiposDocumento,
  errors,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Identificación del documento"
        description="Información principal para identificar y clasificar la normativa institucional."
        icon={<i className="pi pi-id-card text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-file-edit text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Datos generales
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Identificación y clasificación de la normativa.
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-lg border border-[#c5d9ef] bg-white/70 px-3 py-2 sm:flex">
              <i className="pi pi-asterisk text-[9px] text-[#1769AA]" />
              <span className="text-xs font-medium text-[#365675]">
                Obligatorio
              </span>
            </div>
          </div>

          {/* Campos */}
          <div className="p-4 sm:p-6 lg:p-7">
            <div className="grid w-full min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
              {/* Número de documento */}
              <div className="group relative min-w-0 rounded-xl border border-[#d1dfed] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:p-5">
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                    <i className="pi pi-hashtag text-sm" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#234565]">
                      Número de documento
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-slate-500">
                      Código institucional
                    </p>
                  </div>
                </div>

                <FormField
                  label="Número de documento"
                  type="text"
                  required
                  value={document.numero}
                  error={errors.numero}
                  helperText="Ejemplo: Decreto N° 052/2008."
                  onChange={(v) => onChange("numero", v)}
                />
              </div>

              {/* Tipo de documento: dropdown */}
              <div className="group relative isolate z-10 min-w-0 rounded-xl border border-[#d8d9f0] bg-linear-to-br from-[#e9e9fa] to-[#f4f3fc] p-4 transition-all duration-200 hover:border-[#b8b9e3] hover:shadow-sm focus-within:z-50 focus-within:border-[#9294d5] focus-within:ring-2 focus-within:ring-[#7779c5]/10 sm:p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7779c5]/10 text-[#686bb7]">
                    <i className="pi pi-folder text-sm" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#383d70]">
                      Tipo de documento
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-slate-500">
                      Categoría documental
                    </p>
                  </div>
                </div>

                <FormField
                  label="Tipo de documento"
                  type="select"
                  required
                  value={document.idtipodocumento}
                  options={tiposDocumento}
                  error={errors.idtipodocumento}
                  onChange={(v) => onChange("idtipodocumento", v)}
                />
              </div>

              {/* Título */}
              <div className="group relative min-w-0 rounded-xl border border-[#cce4df] bg-linear-to-br from-[#e0f1ed] to-[#eff8f5] p-4 transition-all duration-200 hover:border-[#a3d1c7] hover:shadow-sm focus-within:border-[#65aa9c] focus-within:ring-2 focus-within:ring-[#2b8b78]/10 md:col-span-2 sm:p-5">
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#2b8b78]/70 transition-colors group-focus-within:bg-[#23806f]" />

                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b8b78]/10 text-[#23806f]">
                    <i className="pi pi-file text-sm" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#245c53]">
                      Título del documento
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-slate-500">
                      Nombre oficial de la normativa
                    </p>
                  </div>
                </div>

                <FormField
                  label="Título del documento"
                  type="text"
                  required
                  value={document.titulo}
                  error={errors.titulo}
                  helperText="Introduce el título completo de la normativa institucional."
                  onChange={(v) => onChange("titulo", v)}
                />
              </div>

              {/* Descripción */}
              <div className="group relative min-w-0 rounded-xl border border-[#eadbc2] bg-linear-to-br from-[#f7eddd] to-[#fbf6ed] p-4 transition-all duration-200 hover:border-[#dfc69e] hover:shadow-sm focus-within:border-[#c8a66e] focus-within:ring-2 focus-within:ring-[#b88943]/10 md:col-span-2 sm:p-5">
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#b88943]/70 transition-colors group-focus-within:bg-[#a97832]" />

                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b88943]/10 text-[#a97832]">
                    <i className="pi pi-align-left text-sm" />
                  </div>
                  <div>
                    <p className="m-0 text-sm font-semibold text-[#76562c]">
                      Descripción
                    </p>
                    <p className="m-0 mt-0.5 text-xs text-slate-500">
                      Resumen del contenido y propósito
                    </p>
                  </div>
                </div>

                <FormField
                  label="Descripción"
                  type="textarea"
                  value={document.descripcion}
                  helperText="Resume el propósito, alcance o contenido principal del documento."
                  onChange={(v) => onChange("descripcion", v)}
                />
              </div>
            </div>

            {/* Ayuda contextual */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#cbdced] bg-[#e1ebf6] px-4 py-3.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/70 text-[#1769AA]">
                <i className="pi pi-info-circle text-sm" />
              </div>
              <p className="m-0 text-xs leading-5 text-[#405a73]">
                Verifica que el número y el título coincidan con los datos
                oficiales del documento antes de guardar los cambios.
              </p>
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}