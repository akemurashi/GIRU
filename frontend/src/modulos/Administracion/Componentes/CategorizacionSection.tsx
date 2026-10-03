import { useState } from "react";
import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import type { CatalogOption } from "./types";

interface Props {
  idcategoria: number | null;
  macroCategorias: CatalogOption[];
  categorias: CatalogOption[];
  error?: string;
  onChange: (idcategoria: number | null) => void;
}

/** MacroCategoria → Categoria. La BD solo guarda idCategoria; la macro se deduce de ella. */
export function CategorizacionSection({ idcategoria, macroCategorias, categorias, error, onChange }: Props) {
  const [macro, setMacro] = useState<number | null>(
    categorias.find((c) => c.value === idcategoria)?.parentId ?? null
  );

  const categoriasDeLaMacro = macro == null ? [] : categorias.filter((c) => c.parentId === macro);

  const handleMacro = (value: number | null) => {
    setMacro(value);
    if (idcategoria != null && !categorias.some((c) => c.value === idcategoria && c.parentId === value)) {
      onChange(null);
    }
  };

  return (
    <EditorSection
      title="Categorización"
      description="Clasificación temática del documento dentro de GIRU."
      icon={<i className="pi pi-tags text-xl" />}
    >
      <FormField label="Macrocategoría" type="select" value={macro} options={macroCategorias} onChange={handleMacro} />
      <FormField
        label="Categoría"
        type="select"
        required
        value={idcategoria}
        options={categoriasDeLaMacro}
        readOnly={macro == null}
        placeholder={macro == null ? "Seleccione primero una macrocategoría" : undefined}
        error={error}
        onChange={onChange}
      />
    </EditorSection>
  );
}
