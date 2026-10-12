import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import {
  groupOptions,
  type Catalogs,
  type EditableDocument,
  type OnChange,
} from "./types";

interface Props {
  document: EditableDocument;
  catalogs: Catalogs;
  onChange: OnChange;
}

/** DocumentoNivel, DocumentoCarrera, DocumentoJornada, DocumentoDepartamento, DocumentoSedeCampus */
export function AlcanceAcademicoSection({
  document,
  catalogs,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Alcance académico"
        description="Define los niveles, carreras, jornadas, departamentos y sedes a los que aplica el documento."
        icon={<i className="pi pi-book text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-sitemap text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Aplicación académica
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Especifica a qué áreas y comunidades académicas se dirige la normativa.
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            {/* Niveles académicos */}
            <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                  <i className="pi pi-graduation-cap text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Niveles académicos
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Selecciona los niveles de formación relacionados con el documento.
                  </p>
                </div>
              </div>

              <FormField
                label="Niveles académicos"
                type="multiselect"
                value={document.niveles}
                groups={groupOptions(catalogs.niveles, catalogs.tiposPrograma)}
                onChange={(v) => onChange("niveles", v)}
              />
            </div>

            {/* Carreras */}
            <div className="group relative min-w-0 rounded-xl border border-[#d9d0f0] bg-linear-to-br from-[#eee9fb] to-[#f7f4fd] p-4 transition-all duration-200 hover:border-[#c2b3e8] hover:shadow-sm focus-within:border-[#a28bd8] focus-within:ring-2 focus-within:ring-[#8b5cf6]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#8b5cf6]/70 transition-colors group-focus-within:bg-[#8b5cf6]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/10 text-[#7950c7]">
                  <i className="pi pi-bookmark text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#493875]">
                    Carreras
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Indica las carreras a las que se aplica la normativa.
                  </p>
                </div>
              </div>

              <FormField
                label="Carreras"
                type="multiselect"
                value={document.carreras}
                groups={groupOptions(catalogs.carreras, catalogs.niveles)}
                onChange={(v) => onChange("carreras", v)}
              />
            </div>

            {/* Jornadas */}
            <div className="group relative min-w-0 rounded-xl border border-[#c9e5d5] bg-linear-to-br from-[#e2f3e9] to-[#f0f9f3] p-4 transition-all duration-200 hover:border-[#a6d5bb] hover:shadow-sm focus-within:border-[#70b993] focus-within:ring-2 focus-within:ring-[#16a34a]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#16a34a]/70 transition-colors group-focus-within:bg-[#16a34a]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#16a34a]/10 text-[#168044]">
                  <i className="pi pi-clock text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#24583a]">
                    Jornadas
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Define las jornadas académicas contempladas.
                  </p>
                </div>
              </div>

              <FormField
                label="Jornadas"
                type="multiselect"
                value={document.jornadas}
                options={catalogs.jornadas}
                onChange={(v) => onChange("jornadas", v)}
              />
            </div>

            {/* Departamentos */}
            <div className="group relative min-w-0 rounded-xl border border-[#f0dfbd] bg-linear-to-br from-[#fbf0dc] to-[#fdf8ee] p-4 transition-all duration-200 hover:border-[#e5cb96] hover:shadow-sm focus-within:border-[#d8b36b] focus-within:ring-2 focus-within:ring-[#d97706]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#d97706]/70 transition-colors group-focus-within:bg-[#d97706]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d97706]/10 text-[#b76a0b]">
                  <i className="pi pi-building text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#704719]">
                    Departamentos
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Asocia el documento con los departamentos correspondientes.
                  </p>
                </div>
              </div>

              <FormField
                label="Departamentos"
                type="multiselect"
                value={document.departamentos}
                options={catalogs.departamentos}
                onChange={(v) => onChange("departamentos", v)}
              />
            </div>

            {/* Sedes y campus */}
            <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e8eff8] to-[#f3f6fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:col-span-2 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                  <i className="pi pi-map-marker text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Sedes y campus
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Especifica las ubicaciones institucionales en las que aplica el documento.
                  </p>
                </div>
              </div>

              <FormField
                label="Sedes / campus"
                type="multiselect"
                value={document.sedes}
                options={catalogs.sedes}
                onChange={(v) => onChange("sedes", v)}
              />
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}

/** DocumentoRol, DocumentoBeneficio, DocumentoNombramiento */
export function AudienciaSection({
  document,
  catalogs,
  onChange,
}: Props) {
  return (
    <div className="col-span-full w-full min-w-0">
      <EditorSection
        title="Audiencia y beneficios"
        description="Define los estamentos afectados, los beneficios internos relacionados y los cargos mencionados en el documento."
        icon={<i className="pi pi-users text-xl" />}
      >
        <div className="w-full min-w-0 rounded-2xl border border-slate-200 bg-[#edf3f9]">
          {/* Cabecera */}
          <div className="flex items-center gap-3 rounded-t-2xl border-b border-[#d5e2f0] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white/80 text-[#1769AA]">
              <i className="pi pi-users text-lg" />
            </div>

            <div className="min-w-0">
              <h3 className="m-0 text-sm font-bold text-[#173b60]">
                Personas y relaciones institucionales
              </h3>
              <p className="m-0 mt-1 text-xs leading-5 text-slate-600">
                Identifica a quiénes afecta la normativa y qué elementos institucionales relaciona.
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-2 lg:p-7">
            {/* Roles institucionales */}
            <div className="group relative min-w-0 rounded-xl border border-[#cbdced] bg-linear-to-br from-[#e2edf9] to-[#f0f5fb] p-4 transition-all duration-200 hover:border-[#a9c6e5] hover:shadow-sm focus-within:border-[#6b9fce] focus-within:ring-2 focus-within:ring-[#1769AA]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#1769AA]/70 transition-colors group-focus-within:bg-[#1769AA]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                  <i className="pi pi-user text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#234565]">
                    Roles institucionales
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Selecciona los estamentos o roles relacionados con el documento.
                  </p>
                </div>
              </div>

              <FormField
                label="Roles institucionales"
                type="multiselect"
                value={document.roles}
                options={catalogs.roles}
                onChange={(v) => onChange("roles", v)}
              />
            </div>

            {/* Beneficios internos */}
            <div className="group relative min-w-0 rounded-xl border border-[#c9e5d5] bg-linear-to-br from-[#e2f3e9] to-[#f0f9f3] p-4 transition-all duration-200 hover:border-[#a6d5bb] hover:shadow-sm focus-within:border-[#70b993] focus-within:ring-2 focus-within:ring-[#16a34a]/10 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#16a34a]/70 transition-colors group-focus-within:bg-[#16a34a]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#16a34a]/10 text-[#168044]">
                  <i className="pi pi-star text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#24583a]">
                    Beneficios internos
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Relaciona los beneficios institucionales contemplados en la normativa.
                  </p>
                </div>
              </div>

              <FormField
                label="Beneficios internos"
                type="multiselect"
                value={document.beneficios}
                options={catalogs.beneficios}
                onChange={(v) => onChange("beneficios", v)}
              />
            </div>

            {/* Nombramientos */}
            <div className="group relative min-w-0 rounded-xl border border-[#d9d0f0] bg-linear-to-br from-[#eee9fb] to-[#f7f4fd] p-4 transition-all duration-200 hover:border-[#c2b3e8] hover:shadow-sm focus-within:border-[#a28bd8] focus-within:ring-2 focus-within:ring-[#8b5cf6]/10 sm:col-span-2 sm:p-5">
              <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-[#8b5cf6]/70 transition-colors group-focus-within:bg-[#8b5cf6]" />

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#8b5cf6]/10 text-[#7950c7]">
                  <i className="pi pi-id-card text-base" />
                </div>
                <div className="min-w-0">
                  <h4 className="m-0 text-sm font-semibold text-[#493875]">
                    Nombramientos y cargos
                  </h4>
                  <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
                    Identifica los cargos o nombramientos mencionados en el documento.
                  </p>
                </div>
              </div>

              <FormField
                label="Nombramientos"
                type="multiselect"
                value={document.nombramientos}
                options={catalogs.nombramientos}
                onChange={(v) => onChange("nombramientos", v)}
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
                Sobre las relaciones institucionales
              </p>
              <p className="m-0 mt-1 text-xs leading-5 text-[#405a73]">
                Selecciona únicamente los roles, beneficios y nombramientos que correspondan al contenido del documento.
              </p>
            </div>
          </div>
        </div>
      </EditorSection>
    </div>
  );
}