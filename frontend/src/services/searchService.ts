import { useQuery } from '@tanstack/react-query';
import api from "./api";

// ============================================
// TYPES
// ============================================

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

export interface SearchFilters {
  numero?: string;
  nommetadato?: string;
  numacuerdo?: number;
  numsesion?: number;
  idestadovigencia?: number;
  creaciondesde?: string;
  creacionhasta?: string;
  derogaciondesde?: string;
  derogacionhasta?: string;
  aplicacioninmediata?: boolean;
  isactive?: boolean;
  idtipodocumento?: number;
  idtipodecision?: number;
  idtiposesion?: number;
  idcategoria?: number;
  idmacrocategoria?: number;
  idtipoarea?: number;
  idsubarea?: number;
  idbeneficio?: number;
  idrecintouniversitario?: number;
  iddepartamento?: number;
  idcarrera?: number;
  idtipoprograma?: number;
  idnivel?: number;
  idtiponombramiento?: number;
  idjornada?: number;
  idrol?: number;
  idrespaldolegal?: number;
  idtiporelacion?: number;
  idfuente?: number;
  verificada?: boolean;
  confianzamin?: number;
  confianzamax?: number;
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

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  page_size?: number;
}

// ============================================
// API FUNCTIONS
// ============================================

const fetchFilterOptions = async (): Promise<FilterOptions> => {
  const response = await api.get<FilterOptions>('/search/filters');
  return response.data;
};

const searchDocuments = async (request: SearchRequest): Promise<SearchResponse> => {
  const response = await api.post<SearchResponse>('/search/', request);
  return response.data;
};

// ============================================
// REACT QUERY HOOKS
// ============================================

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: fetchFilterOptions,
    staleTime: 1000 * 60 * 30, // 30 minutes - filter options don't change often
  });
};

export const useSearchDocuments = (request: SearchRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['search', request],
    queryFn: () => searchDocuments(request),
    enabled: enabled && !!request.query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
