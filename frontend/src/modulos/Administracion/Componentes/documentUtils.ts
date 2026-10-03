import type { DocumentChange } from "./ConfirmModal";
import type { CatalogOption, Catalogs, EditableDocument, FieldErrors, RelacionEditable } from "./types";

const labelOf = (opts: CatalogOption[], id: number | null | undefined) =>
  id == null ? "" : opts.find((o) => o.value === id)?.label ?? `#${id}`;

const labelsOf = (opts: CatalogOption[], ids: number[]) =>
  ids.map((id) => labelOf(opts, id)).sort((a, b) => a.localeCompare(b, "es")).join(", ");

const yn = (v: boolean) => (v ? "Sí" : "No");
const txt = (v: string | number | null | undefined) => (v == null ? "" : String(v));

/** Prefijo esperado de nomMetaDato: <siglaMacro>-<numCategoria>- */
export function getMetadatoPrefix(idcategoria: number | null, c: Catalogs): string {
  const cat = c.categorias.find((x) => x.value === idcategoria);
  if (!cat) return "";
  const macro = c.macroCategorias.find((m) => m.value === cat.parentId);
  return macro?.code && cat.code ? `${macro.code}-${cat.code}-` : "";
}

export const isDeroga = (idtiporelacion: number | null, c: Catalogs) =>
  labelOf(c.tiposRelacion, idtiporelacion).toUpperCase() === "DEROGA";

// ---------------------------------------------------------------- Validación
export function validateDocument(d: EditableDocument, _c: Catalogs, prefix: string): FieldErrors {
  const e: FieldErrors = {};
  const required = "Campo obligatorio.";

  if (!d.numero.trim()) e.numero = required;
  else if (d.numero.length > 50) e.numero = "Máximo 50 caracteres.";

  if (d.idtipodocumento == null) e.idtipodocumento = required;

  if (!d.titulo.trim()) e.titulo = required;
  else if (d.titulo.length > 255) e.titulo = "Máximo 255 caracteres.";

  if (!d.nommetadato.trim()) e.nommetadato = required;
  else if (d.nommetadato.length > 255) e.nommetadato = "Máximo 255 caracteres.";
  else if (prefix && !d.nommetadato.startsWith(prefix))
    e.nommetadato = `Debe comenzar con «${prefix}» según la categoría elegida.`;
  else if (prefix && d.nommetadato.length === prefix.length) e.nommetadato = "Falta el número identificador.";

  if (d.cant_paginas == null || d.cant_paginas <= 0) e.cant_paginas = "Debe ser un número mayor a 0.";

  if (d.idcategoria == null) e.idcategoria = required;
  if (d.idestadovigencia == null) e.idestadovigencia = required;
  if (!d.creacion) e.creacion = required;
  if (d.derogacion && d.creacion && d.derogacion < d.creacion)
    e.derogacion = "No puede ser anterior a la fecha de creación.";

  if (!d.urlarchivooriginals3.trim()) e.urlarchivooriginals3 = required;
  else if (!/^(https?|s3):\/\//i.test(d.urlarchivooriginals3.trim()))
    e.urlarchivooriginals3 = "Debe comenzar con http://, https:// o s3://.";
  else if (d.urlarchivooriginals3.length > 500) e.urlarchivooriginals3 = "Máximo 500 caracteres.";

  d.relaciones.forEach((r) => {
    const k = (f: string) => `rel:${r.key}:${f}`;
    if (r.iddocumentodestino == null) e[k("iddocumentodestino")] = required;
    if (r.idtiporelacion == null) e[k("idtiporelacion")] = required;
    if (r.idrespaldolegal == null) e[k("idrespaldolegal")] = required;
    if (r.idfuentedeteccion == null) e[k("idfuentedeteccion")] = required;
    if (!r.fechaefecto) e[k("fechaefecto")] = required;
    if (r.detallemodificacion.length > 255) e[k("detallemodificacion")] = "Máximo 255 caracteres.";
    if (r.confianza == null || r.confianza < 0 || r.confianza > 1) e[k("confianza")] = "Debe estar entre 0.00 y 1.00.";
  });

  // Mismo origen + destino + tipo no puede repetirse (idx_rel_unica)
  const seen = new Set<string>();
  d.relaciones.forEach((r) => {
    if (r.iddocumentodestino == null || r.idtiporelacion == null) return;
    const sig = `${r.iddocumentodestino}-${r.idtiporelacion}`;
    if (seen.has(sig)) e[`rel:${r.key}:iddocumentodestino`] = "Esta relación ya existe en este documento.";
    seen.add(sig);
  });

  return e;
}

// ---------------------------------------------------------------- Diferencias
const relSummary = (r: RelacionEditable, c: Catalogs, docs: CatalogOption[]) =>
  [
    `${labelOf(c.tiposRelacion, r.idtiporelacion) || "(sin tipo)"} → ${labelOf(docs, r.iddocumentodestino) || "(sin destino)"}`,
    `respaldo: ${labelOf(c.respaldosLegales, r.idrespaldolegal) || "—"}`,
    `fuente: ${labelOf(c.fuentesDeteccion, r.idfuentedeteccion) || "—"}`,
    `efecto: ${r.fechaefecto || "—"}`,
    `confianza: ${txt(r.confianza) || "—"}`,
    `verificada: ${yn(r.verificada)}`,
    r.detallemodificacion && `detalle: ${r.detallemodificacion}`,
    r.textoevidencia && `evidencia: ${r.textoevidencia}`,
  ]
    .filter(Boolean)
    .join(" | ");

export function computeChanges(
  before: EditableDocument,
  after: EditableDocument,
  c: Catalogs,
  docs: CatalogOption[]
): DocumentChange[] {
  const scalar: { field: string; fmt: (d: EditableDocument) => string }[] = [
    { field: "Número", fmt: (d) => txt(d.numero) },
    { field: "Tipo de documento", fmt: (d) => labelOf(c.tiposDocumento, d.idtipodocumento) },
    { field: "Título", fmt: (d) => txt(d.titulo) },
    { field: "Metadato", fmt: (d) => txt(d.nommetadato) },
    { field: "Descripción", fmt: (d) => txt(d.descripcion) },
    { field: "Cantidad de páginas", fmt: (d) => txt(d.cant_paginas) },
    { field: "Categoría", fmt: (d) => labelOf(c.categorias, d.idcategoria) },
    { field: "Tipo de sesión", fmt: (d) => labelOf(c.tiposSesion, d.idtiposesion) },
    { field: "N° de sesión", fmt: (d) => txt(d.numsesion) },
    { field: "N° de acuerdo", fmt: (d) => txt(d.numacuerdo) },
    { field: "Tipo de decisión", fmt: (d) => labelOf(c.tiposDecision, d.idtipodecision) },
    { field: "Estado de vigencia", fmt: (d) => labelOf(c.estadosVigencia, d.idestadovigencia) },
    { field: "Fecha de creación", fmt: (d) => txt(d.creacion) },
    { field: "Fecha de derogación", fmt: (d) => txt(d.derogacion) },
    { field: "Aplicación inmediata", fmt: (d) => yn(d.aplicacioninmediata) },
    { field: "Documento activo", fmt: (d) => yn(d.isactive) },
    { field: "URL del archivo original", fmt: (d) => txt(d.urlarchivooriginals3) },
    { field: "Áreas emisoras", fmt: (d) => labelsOf(c.subAreas, d.areasemisoras) },
    { field: "Niveles académicos", fmt: (d) => labelsOf(c.niveles, d.niveles) },
    { field: "Carreras", fmt: (d) => labelsOf(c.carreras, d.carreras) },
    { field: "Jornadas", fmt: (d) => labelsOf(c.jornadas, d.jornadas) },
    { field: "Departamentos", fmt: (d) => labelsOf(c.departamentos, d.departamentos) },
    { field: "Sedes / campus", fmt: (d) => labelsOf(c.sedes, d.sedes) },
    { field: "Roles institucionales", fmt: (d) => labelsOf(c.roles, d.roles) },
    { field: "Beneficios internos", fmt: (d) => labelsOf(c.beneficios, d.beneficios) },
    { field: "Nombramientos", fmt: (d) => labelsOf(c.nombramientos, d.nombramientos) },
  ];

  const changes: DocumentChange[] = [];
  for (const s of scalar) {
    const b = s.fmt(before);
    const a = s.fmt(after);
    if (a !== b) changes.push({ field: s.field, before: b, after: a });
  }

  const beforeRels = new Map(before.relaciones.map((r) => [r.key, r]));
  const afterKeys = new Set(after.relaciones.map((r) => r.key));
  for (const r of after.relaciones) {
    const old = beforeRels.get(r.key);
    if (!old) changes.push({ field: "Relación nueva", before: "", after: relSummary(r, c, docs) });
    else {
      const b = relSummary(old, c, docs);
      const a = relSummary(r, c, docs);
      if (a !== b) changes.push({ field: "Relación modificada", before: b, after: a });
    }
  }
  for (const r of before.relaciones)
    if (!afterKeys.has(r.key)) changes.push({ field: "Relación eliminada", before: relSummary(r, c, docs), after: "" });

  return changes;
}
