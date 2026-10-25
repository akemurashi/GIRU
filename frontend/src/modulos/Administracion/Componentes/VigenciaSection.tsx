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
  estadosVigencia: CatalogOption[];
  errors: FieldErrors;
  onChange: OnChange;
}

export function VigenciaSection({
  document,
  estadosVigencia,
  errors,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Vigencia y estado"
        description="Gestiona la validez temporal del documento y su disponibilidad en el buscador de GIRU."
        icon={<i className="pi pi-calendar text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-calendar text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Gestión de vigencia
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Estado, fechas y disponibilidad de la normativa.
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-lg border border-[#c5d9ef] bg-white/70 px-3 py-2 sm:flex">
              <i className="pi pi-asterisk text-[9px] text-[#1769AA]" />
              <span className="text-xs font-medium text-[#365675]">
                Obligatorio
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-5 p-4 sm:p-6 lg:p-7">
            {/* Estado y fechas */}
            <section className="overflow-hidden rounded-xl border border-[#cbdced] bg-white">
              <div className="flex items-center gap-3 border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] to-[#edf4fb] px-4 py-3.5 sm:px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
                  <i className="pi pi-calendar text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Estado y fechas del documento
                  </h4>
                  <p className="m-0 mt-0.5 text-xs leading-5 text-slate-500">
                    Define la vigencia temporal de la normativa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-5">
                {/* Estado */}
                <div className="group relative isolate z-10 min-w-0 rounded-xl border border-[#d8d9f0] bg-linear-to-br from-[#e9e9fa] to-[#f4f3fc] p-4 transition-all duration-200 hover:border-[#b8b9e3] hover:shadow-sm focus-within:z-50 focus-within:border-[#9294d5] focus-within:ring-2 focus-within:ring-[#7779c5]/10 sm:p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7779c5]/10 text-[#686bb7]">
                      <i className="pi pi-flag text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-[#383d70]">
                        Estado de vigencia
                      </p>
                      <p className="m-0 mt-0.5 text-xs text-slate-500">
                        Situación actual del documento
                      </p>
                    </div>
                  </div>

                  <FormField
                    id="field-idestadovigencia"
                    label="Estado de vigencia"
                    type="select"
                    required
                    value={document.idestadovigencia}
                    options={estadosVigencia}
                    error={errors.idestadovigencia}
                    onChange={(value) =>
                      onChange("idestadovigencia", value)
                    }
                  />
                </div>

                {/* Fecha de creación */}
                <div className="group relative min-w-0 rounded-xl border border-[#cce4df] bg-linear-to-br from-[#e0f1ed] to-[#eff8f5] p-4 transition-all duration-200 hover:border-[#a3d1c7] hover:shadow-sm focus-within:border-[#65aa9c] focus-within:ring-2 focus-within:ring-[#2b8b78]/10 sm:p-5">
                  <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#2b8b78]/70 transition-colors group-focus-within:bg-[#23806f]" />

                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2b8b78]/10 text-[#23806f]">
                      <i className="pi pi-calendar-plus text-sm" />
                    </div>

                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-[#245c53]">
                        Fecha de creación
                      </p>
                      <p className="m-0 mt-0.5 text-xs text-slate-500">
                        Fecha de emisión del documento
                      </p>
                    </div>
                  </div>

                  <FormField
                    id="field-creacion"
                    label="Fecha de creación"
                    type="date"
                    required
                    value={document.creacion}
                    error={errors.creacion}
                    onChange={(value) => onChange("creacion", value)}
                  />
                </div>

                {/* Fecha de derogación */}
                <div className="group relative min-w-0 rounded-xl border border-[#eadbc2] bg-linear-to-br from-[#f7eddd] to-[#fbf6ed] p-4 transition-all duration-200 hover:border-[#dfc69e] hover:shadow-sm focus-within:border-[#c8a66e] focus-within:ring-2 focus-within:ring-[#b88943]/10 sm:col-span-2 sm:p-5">
                  <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#b88943]/70 transition-colors group-focus-within:bg-[#a97832]" />

                  <div className="mb-4 flex flex-wrap items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#b88943]/10 text-[#a97832]">
                      <i className="pi pi-calendar-times text-sm" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-sm font-semibold text-[#76562c]">
                        Fecha de derogación
                      </p>
                      <p className="m-0 mt-0.5 text-xs text-slate-500">
                        Fecha en que deja de tener vigencia
                      </p>
                    </div>

                    <span className="rounded-lg border border-[#e6d3b5] bg-white/70 px-2.5 py-1 text-[11px] font-medium text-[#896a3f]">
                      Opcional
                    </span>
                  </div>

                  <FormField
                    id="field-derogacion"
                    label="Fecha de derogación"
                    type="date"
                    value={document.derogacion}
                    error={errors.derogacion}
                    helperText="Indica la fecha en que el documento deja de tener vigencia, si corresponde."
                    onChange={(value) => onChange("derogacion", value)}
                  />
                </div>
              </div>
            </section>

            {/* Configuración de aplicación */}
            <section className="overflow-hidden rounded-xl border border-[#cbdced] bg-white">
              <div className="flex items-center gap-3 border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] to-[#edf4fb] px-4 py-3.5 sm:px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
                  <i className="pi pi-sliders-h text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Configuración de aplicación
                  </h4>
                  <p className="m-0 mt-0.5 text-xs leading-5 text-slate-500">
                    Comportamiento y disponibilidad del documento.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Aplicación inmediata */}
                  <div className="group relative min-w-0 rounded-xl border border-[#cce4df] bg-linear-to-br from-[#e0f1ed] to-[#eff8f5] p-4 transition-all duration-200 hover:border-[#a3d1c7] hover:shadow-sm">
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2b8b78]/10 text-[#23806f]">
                        <i className="pi pi-bolt text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="m-0 text-sm font-semibold text-[#245c53]">
                          Aplicación inmediata
                        </p>
                        <p className="m-0 mt-0.5 text-xs text-slate-500">
                          Entrada en vigor
                        </p>
                      </div>
                    </div>

                    <FormField
                      label="Aplicación inmediata"
                      type="boolean"
                      value={document.aplicacioninmediata}
                      helperText="Indica si el documento debe aplicarse inmediatamente."
                      onChange={(value) =>
                        onChange("aplicacioninmediata", value)
                      }
                    />
                  </div>

                  {/* Estado en el buscador */}
                  <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm">
                    <div className="mb-4 flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                        <i className="pi pi-search text-sm" />
                      </div>

                      <div className="min-w-0">
                        <p className="m-0 text-sm font-semibold text-[#234565]">
                          Disponibilidad en GIRU
                        </p>
                        <p className="m-0 mt-0.5 text-xs text-slate-500">
                          Buscador con inteligencia artificial
                        </p>
                      </div>
                    </div>

                    <FormField
                      label="Documento activo en el buscador (RAG)"
                      type="boolean"
                      value={document.isactive}
                      helperText="Determina si el documento está habilitado para el buscador con IA."
                      onChange={(value) => onChange("isactive", value)}
                    />
                  </div>
                </div>

                {/* Información contextual */}
                <div className="flex items-start gap-3 rounded-xl border border-[#cbdced] bg-[#e1ebf6] px-4 py-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#d5e2f0] bg-white/80 text-[#1769AA]">
                    <i className="pi pi-info-circle text-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="m-0 text-xs font-semibold text-[#234565]">
                      Actualización automática de vigencia
                    </p>
                    <p className="m-0 mt-1 text-xs leading-5 text-[#405a73]">
                      Al registrar una relación «Deroga» verificada, la
                      base de datos cambia automáticamente el estado del
                      documento derogado a «Derogado», le asigna la fecha
                      de efecto y lo desactiva.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}
