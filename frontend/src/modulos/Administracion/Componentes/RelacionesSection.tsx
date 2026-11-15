import { Button } from "primereact/button";
import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import {
  emptyHito,
  type CatalogOption,
  type FieldErrors,
  type HitoEditable,
} from "./types";

interface Props {
  antes: HitoEditable[];
  despues: HitoEditable[];
  /** Otros documentos disponibles en el corpus para autocompletar nombre_archivo */
  documentOptions: CatalogOption[];
  errors: FieldErrors;
  onChangeAntes: (antes: HitoEditable[]) => void;
  onChangeDespues: (despues: HitoEditable[]) => void;
}

type HitoListEditorProps = {
  etapa: "antes" | "despues";
  titulo: string;
  descripcion: string;
  badgeColor: string;
  items: HitoEditable[];
  documentOptions: CatalogOption[];
  errors: FieldErrors;
  onChange: (items: HitoEditable[]) => void;
};

function HitoListEditor({
  etapa,
  titulo,
  descripcion,
  badgeColor,
  items,
  documentOptions,
  errors,
  onChange,
}: Readonly<HitoListEditorProps>) {
  const updateItem = (key: string, patch: Partial<HitoEditable>) => {
    onChange(
      items.map((item) =>
        item.key === key ? { ...item, ...patch } : item
      )
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  // Opciones rápidas basadas en el catálogo de documentos existentes
  const archivoCatalogOptions = documentOptions.map((doc) => {
    const cleanTitle = doc.label.includes(" · ")
      ? doc.label.split(" · ").slice(1).join(" · ").trim()
      : doc.label.trim();
    return {
      label: doc.label,
      value: cleanTitle,
      numero: doc.label.includes(" · ")
        ? doc.label.split(" · ")[0].trim()
        : "",
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeColor}`}
            >
              {items.length}
            </span>
            <h3 className="m-0 text-base font-bold text-slate-800">
              {titulo}
            </h3>
          </div>
          <p className="m-0 mt-1 text-xs text-slate-500">
            {descripcion}
          </p>
        </div>

        <Button
          type="button"
          label={
            etapa === "antes"
              ? "Agregar hito anterior"
              : "Agregar hito posterior"
          }
          icon="pi pi-plus"
          outlined
          size="small"
          className="rounded-xl! text-xs!"
          onClick={() => onChange([...items, emptyHito()])}
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center text-xs text-slate-500">
          {etapa === "antes"
            ? "No hay hitos anteriores registrados para este documento."
            : "No hay hitos posteriores registrados para este documento."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((hito, index) => {
            const err = (field: string) =>
              errors[`hito:${etapa}:${hito.key}:${field}`];
            const id = (field: string) =>
              `${etapa}-${hito.key}-${field}`;

            return (
              <div
                key={hito.key}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {etapa === "antes"
                        ? "Hito Anterior"
                        : "Hito Posterior"}{" "}
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      icon="pi pi-arrow-up"
                      text
                      rounded
                      size="small"
                      disabled={index === 0}
                      aria-label="Mover arriba"
                      title="Mover antes en la línea de tiempo"
                      onClick={() => moveItem(index, -1)}
                    />
                    <Button
                      type="button"
                      icon="pi pi-arrow-down"
                      text
                      rounded
                      size="small"
                      disabled={index === items.length - 1}
                      aria-label="Mover abajo"
                      title="Mover después en la línea de tiempo"
                      onClick={() => moveItem(index, 1)}
                    />
                    <Button
                      type="button"
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      size="small"
                      aria-label={`Eliminar hito ${index + 1}`}
                      title="Eliminar hito"
                      onClick={() =>
                        onChange(
                          items.filter((x) => x.key !== hito.key)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <FormField
                      id={id("decreto")}
                      label="Código oficial del decreto o resolución"
                      type="text"
                      required
                      value={hito.decreto}
                      error={err("decreto")}
                      placeholder='Ej.: "DECRETO 053/1992" o "RESOLUCIÓN 140/2020"'
                      onChange={(val) =>
                        updateItem(hito.key, {
                          decreto: String(val ?? ""),
                        })
                      }
                    />
                  </div>

                  <FormField
                    id={id("fecha")}
                    label="Fecha del hito (opcional)"
                    type="date"
                    value={hito.fecha}
                    error={err("fecha")}
                    helperText="Formato YYYY-MM-DD. Al elegir fecha se autocompleta el año."
                    onChange={(val) => {
                      const fechaStr = String(val ?? "");
                      const extractedYear = /^\d{4}/.test(fechaStr)
                        ? Number(fechaStr.slice(0, 4))
                        : hito.anio;
                      updateItem(hito.key, {
                        fecha: fechaStr,
                        anio: extractedYear,
                      });
                    }}
                  />

                  <FormField
                    id={id("anio")}
                    label="Año del hito (opcional)"
                    type="number"
                    min={1800}
                    max={2200}
                    value={hito.anio}
                    error={err("anio")}
                    placeholder="Ej.: 1992"
                    helperText="Entre 1800 y 2200. Útil si no se conoce el día exacto."
                    onChange={(val) =>
                      updateItem(hito.key, {
                        anio: typeof val === "number" ? val : null,
                      })
                    }
                  />

                  <div className="md:col-span-2">
                    <FormField
                      id={id("digitalizado")}
                      label="Norma digitalizada en el repositorio"
                      type="boolean"
                      value={hito.digitalizado}
                      helperText="Desactívelo si es una norma histórica antigua sin archivo digitalizado en el corpus (nombre_archivo: null)."
                      onChange={(val) => {
                        const isDig = Boolean(val);
                        updateItem(hito.key, {
                          digitalizado: isDig,
                          nombre_archivo: isDig
                            ? hito.nombre_archivo ?? ""
                            : null,
                        });
                      }}
                    />
                  </div>

                  {hito.digitalizado ? (
                    <>
                      {archivoCatalogOptions.length > 0 && (
                        <div className="md:col-span-2">
                          <FormField
                            id={id("catalogo-doc")}
                            label="Vincular desde catálogo de documentos (opcional)"
                            type="select"
                            value={hito.nombre_archivo ?? ""}
                            options={archivoCatalogOptions}
                            placeholder="Buscar un documento existente para autocompletar archivo..."
                            helperText="Selecciona un documento existente o escribe directamente el nombre del archivo abajo."
                            onChange={(selectedTitle) => {
                              const titleStr = String(
                                selectedTitle ?? ""
                              );
                              const matched =
                                archivoCatalogOptions.find(
                                  (opt) => opt.value === titleStr
                                );
                              updateItem(hito.key, {
                                nombre_archivo: titleStr,
                                ...( !hito.decreto.trim() &&
                                matched?.numero
                                  ? {
                                      decreto: `DECRETO ${matched.numero}`,
                                    }
                                  : {}),
                              });
                            }}
                          />
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <FormField
                          id={id("nombre_archivo")}
                          label="Nombre del archivo o título oficial en el corpus"
                          type="text"
                          required
                          value={hito.nombre_archivo ?? ""}
                          error={err("nombre_archivo")}
                          placeholder='Ej.: "Decreto_05-95 ROAS.md" o título exacto del documento'
                          helperText="Se utilizará para resolver y abrir el PDF directamente en el visor sin salir de la pantalla."
                          onChange={(val) =>
                            updateItem(hito.key, {
                              nombre_archivo: String(val ?? ""),
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-600">
                        <i className="pi pi-info-circle text-slate-400" />
                        <span>
                          Este hito se guardará con{" "}
                          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">
                            nombre_archivo: null
                          </code>{" "}
                          y se mostrará como{" "}
                          <strong>Norma histórica no digitalizada</strong>{" "}
                          en la línea de tiempo.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Trazabilidad normativa: hitos anteriores (antes) y posteriores (después). */
export function RelacionesSection({
  antes,
  despues,
  documentOptions,
  errors,
  onChangeAntes,
  onChangeDespues,
}: Readonly<Props>) {
  const totalHitos = antes.length + despues.length;

  return (
    <EditorSection
      title="Trazabilidad y Relaciones Normativas"
      description="Línea de tiempo genealógica del documento: hitos normativos anteriores (antecedentes) y posteriores (modificaciones o derogaciones)."
      icon={<i className="pi pi-share-alt text-xl" />}
    >
      <div className="flex flex-col gap-5 md:col-span-2">
        {totalHitos > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <span className="text-xs font-medium text-slate-600">
              Total en línea de tiempo:{" "}
              <strong>{antes.length}</strong> anterior(es) ·{" "}
              <strong>{despues.length}</strong> posterior(es)
            </span>

            <button
              type="button"
              onClick={() => {
                onChangeAntes([]);
                onChangeDespues([]);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <i className="pi pi-trash text-[11px]" />
              <span>Limpiar toda la trazabilidad</span>
            </button>
          </div>
        )}

        <HitoListEditor
          etapa="antes"
          titulo="Hitos Anteriores (Antes)"
          descripcion="Normas que antecedieron, fundaron o modificaron a este documento en el pasado (orden cronológico ascendente)."
          badgeColor="bg-amber-100 text-amber-800"
          items={antes}
          documentOptions={documentOptions}
          errors={errors}
          onChange={onChangeAntes}
        />

        <HitoListEditor
          etapa="despues"
          titulo="Hitos Posteriores (Después)"
          descripcion="Reformas, derogaciones o modificaciones que afectaron a este documento hacia el futuro (orden cronológico ascendente)."
          badgeColor="bg-sky-100 text-sky-800"
          items={despues}
          documentOptions={documentOptions}
          errors={errors}
          onChange={onChangeDespues}
        />
      </div>
    </EditorSection>
  );
}
