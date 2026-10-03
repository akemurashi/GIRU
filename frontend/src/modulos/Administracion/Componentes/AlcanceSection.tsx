import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import { groupOptions, type Catalogs, type EditableDocument, type OnChange } from "./types";

interface Props {
  document: EditableDocument;
  catalogs: Catalogs;
  onChange: OnChange;
}

/** DocumentoNivel, DocumentoCarrera, DocumentoJornada, DocumentoDepartamento, DocumentoSedeCampus */
export function AlcanceAcademicoSection({ document, catalogs, onChange }: Props) {
  return (
    <EditorSection
      title="Alcance académico"
      description="A qué niveles, carreras, jornadas, departamentos y sedes aplica el documento."
      icon={<i className="pi pi-book text-xl" />}
    >
      <FormField label="Niveles académicos" type="multiselect" value={document.niveles}
        groups={groupOptions(catalogs.niveles, catalogs.tiposPrograma)}
        onChange={(v) => onChange("niveles", v)} />
      <FormField label="Carreras" type="multiselect" value={document.carreras}
        groups={groupOptions(catalogs.carreras, catalogs.niveles)}
        onChange={(v) => onChange("carreras", v)} />
      <FormField label="Jornadas" type="multiselect" value={document.jornadas} options={catalogs.jornadas}
        onChange={(v) => onChange("jornadas", v)} />
      <FormField label="Departamentos" type="multiselect" value={document.departamentos}
        options={catalogs.departamentos} onChange={(v) => onChange("departamentos", v)} />
      <div className="md:col-span-2">
        <FormField label="Sedes / campus" type="multiselect" value={document.sedes} options={catalogs.sedes}
          onChange={(v) => onChange("sedes", v)} />
      </div>
    </EditorSection>
  );
}

/** DocumentoRol, DocumentoBeneficio, DocumentoNombramiento */
export function AudienciaSection({ document, catalogs, onChange }: Props) {
  return (
    <EditorSection
      title="Audiencia y beneficios"
      description="Estamentos afectados, beneficios internos relacionados y cargos mencionados."
      icon={<i className="pi pi-users text-xl" />}
    >
      <FormField label="Roles institucionales" type="multiselect" value={document.roles} options={catalogs.roles}
        onChange={(v) => onChange("roles", v)} />
      <FormField label="Beneficios internos" type="multiselect" value={document.beneficios}
        options={catalogs.beneficios} onChange={(v) => onChange("beneficios", v)} />
      <div className="md:col-span-2">
        <FormField label="Nombramientos" type="multiselect" value={document.nombramientos}
          options={catalogs.nombramientos} onChange={(v) => onChange("nombramientos", v)} />
      </div>
    </EditorSection>
  );
}
