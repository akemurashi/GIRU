
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

/** La BD guarda idCategoria; la macrocategoría se deduce de ella. */
export function CategorizacionSection({
  idcategoria,
  macroCategorias,
  categorias,
  error,
  onChange,
}: Props) {
  const [macro, setMacro] = useState<number | null>(
    categorias.find((categoria) => categoria.value === idcategoria)
      ?.parentId ?? null
  );

  const categoriasDeLaMacro =
    macro == null
      ? []
      : categorias.filter((categoria) => categoria.parentId === macro);

  const handleMacro = (value: number | null) => {
    setMacro(value);

    if (
      idcategoria != null &&
      !categorias.some(
        (categoria) =>
          categoria.value === idcategoria &&
          categoria.parentId === value
      )
    ) {
      onChange(null);
    }
  };

  return (
    <EditorSection
      title="Categorización"
      description="Organiza el documento por temática mediante una clasificación jerárquica."
      icon={<i className="pi pi-tags text-xl" />}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {/* Macrocategoría */}
        <div className="group min-w-0 overflow-hidden rounded-xl border border-[#cbdced] bg-white shadow-sm transition-all duration-200 hover:border-[#1769AA] hover:shadow-md">
          <div className="flex items-center gap-3 border-b border-[#dceafa] bg-linear-to-r from-sidebar to-[#1769AA] px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white">
              <i className="pi pi-folder text-lg" />
            </div>

            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-white">
                Clasificación principal
              </p>
              <p className="m-0 mt-1 text-xs text-blue-100">
                Paso 1 · Macrocategoría
              </p>
            </div>

            <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
              1
            </div>
          </div>

          <div className="p-4">
            <FormField
              label="Macrocategoría"
              type="select"
              value={macro}
              options={macroCategorias}
              placeholder="Seleccione una macrocategoría"
              onChange={handleMacro}
            />

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#dceafa] bg-[#f1f7fd] px-3 py-2.5">
              <i className="pi pi-info-circle mt-0.5 text-[#1769AA]" />
              <p className="m-0 text-xs leading-5 text-[#315675]">
                Define el grupo temático general al que pertenece el documento.
              </p>
            </div>
          </div>
        </div>

        {/* Categoría */}
        <div
          className={`group min-w-0 overflow-hidden rounded-xl border shadow-sm transition-all duration-200 ${
            macro == null
              ? "border-slate-200 bg-slate-50/70"
              : "border-[#cbdced] bg-white hover:border-[#1769AA] hover:shadow-md"
          }`}
        >
          <div
            className={`flex items-center gap-3 border-b px-4 py-3 ${
              macro == null
                ? "border-slate-200 bg-slate-100"
                : "border-[#dceafa] bg-linear-to-r from-[#1769AA] to-[#4c91c9]"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                macro == null
                  ? "border-slate-200 bg-white text-slate-400"
                  : "border-white/25 bg-white/15 text-white"
              }`}
            >
              <i className="pi pi-tag text-lg" />
            </div>

            <div className="min-w-0">
              <p
                className={`m-0 text-sm font-semibold ${
                  macro == null ? "text-slate-500" : "text-white"
                }`}
              >
                Clasificación específica
              </p>
              <p
                className={`m-0 mt-1 text-xs ${
                  macro == null ? "text-slate-400" : "text-blue-50"
                }`}
              >
                Paso 2 · Categoría
              </p>
            </div>

            <div
              className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                macro == null
                  ? "bg-slate-200 text-slate-500"
                  : "bg-white/15 text-white"
              }`}
            >
              2
            </div>
          </div>

          <div className="p-4">
            <FormField
              label="Categoría"
              type="select"
              required
              value={idcategoria}
              options={categoriasDeLaMacro}
              readOnly={macro == null}
              placeholder={
                macro == null
                  ? "Seleccione primero una macrocategoría"
                  : "Seleccione una categoría"
              }
              error={error}
              onChange={onChange}
            />

            <div
              className={`mt-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${
                macro == null
                  ? "border-slate-200 bg-slate-100"
                  : "border-[#dceafa] bg-[#f1f7fd]"
              }`}
            >
              <i
                className={`pi pi-info-circle mt-0.5 ${
                  macro == null ? "text-slate-400" : "text-[#1769AA]"
                }`}
              />
              <p
                className={`m-0 text-xs leading-5 ${
                  macro == null ? "text-slate-500" : "text-[#315675]"
                }`}
              >
                {macro == null
                  ? "Este campo se habilitará después de seleccionar una macrocategoría."
                  : "Selecciona la categoría que mejor describe el documento."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </EditorSection>
  );
}
