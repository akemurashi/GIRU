
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

export type ValidationIssue = {
  key: string;
  section: string;
  field: string;
  message: string;
  targetId: string;
};

export function getValidationIssues(
  document: EditableDocument,
  _catalogs: Catalogs,
  _prefix?: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!document.numero.trim()) {
    issues.push({
      key: "numero",
      section: "Datos generales",
      field: "Número de documento",
      message: "Debe ingresar el número del documento.",
      targetId: "field-numero",
    });
  } else if (document.numero.length > 50) {
    issues.push({
      key: "numero",
      section: "Datos generales",
      field: "Número de documento",
      message: "Máximo 50 caracteres.",
      targetId: "field-numero",
    });
  }

  if (document.idtipodocumento == null) {
    issues.push({
      key: "idtipodocumento",
      section: "Datos generales",
      field: "Tipo de documento",
      message: "Debe seleccionar el tipo de documento.",
      targetId: "field-idtipodocumento",
    });
  }

  // El título y metadato identificador no son editables en este panel (los gestiona el backend/SP).

  if (
    document.descripcion.trim() &&
    document.descripcion.length > 5000
  ) {
    issues.push({
      key: "descripcion",
      section: "Datos generales",
      field: "Descripción",
      message: "Máximo 5000 caracteres.",
      targetId: "field-descripcion",
    });
  }

  if (document.idcategoria == null) {
    issues.push({
      key: "idcategoria",
      section: "Categorización",
      field: "Macrocategoría y Categoría",
      message:
        "Debe seleccionar una macrocategoría (Paso 1) y una categoría (Paso 2).",
      targetId: "section-categorizacion",
    });
  }

  if (document.idestadovigencia == null) {
    issues.push({
      key: "idestadovigencia",
      section: "Vigencia y estado",
      field: "Estado de vigencia",
      message: "Debe seleccionar el estado de vigencia.",
      targetId: "field-idestadovigencia",
    });
  }

  if (!document.creacion) {
    issues.push({
      key: "creacion",
      section: "Vigencia y estado",
      field: "Fecha de creación",
      message: "Debe seleccionar la fecha de creación.",
      targetId: "field-creacion",
    });
  }

  if (
    document.derogacion &&
    document.creacion &&
    document.derogacion < document.creacion
  ) {
    issues.push({
      key: "derogacion",
      section: "Vigencia y estado",
      field: "Fecha de derogación",
      message: "No puede ser anterior a la fecha de creación.",
      targetId: "field-derogacion",
    });
  }

  // Validación de relaciones normativas
  if (Array.isArray(document.relaciones)) {
    document.relaciones.forEach((r, index) => {
      const num = index + 1;
      if (!r.idtiporelacion) {
        issues.push({
          key: `rel:${r.key}:idtiporelacion`,
          section: "Relaciones con otros documentos",
          field: `Relación #${num} · Tipo de relación`,
          message: "Debe seleccionar el tipo de relación.",
          targetId: `${r.key}-tipo`,
        });
      }
      if (!r.iddocumentodestino) {
        issues.push({
          key: `rel:${r.key}:iddocumentodestino`,
          section: "Relaciones con otros documentos",
          field: `Relación #${num} · Documento afectado`,
          message: "Debe seleccionar el documento afectado.",
          targetId: `${r.key}-destino`,
        });
      }
    });
  }

  return issues;
}

export function validateDocument(
  document: EditableDocument,
  catalogs: Catalogs,
  prefix?: string
): FieldErrors {
  const issues = getValidationIssues(document, catalogs, prefix);
  const errors: FieldErrors = {};

  for (const issue of issues) {
    errors[issue.key] = issue.message;
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
