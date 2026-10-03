import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import { groupOptions, type CatalogOption } from "./types";

interface Props {
  areasemisoras: number[];
  tiposArea: CatalogOption[];
  subAreas: CatalogOption[];
  onChange: (ids: number[]) => void;
}

/** AreaEmisora: una o varias SubArea que emitieron el documento, agrupadas por TipoArea. */
export function AreaSection({ areasemisoras, tiposArea, subAreas, onChange }: Props) {
  return (
    <EditorSection
      title="Área emisora"
      description="Órganos o unidades que emitieron y firmaron el documento. Puede ser más de uno."
      icon={<i className="pi pi-sitemap text-xl" />}
    >
      <div className="md:col-span-2">
        <FormField label="Subáreas emisoras" type="multiselect" value={areasemisoras}
          groups={groupOptions(subAreas, tiposArea)} onChange={onChange} />
      </div>
    </EditorSection>
  );
}
