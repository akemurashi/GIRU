// Convención del DBA: tablas y columnas en minúsculas dentro de PostgreSQL ("giru").
// Por eso las claves de EditableDocument están en minúsculas (iddocumento, idtipodocumento, nommetadato...).

export type CatalogOption = {
  label: string;
  value: number;
  /** siglaMacro (macrocategoría) o numCategoria (categoría); se usa para el prefijo de nomMetaDato */
  code?: string;
  /** FK al padre en catálogos jerárquicos (idMacroCategoria, idTipoArea, idTipoPrograma, idNivel) */
  parentId?: number;
};

export type Catalogs = {
  // Lookups 1:N (columnas de Documento)
  tiposDocumento: CatalogOption[];
  estadosVigencia: CatalogOption[];
  tiposSesion: CatalogOption[];
  tiposDecision: CatalogOption[];
  // MacroCategoria → Categoria
  macroCategorias: CatalogOption[];
  categorias: CatalogOption[];
  // TipoArea → SubArea (AreaEmisora)
  tiposArea: CatalogOption[];
  subAreas: CatalogOption[];
  // TipoPrograma → NivelAcademico → Carrera
  tiposPrograma: CatalogOption[];
  niveles: CatalogOption[];
  carreras: CatalogOption[];
  // Tablas puente N:M
  jornadas: CatalogOption[];
  departamentos: CatalogOption[];
  sedes: CatalogOption[];
  roles: CatalogOption[];
  beneficios: CatalogOption[];
  nombramientos: CatalogOption[];
  // RelacionDocumental
  tiposRelacion: CatalogOption[];
  fuentesDeteccion: CatalogOption[];
  respaldosLegales: CatalogOption[];
};

export type RelacionEditable = {
  /** Clave de cliente, estable mientras se edita (rel-<idrelacion> si ya existe en BD) */
  key: string;
  idrelacion?: number;
  iddocumentodestino: number | null;
  idtiporelacion: number | null;
  idrespaldolegal: number | null;
  idfuentedeteccion: number | null;
  detallemodificacion: string;
  confianza: number | null;
  verificada: boolean;
  textoevidencia: string;
  fechaefecto: string; // YYYY-MM-DD
};

export type EditableDocument = {
  iddocumento: number;
  // Identificación
  numero: string;
  idtipodocumento: number | null;
  titulo: string;
  nommetadato: string;
  descripcion: string;
  cant_paginas: number | null;
  // Categorización
  idcategoria: number | null;
  // Sesión y acuerdo
  idtiposesion: number | null;
  numsesion: number | null;
  numacuerdo: number | null;
  idtipodecision: number | null;
  // Vigencia
  idestadovigencia: number | null;
  creacion: string;
  derogacion: string;
  aplicacioninmediata: boolean;
  isactive: boolean;
  // Archivo
  urlarchivooriginals3: string;
  // Tablas puente (listas de IDs)
  areasemisoras: number[]; // SubArea.idSubArea
  niveles: number[];
  carreras: number[];
  jornadas: number[];
  departamentos: number[];
  sedes: number[];
  roles: number[];
  beneficios: number[];
  nombramientos: number[];
  // RelacionDocumental (este documento como origen)
  relaciones: RelacionEditable[];
};

export type FieldErrors = Record<string, string>;

export type OnChange = <K extends keyof EditableDocument>(key: K, value: EditableDocument[K]) => void;

export const emptyDocument = (id: number): EditableDocument => ({
  iddocumento: id,
  numero: "",
  idtipodocumento: null,
  titulo: "",
  nommetadato: "",
  descripcion: "",
  cant_paginas: null,
  idcategoria: null,
  idtiposesion: null,
  numsesion: null,
  numacuerdo: null,
  idtipodecision: null,
  idestadovigencia: null,
  creacion: "",
  derogacion: "",
  aplicacioninmediata: false,
  isactive: true,
  urlarchivooriginals3: "",
  areasemisoras: [],
  niveles: [],
  carreras: [],
  jornadas: [],
  departamentos: [],
  sedes: [],
  roles: [],
  beneficios: [],
  nombramientos: [],
  relaciones: [],
});

export const emptyRelacion = (idfuentedeteccion: number | null): RelacionEditable => ({
  key: `rel-new-${Math.random().toString(36).slice(2)}`,
  iddocumentodestino: null,
  idtiporelacion: null,
  idrespaldolegal: null,
  idfuentedeteccion,
  detallemodificacion: "",
  confianza: 1,
  verificada: true, // ingreso manual = certeza total
  textoevidencia: "",
  fechaefecto: "",
});

/** Agrupa opciones hijas bajo su padre (para dropdowns/multiselect agrupados) */
export function groupOptions(items: CatalogOption[], parents: CatalogOption[]) {
  return parents
    .map((p) => ({ label: p.label, items: items.filter((i) => i.parentId === p.value) }))
    .filter((g) => g.items.length > 0);
}
