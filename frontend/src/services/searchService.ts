import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "./api";

// =====================================================
// TYPES
// =====================================================

export interface SearchRequest {
  query: string;
  filters: SearchFilters;
  page: number;
  page_size: number;
}

export interface SearchFilters {
  numero?: string;
  nommetadato?: string;
  numacuerdo?: number;
  numsesion?: number;

  // Vigencia
  idestadovigencia?: number | number[];

  // Fechas
  creaciondesde?: string;
  creacionhasta?: string;
  derogaciondesde?: string;
  derogacionhasta?: string;
  anios?: number[];

  // Booleanos
  aplicacioninmediata?: boolean;
  isactive?: boolean;

  // Tipo de documento
  idtipodocumento?: number | number[];

  // Tipo de decisión
  idtipodecision?: number | number[];

  // Tipo de sesión
  idtiposesion?: number | number[];

  // Categoría
  idcategoria?: number | number[];
  idmacrocategoria?: number | number[];

  // Área
  idtipoarea?: number | number[];
  idsubarea?: number | number[];

  // Beneficios
  idbeneficio?: number | number[];

  // Sede / Campus
  idrecintouniversitario?: number | number[];

  // Departamento
  iddepartamento?: number | number[];

  // Carrera
  idcarrera?: number | number[];

  // Programa / nivel académico
  idtipoprograma?: number | number[];
  idnivel?: number | number[];

  // Nombramiento
  idtiponombramiento?: number | number[];

  // Jornada
  idjornada?: number | number[];

  // Rol institucional
  idrol?: number | number[];

  // Trazabilidad
  idrespaldolegal?: number | number[];
  idtiporelacion?: number | number[];
  idfuente?: number | number[];
  verificada?: boolean;
  confianzamin?: number;
  confianzamax?: number;

  // Chunks
  idtipopagina?: number | number[];
}

export interface SearchResultItem {
  documentid: number;
  numero: string;
  titulo: string;
  nommetadato: string;
  tipodocumento?: string;
  tipodecision?: string;
  estadovigencia?: string;
  numacuerdo?: number;
  numsesion?: number;
  creacion?: string;
  derogacion?: string;
  aplicacioninmediata?: boolean;
  sedes: string[];
  categorias: string[];
  score: number;
  excerpt: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  page: number;
  page_size: number;
  results: SearchResultItem[];
}

export interface FilterOption {
  id: number;
  nombre: string;
}

export interface FilterOptions {
  tipos_area: FilterOption[];
  macro_categorias: FilterOption[];
  tipos_documento: FilterOption[];
  estados_vigencia: FilterOption[];
  respaldos_legales: FilterOption[];
  roles_institucionales: FilterOption[];
  beneficios: FilterOption[];
  sedes_campus: FilterOption[];
  sedes?: FilterOption[];
  tipos_nombramiento: FilterOption[];
  jornadas: FilterOption[];
  tipos_programa: FilterOption[];
  departamentos: FilterOption[];
  tipos_sesion: FilterOption[];
  tipos_decision: FilterOption[];
  tipos_relacion: FilterOption[];
  fuentes_deteccion: FilterOption[];
  tipos_pagina: FilterOption[];
  sub_areas: FilterOption[];
  categorias: FilterOption[];
  niveles_academicos: FilterOption[];
  carreras: FilterOption[];
}

export interface LexicalSuggestionItem {
  documentid: string;
  numero: string;
  titulo: string;
  nommetadato: string;
  matched_field: "titulo" | "nommetadato";
  suggestion: string;
}

export interface AutocompleteResponse {
  query: string;
  is_lexical: boolean;
  suggestions: LexicalSuggestionItem[];
}

// =====================================================
// DETALLE DE UN DOCUMENTO
// =====================================================

export interface DocumentoDetalle {
  iddocumento: string;
  numero?: string | null;
  titulo: string;
  nommetadato?: string | null;
  tipodocumento?: string | null;
  tipodecision?: string | null;
  tiposesion?: string | null;
  estadovigencia?: string | null;
  numacuerdo?: number | null;
  numsesion?: number | null;
  descripcion?: string | null;
  creacion?: string | null;
  derogacion?: string | null;
  aplicacioninmediata?: boolean;
  isactive?: boolean;
  sedes?: unknown[];
  categorias?: unknown[];
  cant_paginas?: number;
  urlarchivooriginals3?: string | null;
  carreras?: unknown[];
  beneficios?: unknown[];
  nombramientos?: unknown[];
  departamentos?: unknown[];
  chunkcount?: number;
}

// =====================================================
// API FUNCTIONS
// =====================================================

const searchDocuments = async (
  request: SearchRequest,
  signal?: AbortSignal
): Promise<SearchResponse> => {
  const response = await api.post<SearchResponse>(
    "/search/",
    request,
    { signal }
  );

  return response.data;
};

const fetchFilterOptions = async (
  signal?: AbortSignal
): Promise<FilterOptions> => {
  const response = await api.get<FilterOptions>(
    "/search/filters",
    { signal }
  );

  return response.data;
};

// Obtener un único documento por su identificador.
export const fetchDocumentById = async (
  documentId: string,
  signal?: AbortSignal
): Promise<DocumentoDetalle> => {
  const id = documentId.trim();

  if (!id) {
    throw new Error("El identificador del documento está vacío.");
  }

  const response = await api.get<DocumentoDetalle>(
    `/documents/${encodeURIComponent(id)}`,
    { signal }
  );

  return response.data;
};

// Mantiene el comportamiento original: el autocompletado solo
// consulta al backend cuando la búsqueda comienza con #.
export const fetchAutocomplete = async (
  query: string,
  limit: undefined | number = undefined,
  signal?: AbortSignal
): Promise<AutocompleteResponse> => {
  const trimmed = query.trim();

  if (!trimmed.startsWith("#")) {
    return {
      query,
      is_lexical: false,
      suggestions: [],
    };
  }

  const response = await api.get<AutocompleteResponse>(
    "/search/autocomplete",
    {
      params: {
        q: trimmed,
        limit,
      },
      signal,
    }
  );

  return response.data;
};

// =====================================================
// REACT QUERY HOOKS
// =====================================================

export const useSearch = (
  request: SearchRequest,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["search", request],
    queryFn: ({ signal }) => searchDocuments(request, signal),
    enabled,
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
};

// Consultar el detalle de un documento seleccionado.
export const useDocumentById = (
  documentId: string | null
) => {
  return useQuery({
    queryKey: ["document-detail", documentId],
    queryFn: ({ signal }) =>
      fetchDocumentById(documentId!, signal),
    enabled: Boolean(documentId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filterOptions"],
    queryFn: ({ signal }) => fetchFilterOptions(signal),
    staleTime: 1000 * 60 * 30,
  });
};

export const useAutocomplete = (
  query: string,
  limit: number | undefined = undefined,
  enabled: boolean = true
) => {
  const trimmed = query.trim();
  const term = trimmed.replace(/^#+/, "").trim();
  const isLexical =
    trimmed.startsWith("#") && term.length >= 2;

  return useQuery({
    queryKey: ["autocomplete", trimmed, limit],
    queryFn: ({ signal }) =>
      fetchAutocomplete(trimmed, limit, signal),
    enabled: isLexical && enabled,
    staleTime: 1000 * 30,
  });
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const TIPO_DOCUMENTO_FALLBACK_MAP: Record<string, number> = {
  Reglamento: 1,
  Decreto: 2,
  "Decreto Exento": 3,
  Resolución: 4,
  "Resolución Rectoría": 5,
  Instructivo: 6,
  Normativa: 7,
  Acta: 8,
  Documento: 9,
};

const ESTADO_VIGENCIA_FALLBACK_MAP: Record<string, number> = {
  Vigente: 1,
  Derogado: 2,
  Modificado: 3,
  "En Revisión": 4,
  "No Vigente": 5,
};

function resolveSingleCatalogId(
  selectedName: string | undefined,
  options: FilterOption[] | undefined,
  fallbackMap: Record<string, number>
): number | undefined {
  if (!selectedName || selectedName === "Todos") return undefined;
  const clean = selectedName.toLowerCase().trim();
  const matched = options?.find(
    (opt) => opt.nombre.toLowerCase().trim() === clean
  );
  if (matched) return matched.id;
  return fallbackMap[selectedName];
}

function resolveMultiCatalogIds(
  selectedNames: unknown,
  options: FilterOption[] | undefined,
  normalize: (str: string) => string = (str) => str.toLowerCase().trim()
): number | number[] | undefined {
  if (!Array.isArray(selectedNames) || selectedNames.length === 0 || !options?.length) {
    return undefined;
  }

  const matchedIds: number[] = [];
  for (const name of selectedNames) {
    if (typeof name !== "string") continue;
    const clean = normalize(name);
    const matched = options.find((opt) => normalize(opt.nombre) === clean);
    if (matched) {
      matchedIds.push(matched.id);
    }
  }

  if (matchedIds.length === 0) return undefined;
  return matchedIds.length === 1 ? matchedIds[0] : matchedIds;
}

function applyYearFilters(rawYears: unknown, apiFilters: SearchFilters): void {
  if (!Array.isArray(rawYears) || rawYears.length === 0) return;

  const years = rawYears
    .map(Number)
    .filter((n: number) => !Number.isNaN(n));

  if (years.length > 0) {
    apiFilters.anios = years;
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    apiFilters.creaciondesde = `${minYear}-01-01`;
    apiFilters.creacionhasta = `${maxYear}-12-31`;
  }
}

export const mapFrontendFiltersToAPI = (
  frontendFilters: any,
  filterOptions?: FilterOptions
): SearchFilters => {
  const apiFilters: SearchFilters = {};

  if (!frontendFilters) return apiFilters;

  // 1. Tipo de documento
  const idTipoDoc = resolveSingleCatalogId(
    frontendFilters.tipoDocumento,
    filterOptions?.tipos_documento,
    TIPO_DOCUMENTO_FALLBACK_MAP
  );
  if (idTipoDoc !== undefined) {
    apiFilters.idtipodocumento = idTipoDoc;
  }

  // 2. Estado
  const idEstado = resolveSingleCatalogId(
    frontendFilters.estado,
    filterOptions?.estados_vigencia,
    ESTADO_VIGENCIA_FALLBACK_MAP
  );
  if (idEstado !== undefined) {
    apiFilters.idestadovigencia = idEstado;
  }

  // 3. Año
  applyYearFilters(frontendFilters.año, apiFilters);

  // 4. Área (TipoArea)
  const idArea = resolveMultiCatalogIds(
    frontendFilters.area,
    filterOptions?.tipos_area
  );
  if (idArea !== undefined) {
    apiFilters.idtipoarea = idArea;
  }

  // 5. Sede / Campus (SedeCampus)
  const sedesCatalog = filterOptions?.sedes_campus?.length
    ? filterOptions.sedes_campus
    : filterOptions?.sedes;
  const idSede = resolveMultiCatalogIds(
    frontendFilters.sede,
    sedesCatalog,
    (str) => str.toLowerCase().replace(/[()]/g, "").trim()
  );
  if (idSede !== undefined) {
    apiFilters.idrecintouniversitario = idSede;
  }

  // 6. Departamento (Departamento)
  const idDep = resolveMultiCatalogIds(
    frontendFilters.departamento,
    filterOptions?.departamentos,
    (str) => str.toLowerCase().replace(/^departamento de\s+/i, "").trim()
  );
  if (idDep !== undefined) {
    apiFilters.iddepartamento = idDep;
  }

  // 7. Carrera (Carrera)
  const idCarrera = resolveMultiCatalogIds(
    frontendFilters.carrera,
    filterOptions?.carreras
  );
  if (idCarrera !== undefined) {
    apiFilters.idcarrera = idCarrera;
  }

  return apiFilters;
};