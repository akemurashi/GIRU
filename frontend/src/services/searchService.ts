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

export const mapFrontendFiltersToAPI = (
  frontendFilters: any,
  filterOptions?: FilterOptions
): SearchFilters => {
  const apiFilters: SearchFilters = {};

  if (!frontendFilters) return apiFilters;

  // 1. Tipo de documento
  if (
    frontendFilters.tipoDocumento &&
    frontendFilters.tipoDocumento !== "Todos"
  ) {
    const matched = filterOptions?.tipos_documento?.find(
      (opt) => opt.nombre.toLowerCase().trim() === frontendFilters.tipoDocumento.toLowerCase().trim()
    );
    if (matched) {
      apiFilters.idtipodocumento = matched.id;
    } else {
      const tipoDocumentoMap: Record<string, number> = {
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
      const tipoDocumentoId = tipoDocumentoMap[frontendFilters.tipoDocumento];
      if (tipoDocumentoId !== undefined) {
        apiFilters.idtipodocumento = tipoDocumentoId;
      }
    }
  }

  // 2. Estado
  if (
    frontendFilters.estado &&
    frontendFilters.estado !== "Todos"
  ) {
    const matched = filterOptions?.estados_vigencia?.find(
      (opt) => opt.nombre.toLowerCase().trim() === frontendFilters.estado.toLowerCase().trim()
    );
    if (matched) {
      apiFilters.idestadovigencia = matched.id;
    } else {
      const estadoMap: Record<string, number> = {
        Vigente: 1,
        Derogado: 2,
        Modificado: 3,
        "En Revisión": 4,
        "No Vigente": 5,
      };
      const estadoId = estadoMap[frontendFilters.estado];
      if (estadoId !== undefined) {
        apiFilters.idestadovigencia = estadoId;
      }
    }
  }

  // 3. Año
  if (
    frontendFilters.año &&
    Array.isArray(frontendFilters.año) &&
    frontendFilters.año.length > 0
  ) {
    const years = frontendFilters.año.map(Number).filter((n: number) => !isNaN(n));
    if (years.length > 0) {
      apiFilters.anios = years;
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      apiFilters.creaciondesde = `${minYear}-01-01`;
      apiFilters.creacionhasta = `${maxYear}-12-31`;
    }
  }

  // 4. Área (TipoArea)
  if (
    frontendFilters.area &&
    Array.isArray(frontendFilters.area) &&
    frontendFilters.area.length > 0
  ) {
    const areaIds: number[] = [];
    const areaList = filterOptions?.tipos_area || [];
    for (const name of frontendFilters.area) {
      const clean = name.toLowerCase().trim();
      const matched = areaList.find(
        (a) => a.nombre.toLowerCase().trim() === clean
      );
      if (matched) {
        areaIds.push(matched.id);
      }
    }
    if (areaIds.length > 0) {
      apiFilters.idtipoarea = areaIds.length === 1 ? areaIds[0] : areaIds;
    }
  }

  // 5. Sede / Campus (SedeCampus)
  if (
    frontendFilters.sede &&
    Array.isArray(frontendFilters.sede) &&
    frontendFilters.sede.length > 0
  ) {
    const sedeIds: number[] = [];
    const sedesList = filterOptions?.sedes_campus?.length
      ? filterOptions.sedes_campus
      : filterOptions?.sedes || [];
    for (const name of frontendFilters.sede) {
      const clean = name.toLowerCase().replace(/[\(\)]/g, "").trim();
      const matched = sedesList.find(
        (s: FilterOption) => s.nombre.toLowerCase().replace(/[\(\)]/g, "").trim() === clean
      );
      if (matched) {
        sedeIds.push(matched.id);
      }
    }
    if (sedeIds.length > 0) {
      apiFilters.idrecintouniversitario = sedeIds.length === 1 ? sedeIds[0] : sedeIds;
    }
  }

  // 6. Departamento (Departamento)
  if (
    frontendFilters.departamento &&
    Array.isArray(frontendFilters.departamento) &&
    frontendFilters.departamento.length > 0
  ) {
    const depIds: number[] = [];
    const depList = filterOptions?.departamentos || [];
    for (const name of frontendFilters.departamento) {
      const clean = name.toLowerCase().replace(/^departamento de\s+/i, "").trim();
      const matched = depList.find(
        (d) => d.nombre.toLowerCase().replace(/^departamento de\s+/i, "").trim() === clean
      );
      if (matched) {
        depIds.push(matched.id);
      }
    }
    if (depIds.length > 0) {
      apiFilters.iddepartamento = depIds.length === 1 ? depIds[0] : depIds;
    }
  }

  // 7. Carrera (Carrera)
  if (
    frontendFilters.carrera &&
    Array.isArray(frontendFilters.carrera) &&
    frontendFilters.carrera.length > 0
  ) {
    const carrIds: number[] = [];
    const carrList = filterOptions?.carreras || [];
    for (const name of frontendFilters.carrera) {
      const clean = name.toLowerCase().trim();
      const matched = carrList.find(
        (c) => c.nombre.toLowerCase().trim() === clean
      );
      if (matched) {
        carrIds.push(matched.id);
      }
    }
    if (carrIds.length > 0) {
      apiFilters.idcarrera = carrIds.length === 1 ? carrIds[0] : carrIds;
    }
  }

  return apiFilters;
};