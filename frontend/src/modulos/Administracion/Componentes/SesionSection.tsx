import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type {
  CatalogOption,
  EditableDocument,
  OnChange,
} from "./types";

interface Props {
  document: EditableDocument;
  tiposSesion: CatalogOption[];
  tiposDecision: CatalogOption[];
  onChange: OnChange;
}

export function SesionSection({
  document,
  tiposSesion,
  tiposDecision,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Sesión y acuerdo"
        description="Registra el contexto del órgano colegiado donde se adoptó la decisión, cuando corresponda."
        icon={<i className="pi pi-comments text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-comments text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Contexto de la decisión
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Identifica la sesión en que se trató el asunto y el acuerdo adoptado.
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            {/* Tipo de sesión */}
            <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                  <i className="pi pi-calendar text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Tipo de sesión
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Selecciona la modalidad de la reunión del órgano colegiado.
                  </p>
                </div>
              </div>

              <FormField
                label="Tipo de sesión"
                type="select"
                value={document.idtiposesion}
                options={tiposSesion}
                onChange={(v) => onChange("idtiposesion", v)}
              />
            </div>

            {/* Número de sesión */}
            <div className="group relative min-w-0 rounded-xl border border-[#d9d0f0] bg-linear-to-br from-[#eee9fb] to-[#f7f4fd] p-4 transition-all duration-200 hover:border-[#c2b3e8] hover:shadow-sm focus-within:border-[#a28bd8] focus-within:ring-2 focus-within:ring-[#8b5cf6]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#8b5cf6]/70 transition-colors group-focus-within:bg-[#8b5cf6]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/10 text-[#7950c7]">
                  <i className="pi pi-hashtag text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#493875]">
                    Número de sesión
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Identifica la reunión en la que se abordó la decisión.
                  </p>
                </div>
              </div>

              <FormField
                label="N° de sesión"
                type="number"
                min={0}
                value={document.numsesion}
                helperText="Ejemplo: Sesión Ordinaria N° 337."
                onChange={(v) => onChange("numsesion", v)}
              />
            </div>

            {/* Tipo de decisión */}
            <div className="group relative min-w-0 rounded-xl border border-[#c9e5d5] bg-linear-to-br from-[#e2f3e9] to-[#f0f9f3] p-4 transition-all duration-200 hover:border-[#a6d5bb] hover:shadow-sm focus-within:border-[#70b993] focus-within:ring-2 focus-within:ring-[#16a34a]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#16a34a]/70 transition-colors group-focus-within:bg-[#16a34a]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#16a34a]/10 text-[#168044]">
                  <i className="pi pi-check-circle text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#24583a]">
                    Tipo de decisión
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Indica la clase de decisión tomada por el órgano.
                  </p>
                </div>
              </div>

              <FormField
                label="Tipo de decisión"
                type="select"
                value={document.idtipodecision}
                options={tiposDecision}
                onChange={(v) => onChange("idtipodecision", v)}
              />
            </div>

            {/* Número de acuerdo */}
            <div className="group relative min-w-0 rounded-xl border border-[#f0dfbd] bg-linear-to-br from-[#fbf0dc] to-[#fdf8ee] p-4 transition-all duration-200 hover:border-[#e5cb96] hover:shadow-sm focus-within:border-[#d8b36b] focus-within:ring-2 focus-within:ring-[#d97706]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#d97706]/70 transition-colors group-focus-within:bg-[#d97706]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d97706]/10 text-[#b76a0b]">
                  <i className="pi pi-file-edit text-base" />
                </div>

                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#704719]">
                    Número de acuerdo
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Registra el identificador del acuerdo específico.
                  </p>
                </div>
              </div>

              <FormField
                label="N° de acuerdo"
                type="number"
                min={0}
                value={document.numacuerdo}
                helperText="Ejemplo: Acuerdo N° 1493."
                onChange={(v) => onChange("numacuerdo", v)}
              />
            </div>
          </div>

          {/* Información contextual */}
          <div className="mx-4 mb-4 flex items-start gap-3 rounded-xl border border-[#cbdced] bg-[#e1ebf6] px-4 py-3.5 sm:mx-6 sm:mb-6 lg:mx-7">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#d5e2f0] bg-white/80 text-[#1769AA]">
              <i className="pi pi-info-circle text-sm" />
            </div>

            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold text-[#234565]">
                Referencia de sesión y acuerdo
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-[#405a73]">
                Estos datos permiten relacionar el documento con la sesión
                y la decisión correspondiente. Completa la información
                cuando esté disponible y sea pertinente para el documento.
              </p>
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}
