import { useQuery } from "@tanstack/react-query";
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
  idestadovigencia?: number;

  // Fechas
  creaciondesde?: string;
  creacionhasta?: string;
  derogaciondesde?: string;
  derogacionhasta?: string;

  // Booleanos
  aplicacioninmediata?: boolean;
  isactive?: boolean;

  // Tipo de documento
  idtipodocumento?: number;

  // Tipo de decisión
  idtipodecision?: number;

  // Tipo de sesión
  idtiposesion?: number;

  // Categoría
  idcategoria?: number;
  idmacrocategoria?: number;

  // Área
  idtipoarea?: number;
  idsubarea?: number;

  // Beneficios
  idbeneficio?: number;

  // Sede / Campus
  idrecintouniversitario?: number;

  // Departamento
  iddepartamento?: number;

  // Carrera
  idcarrera?: number;

  // Programa / nivel académico
  idtipoprograma?: number;
  idnivel?: number;

  // Nombramiento
  idtiponombramiento?: number;

  // Jornada
  idjornada?: number;

  // Rol institucional
  idrol?: number;

  // Trazabilidad
  idrespaldolegal?: number;
  idtiporelacion?: number;
  idfuente?: number;
  verificada?: boolean;
  confianzamin?: number;
  confianzamax?: number;

  // Chunks
  idtipopagina?: number;
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
// API FUNCTIONS
// =====================================================

const searchDocuments = async (
  request: SearchRequest
): Promise<SearchResponse> => {
  const response = await api.post<SearchResponse>(
    "/search/",
    request
  );

  return response.data;
};

const fetchFilterOptions = async (): Promise<FilterOptions> => {
  const response = await api.get<FilterOptions>(
    "/search/filters"
  );

  return response.data;
};

export const fetchAutocomplete = async (
  query: string,
  limit: number = 8
): Promise<AutocompleteResponse> => {
  const trimmed = query.trim();
  if (!trimmed.startsWith("#")) {
    return { query, is_lexical: false, suggestions: [] };
  }

  const response = await api.get<AutocompleteResponse>("/search/autocomplete", {
    params: { q: trimmed, limit },
  });

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
    queryFn: () => searchDocuments(request),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ["filterOptions"],
    queryFn: fetchFilterOptions,
    staleTime: 1000 * 60 * 30,
  });
};

export const useAutocomplete = (query: string, limit: number = 8) => {
  const trimmed = query.trim();
  const term = trimmed.replace(/^#+/, "").trim();
  const isLexical = trimmed.startsWith("#") && term.length >= 2;

  return useQuery({
    queryKey: ["autocomplete", trimmed, limit],
    queryFn: () => fetchAutocomplete(trimmed, limit),
    enabled: isLexical,
    staleTime: 1000 * 30,
  });
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const mapFrontendFiltersToAPI = (
  frontendFilters: any
): SearchFilters => {
  const apiFilters: SearchFilters = {};

  // Tipo de documento
  if (
    frontendFilters.tipoDocumento &&
    frontendFilters.tipoDocumento !== "Todos"
  ) {
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

    const tipoDocumentoId =
      tipoDocumentoMap[frontendFilters.tipoDocumento];

    if (tipoDocumentoId !== undefined) {
      apiFilters.idtipodocumento = tipoDocumentoId;
    }
  }

  // Estado
  if (
    frontendFilters.estado &&
    frontendFilters.estado !== "Todos"
  ) {
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

  // Año: rango entre el año menor y el mayor seleccionado.
  if (
    frontendFilters.año &&
    frontendFilters.año.length > 0
  ) {
    const years = frontendFilters.año.map(Number);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    apiFilters.creaciondesde = `${minYear}-01-01`;
    apiFilters.creacionhasta = `${maxYear}-12-31`;
  }

  // Área, sede, departamento y carrera mantienen
  // el comportamiento del mapeo original.

  return apiFilters;
};
