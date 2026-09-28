import { useQuery } from '@tanstack/react-query';
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
  // Basic document metadata
  numero?: string;
  nommetadato?: string;
  numacuerdo?: number;
  numsesion?: number;

  // Vigencia (EstadoVigencia)
  idestadovigencia?: number;

  // Dates
  creaciondesde?: string;
  creacionhasta?: string;
  derogaciondesde?: string;
  derogacionhasta?: string;

  // Boolean filters
  aplicacioninmediata?: boolean;
  isactive?: boolean;

  // Tipo documento (TipoDocumento)
  idtipodocumento?: number;

  // Tipo decisión (TipoDecision)
  idtipodecision?: number;

  // Tipo sesión (TipoSesion)
  idtiposesion?: number;

  // Categoría (Categoria → MacroCategoria)
  idcategoria?: number;
  idmacrocategoria?: number;

  // Área (TipoArea → subAreas)
  idtipoarea?: number;
  idsubarea?: number;

  // Beneficios (BeneficioInterno → DocumentoBeneficio)
  idbeneficio?: number;

  // Sede / Campus (SedeCampus → DocumentoSedeCampus)
  idrecintouniversitario?: number;

  // Departamento (Departamento → DocumentoDepartamento)
  iddepartamento?: number;

  // Carrera (Carrera → DocumentoCarrera)
  idcarrera?: number;

  // Tipo programa (TipoPrograma → NivelAcademico)
  idtipoprograma?: number;

  // Nivel académico (NivelAcademico → DocumentoNivel)
  idnivel?: number;

  // Rol / Nombramiento (TipoNombramiento → DocumentoNombramiento)
  idtiponombramiento?: number;

  // Jornada (Jornada → DocumentoJornada)
  idjornada?: number;

  // Rol institucional (RolInstitucional → DocumentoRol)
  idrol?: number;

  // Linaje/trazabilidad (RelacionDocumental)
  idrespaldolegal?: number;
  idtiporelacion?: number;
  idfuente?: number;
  verificada?: boolean;
  confianzamin?: number;
  confianzamax?: number;

  // Chunks (DocumentoChunk)
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
  // Catálogos base (15 tablas)
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
  
  // Entidades jerárquicas (4 tablas)
  sub_areas: FilterOption[];
  categorias: FilterOption[];
  niveles_academicos: FilterOption[];
  carreras: FilterOption[];
}

// =====================================================
// API FUNCTIONS
// =====================================================

const searchDocuments = async (request: SearchRequest): Promise<SearchResponse> => {
  const response = await api.post<SearchResponse>('/search/', request);
  return response.data;
};

const fetchFilterOptions = async (): Promise<FilterOptions> => {
  const response = await api.get<FilterOptions>('/search/filters');
  return response.data;
};

// =====================================================
// REACT QUERY HOOKS
// =====================================================

export const useSearch = (request: SearchRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', request],
    queryFn: () => searchDocuments(request),
    enabled: enabled && (request.query !== '' || Object.keys(request.filters).length > 0),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
    staleTime: 1000 * 60 * 30, // 30 minutes - filter options don't change often
  });
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Map frontend filter names to API filter IDs
export const mapFrontendFiltersToAPI = (frontendFilters: any): SearchFilters => {
  const apiFilters: SearchFilters = {};

  // Tipo de documento
  if (frontendFilters.tipoDocumento && frontendFilters.tipoDocumento !== 'Todos') {
    // Map "Decreto" to ID 2, "Reglamento" to ID 1, etc.
    const tipoDocumentoMap: Record<string, number> = {
      'Reglamento': 1,
      'Decreto': 2,
      'Decreto Exento': 3,
      'Resolución': 4,
      'Resolución Rectoría': 5,
      'Instructivo': 6,
      'Normativa': 7,
      'Acta': 8,
      'Documento': 9,
    };
    apiFilters.idtipodocumento = tipoDocumentoMap[frontendFilters.tipoDocumento];
  }

  // Estado
  if (frontendFilters.estado && frontendFilters.estado !== 'Todos') {
    const estadoMap: Record<string, number> = {
      'Vigente': 1,
      'Derogado': 2,
      'Modificado': 3,
      'En Revisión': 4,
      'No Vigente': 5,
    };
    apiFilters.idestadovigencia = estadoMap[frontendFilters.estado];
  }

  // Año - map to date range
  if (frontendFilters.año && frontendFilters.año.length > 0) {
    const years = frontendFilters.año.map(Number);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    apiFilters.creaciondesde = `${minYear}-01-01`;
    apiFilters.creacionhasta = `${maxYear}-12-31`;
  }

  // These would need proper mapping from names to IDs using the filter options
  // For now, we'll leave them empty as they require the filter options API
  
  return apiFilters;
};