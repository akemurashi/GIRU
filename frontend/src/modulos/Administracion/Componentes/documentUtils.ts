
import type { DocumentChange } from "./ConfirmModal";
import type {
  CatalogOption,
  Catalogs,
  EditableDocument,
  FieldErrors,
} from "./types";

const labelOf = (
  options: CatalogOption[],
  id: number | string | null | undefined
): string =>
  id == null
    ? ""
    : options.find(
        (option) => String(option.value) === String(id)
      )?.label ?? `#${id}`;

const labelsOf = (options: CatalogOption[], ids: number[]): string =>
  ids
    .map((id) => labelOf(options, id))
    .sort((a, b) => a.localeCompare(b, "es"))
    .join(", ");

const yn = (value: boolean): string => (value ? "Sí" : "No");

const txt = (
  value: string | number | null | undefined
): string => (value == null ? "" : String(value));

/** Prefijo esperado: <siglaMacro>-<numCategoria>- */
export function getMetadatoPrefix(
  idcategoria: number | null,
  catalogs: Catalogs
): string {
  const category = catalogs.categorias.find(
    (item) => String(item.value) === String(idcategoria)
  );

  if (!category) return "";

  const macro = catalogs.macroCategorias.find(
    (item) => String(item.value) === String(category.parentId)
  );

  return macro?.code && category.code
    ? `${macro.code}-${category.code}-`
    : "";
}

export const isDeroga = (
  idtiporelacion: number | null,
  catalogs: Catalogs
): boolean =>
  labelOf(catalogs.tiposRelacion, idtiporelacion).toUpperCase() ===
  "DEROGA";

// ---------------------------------------------------------------- Validación

export function validateDocument(
  document: EditableDocument,
  _catalogs: Catalogs,
  _prefix?: string
): FieldErrors {
  const errors: FieldErrors = {};
  const required = "Campo obligatorio.";

  if (!document.numero.trim()) {
    errors.numero = required;
  } else if (document.numero.length > 50) {
    errors.numero = "Máximo 50 caracteres.";
  }

  if (document.idtipodocumento == null) {
    errors.idtipodocumento = required;
  }

  // El título y metadato identificador no son editables en este panel (los gestiona el backend/SP).

  if (
    document.descripcion.trim() &&
    document.descripcion.length > 5000
  ) {
    errors.descripcion = "Máximo 5000 caracteres.";
  }

  if (document.idcategoria == null) {
    errors.idcategoria = required;
  }

  if (document.idestadovigencia == null) {
    errors.idestadovigencia = required;
  }

  if (!document.creacion) {
    errors.creacion = required;
  }

  if (
    document.derogacion &&
    document.creacion &&
    document.derogacion < document.creacion
  ) {
    errors.derogacion =
      "No puede ser anterior a la fecha de creación.";
  }

  // Validación de relaciones normativas
  if (Array.isArray(document.relaciones)) {
    document.relaciones.forEach((r) => {
      if (!r.iddocumentodestino) {
        errors[`rel:${r.key}:destino`] = "Debe seleccionar el documento afectado.";
      }
      if (!r.idtiporelacion) {
        errors[`rel:${r.key}:tipo`] = "Debe seleccionar el tipo de relación.";
      }
    });
  }

  return errors;
}

// ---------------------------------------------------------------- Diferencias

export function computeChanges(
  before: EditableDocument,
  after: EditableDocument,
  catalogs: Catalogs
): DocumentChange[] {
  const scalar: {
    field: string;
    fmt: (document: EditableDocument) => string;
  }[] = [
    { field: "Número", fmt: (document) => txt(document.numero) },
    {
      field: "Tipo de documento",
      fmt: (document) =>
        labelOf(catalogs.tiposDocumento, document.idtipodocumento),
    },
    // El título no se edita.
    { field: "Metadato", fmt: (document) => txt(document.nommetadato) },
    { field: "Descripción", fmt: (document) => txt(document.descripcion) },
    {
      field: "Categoría",
      fmt: (document) =>
        labelOf(catalogs.categorias, document.idcategoria),
    },
    {
      field: "Tipo de sesión",
      fmt: (document) =>
        labelOf(catalogs.tiposSesion, document.idtiposesion),
    },
    {
      field: "N° de sesión",
      fmt: (document) => txt(document.numsesion),
    },
    {
      field: "N° de acuerdo",
      fmt: (document) => txt(document.numacuerdo),
    },
    {
      field: "Tipo de decisión",
      fmt: (document) =>
        labelOf(catalogs.tiposDecision, document.idtipodecision),
    },
    {
      field: "Estado de vigencia",
      fmt: (document) =>
        labelOf(catalogs.estadosVigencia, document.idestadovigencia),
    },
    {
      field: "Fecha de creación",
      fmt: (document) => txt(document.creacion),
    },
    {
      field: "Fecha de derogación",
      fmt: (document) => txt(document.derogacion),
    },
    {
      field: "Aplicación inmediata",
      fmt: (document) => yn(document.aplicacioninmediata),
    },
    {
      field: "Documento activo",
      fmt: (document) => yn(document.isactive),
    },
    {
      field: "Áreas emisoras",
      fmt: (document) =>
        labelsOf(catalogs.subAreas, document.areasemisoras),
    },
    {
      field: "Niveles académicos",
      fmt: (document) =>
        labelsOf(catalogs.niveles, document.niveles),
    },
    {
      field: "Carreras",
      fmt: (document) =>
        labelsOf(catalogs.carreras, document.carreras),
    },
    {
      field: "Jornadas",
      fmt: (document) =>
        labelsOf(catalogs.jornadas, document.jornadas),
    },
    {
      field: "Departamentos",
      fmt: (document) =>
        labelsOf(catalogs.departamentos, document.departamentos),
    },
    {
      field: "Sedes / campus",
      fmt: (document) =>
        labelsOf(catalogs.sedes, document.sedes),
    },
    {
      field: "Roles institucionales",
      fmt: (document) =>
        labelsOf(catalogs.roles, document.roles),
    },
    {
      field: "Beneficios internos",
      fmt: (document) =>
        labelsOf(catalogs.beneficios, document.beneficios),
    },
    {
      field: "Nombramientos",
      fmt: (document) =>
        labelsOf(catalogs.nombramientos, document.nombramientos),
    },
  ];

  const changes: DocumentChange[] = [];

  for (const item of scalar) {
    const oldValue = item.fmt(before);
    const newValue = item.fmt(after);

    if (oldValue !== newValue) {
      changes.push({
        field: item.field,
        before: oldValue,
        after: newValue,
      });
    }
  }

  // Comparación de relaciones normativas
  const beforeRels = before.relaciones ?? [];
  const afterRels = after.relaciones ?? [];

  if (
    beforeRels.length !== afterRels.length ||
    JSON.stringify(beforeRels) !== JSON.stringify(afterRels)
  ) {
    const fmtRels = (rels: typeof beforeRels) =>
      rels.length === 0
        ? "Sin relaciones"
        : `${rels.length} relación(es) configurada(s)`;

    changes.push({
      field: "Relaciones normativas",
      before: fmtRels(beforeRels),
      after: fmtRels(afterRels),
    });
  }

  return changes;
}
