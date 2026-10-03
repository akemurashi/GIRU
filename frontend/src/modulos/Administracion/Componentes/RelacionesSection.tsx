import { Button } from "primereact/button";
import { FormField } from "./FormField";
import { EditorSection } from "./EditorSection";
import { isDeroga } from "./documentUtils";
import { emptyRelacion, type CatalogOption, type Catalogs, type FieldErrors, type RelacionEditable } from "./types";

interface Props {
  relaciones: RelacionEditable[];
  catalogs: Catalogs;
  /** Otros documentos disponibles como destino (sin el propio) */
  documentOptions: CatalogOption[];
  errors: FieldErrors;
  onChange: (relaciones: RelacionEditable[]) => void;
}

/** RelacionDocumental: este documento (origen) modifica, deroga, complementa o reemplaza a otros. */
export function RelacionesSection({ relaciones, catalogs, documentOptions, errors, onChange }: Props) {
  const fuenteManual =
    catalogs.fuentesDeteccion.find((f) => f.label.toLowerCase() === "manual")?.value ?? null;

  const update = (key: string, patch: Partial<RelacionEditable>) =>
    onChange(relaciones.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <EditorSection
      title="Relaciones con otros documentos"
      description="Linaje jurídico: qué documentos modifica, deroga, complementa o reemplaza este documento."
      icon={<i className="pi pi-share-alt text-xl" />}
    >
      <div className="flex flex-col gap-4 md:col-span-2">
        {relaciones.length === 0 && (
          <p className="m-0 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
            Este documento no afecta a otros documentos.
          </p>
        )}

        {relaciones.map((r, i) => {
          const err = (f: string) => errors[`rel:${r.key}:${f}`];
          const id = (f: string) => `${r.key}-${f}`;
          return (
            <div key={r.key} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="m-0 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar text-xs text-white">
                    {i + 1}
                  </span>
                  Relación
                </h3>
                <Button type="button" icon="pi pi-trash" severity="danger" text rounded
                  aria-label={`Eliminar relación ${i + 1}`}
                  onClick={() => onChange(relaciones.filter((x) => x.key !== r.key))} />
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <FormField id={id("tipo")} label="Tipo de relación" type="select" required
                  value={r.idtiporelacion} options={catalogs.tiposRelacion} error={err("idtiporelacion")}
                  onChange={(v) => update(r.key, { idtiporelacion: v })} />
                <FormField id={id("destino")} label="Documento afectado" type="select" required
                  value={r.iddocumentodestino} options={documentOptions} error={err("iddocumentodestino")}
                  onChange={(v) => update(r.key, { iddocumentodestino: v })} />
                <div className="md:col-span-2">
                  <FormField id={id("respaldo")} label="Respaldo legal" type="select" required
                    value={r.idrespaldolegal} options={catalogs.respaldosLegales} error={err("idrespaldolegal")}
                    helperText="Acta, decreto o acuerdo que autoriza el cambio."
                    onChange={(v) => update(r.key, { idrespaldolegal: v })} />
                </div>
                <div className="md:col-span-2">
                  <FormField id={id("detalle")} label="Detalle de la modificación" type="text"
                    value={r.detallemodificacion} error={err("detallemodificacion")}
                    placeholder='Ej.: "Modifica el Artículo 27"'
                    onChange={(v) => update(r.key, { detallemodificacion: v })} />
                </div>
                <FormField id={id("fecha")} label="Fecha de efecto" type="date" required value={r.fechaefecto}
                  error={err("fechaefecto")} onChange={(v) => update(r.key, { fechaefecto: v })} />
                <FormField id={id("fuente")} label="Fuente de detección" type="select" required
                  value={r.idfuentedeteccion} options={catalogs.fuentesDeteccion} error={err("idfuentedeteccion")}
                  onChange={(v) => update(r.key, { idfuentedeteccion: v })} />
                <FormField id={id("confianza")} label="Confianza" type="number" min={0} max={1} fractionDigits={2}
                  value={r.confianza} error={err("confianza")}
                  helperText="1.00 = certeza total (ingreso manual)."
                  onChange={(v) => update(r.key, { confianza: v })} />
                <FormField id={id("verificada")} label="Verificada por una persona" type="boolean"
                    value={r.verificada} onChange={(v) => update(r.key, { verificada: v })} />
                <div className="md:col-span-2">
                  <FormField id={id("evidencia")} label="Texto de evidencia" type="textarea"
                    value={r.textoevidencia} helperText="Fragmento del OCR donde se detectó la relación (opcional)."
                    onChange={(v) => update(r.key, { textoevidencia: v })} />
                </div>
                {isDeroga(r.idtiporelacion, catalogs) && r.verificada && (
                  <p className="m-0 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 md:col-span-2">
                    <i className="pi pi-exclamation-triangle mt-0.5" />
                    Al guardar, el documento afectado quedará como «Derogado», con esta fecha de efecto, y se
                    desactivará del buscador.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div>
          <Button type="button" label="Agregar relación" icon="pi pi-plus" outlined severity="secondary" className="rounded-xl"
            onClick={() => onChange([...relaciones, emptyRelacion(fuenteManual)])} />
        </div>
      </div>
    </EditorSection>
  );
}
