
export type CatalogOption = {
  label: string;
  value: number | string;
  /** Sigla de macrocategoría o número de categoría. */
  code?: string;
  /** ID del catálogo padre, cuando corresponda. */
  parentId?: number;
};

export type Catalogs = {
  tiposDocumento: CatalogOption[];
  estadosVigencia: CatalogOption[];
  tiposSesion: CatalogOption[];
  tiposDecision: CatalogOption[];
  macroCategorias: CatalogOption[];
  categorias: CatalogOption[];
  tiposArea: CatalogOption[];
  subAreas: CatalogOption[];
  tiposPrograma: CatalogOption[];
  niveles: CatalogOption[];
  carreras: CatalogOption[];
  jornadas: CatalogOption[];
  departamentos: CatalogOption[];
  sedes: CatalogOption[];
  roles: CatalogOption[];
  beneficios: CatalogOption[];
  nombramientos: CatalogOption[];
  tiposRelacion: CatalogOption[];
  fuentesDeteccion: CatalogOption[];
  respaldosLegales: CatalogOption[];
};

export type RelacionEditable = {
  key: string;
  idrelacion?: number;
  iddocumentodestino: string | null;
  idtiporelacion: number | null;
  idrespaldolegal: number | null;
  idfuentedeteccion: number | null;
  detallemodificacion: string;
  confianza: number | null;
  verificada: boolean;
  textoevidencia: string;
  fechaefecto: string;
};

export type EditableDocument = {
  iddocumento: string;

  // Identificación
  numero: string;
  idtipodocumento: number | null;
  titulo: string;
  nommetadato: string;
  descripcion: string;

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

  // Se conserva para compatibilidad, pero no se edita.
  urlarchivooriginals3: string;

  // Tablas puente
  areasemisoras: number[];
  niveles: number[];
  carreras: number[];
  jornadas: number[];
  departamentos: number[];
  sedes: number[];
  roles: number[];
  beneficios: number[];
  nombramientos: number[];

  // Se conserva el tipo, pero las relaciones no se editan en esta pantalla.
  relaciones: RelacionEditable[];
};

export type FieldErrors = Record<string, string>;

export type OnChange = <K extends keyof EditableDocument>(
  key: K,
  value: EditableDocument[K]
) => void;

export const emptyDocument = (id: string): EditableDocument => ({
  iddocumento: id,
  numero: "",
  idtipodocumento: null,
  titulo: "",
  nommetadato: "",
  descripcion: "",
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

export const emptyRelacion = (
  idfuentedeteccion: number | null
): RelacionEditable => ({
  key: `rel-new-${Math.random().toString(36).slice(2)}`,
  iddocumentodestino: null,
  idtiporelacion: null,
  idrespaldolegal: null,
  idfuentedeteccion,
  detallemodificacion: "",
  confianza: 1,
  verificada: true,
  textoevidencia: "",
  fechaefecto: "",
});

/** Agrupa opciones hijas bajo su padre. */
export function groupOptions(
  items: CatalogOption[],
  parents: CatalogOption[]
) {
  return parents
    .map((parent) => ({
      label: parent.label,
      items: items.filter(
        (item) => String(item.parentId) === String(parent.value)
      ),
    }))
    .filter((group) => group.items.length > 0);
}
