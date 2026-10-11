import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";

export interface SedeCampus {
  idrecintouniversitario: number;
  nombrerecinto: string;
}

export interface Categoria {
  idcategoria: number;
  nombrecategoria: string;
  numcategoria?: string;
  macrocategoria?: string;
}

export interface DocumentoAPI {
  iddocumento: string;
  numero: string;
  titulo: string;
  nommetadato: string;
  tipodocumento?: string;
  tipodecision?: string;
  tiposesion?: string;
  estadovigencia?: string;
  numacuerdo?: number;
  numsesion?: number;
  descripcion?: string;
  creacion?: string;
  derogacion?: string;
  aplicacioninmediata?: boolean;
  isactive: boolean;
  sedes: SedeCampus[];
  categorias: Categoria[];
}

export interface Documento {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha: string;
  organismo: string;
  descripcion: string;
  archivo: string;
  area?: string;
  sede?: string[];
  departamento?: string[];
  carrera?: string[];
}

export interface DocumentUrlResponse {
  url: string;
  expires_in: number;
}

// Transform API response to match frontend Document type
const transformToDocumento = (apiDoc: DocumentoAPI): Documento => {
  // Extract year from creacion date if available
  const fecha = apiDoc.creacion 
    ? new Date(apiDoc.creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : 'Sin fecha';

  // Map API fields to frontend fields
  return {
    id: apiDoc.iddocumento,
    titulo: apiDoc.titulo,
    tipo: apiDoc.tipodocumento || apiDoc.nommetadato || 'Documento',
    estado: apiDoc.estadovigencia || 'Vigente',
    fecha: fecha,
    organismo: apiDoc.nommetadato || 'Universidad',
    descripcion: apiDoc.descripcion || '',
    archivo: `/Pdf/documento_${apiDoc.iddocumento}.pdf`, // Placeholder for file path
    area: apiDoc.categorias[0]?.nombrecategoria || undefined,
    sede: apiDoc.sedes.map(s => s.nombrerecinto),
    departamento: [], // This would need to be populated from departamento relation
    carrera: [], // This would need to be populated from carrera relation
  };
};

// API functions using axios
const fetchDocuments = async (skip: number = 0, limit: number = 50): Promise<Documento[]> => {
  const response = await api.get<DocumentoAPI[]>('/documents', {
    params: { skip, limit }
  });
  return response.data.map(transformToDocumento);
};

const fetchDocumentById = async (id: string): Promise<Documento> => {
  const response = await api.get<DocumentoAPI>(`/documents/${id}`);
  return transformToDocumento(response.data);
};

export const getDocumentUrl = async (id: string): Promise<string> => {
  const response = await api.get<DocumentUrlResponse>(`/documents/${id}/url`);
  return response.data.url;
};

// React Query hooks
export const useDocuments = (skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['documents', skip, limit],
    queryFn: () => fetchDocuments(skip, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDocumentUrl = (id: string | null) => {
  return useQuery({
    queryKey: ['documentUrl', id],
    queryFn: () => id ? getDocumentUrl(id) : Promise.reject('No ID'),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Document manipulation hooks
export interface DocumentUpdateData {
  titulo?: string;
  descripcion?: string;
  idcategoria?: number;
  idtipodecision?: number;
  idtiposesion?: number;
  idestadovigencia?: number;
  derogacion?: string;
  aplicacioninmediata?: boolean;
  isactive?: boolean;
  sedesids?: number[];
  carrerasids?: number[];
  beneficiosids?: number[];
  nombramientosids?: number[];
  departamentosids?: number[];
  jornadasids?: number[];
  nivelesids?: number[];
  rolesids?: number[];
  areaseemisorasids?: number[];
}

const updateDocument = async (id: string, data: DocumentUpdateData): Promise<DocumentoAPI> => {
  const response = await api.put<DocumentoAPI>(`/documents/${id}`, data);
  return response.data;
};

const toggleDocumentActive = async (id: string): Promise<DocumentoAPI> => {
  const response = await api.patch<DocumentoAPI>(`/documents/${id}/toggle-active`);
  return response.data;
};

const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DocumentUpdateData }) => 
      updateDocument(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch documents queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
    },
  });
};

export const useToggleDocumentActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => toggleDocumentActive(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch documents queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      // Invalidate and refetch documents queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};

export const getAdminCatalogs = async (): Promise<any> => {
  const response = await api.get('/documents/admin/catalogs');
  const d = response.data;
  const mo = (arr: any[] = []) => arr.map(x => ({ value: x.id, label: x.nombre }));
  return {
    tiposDocumento: mo(d.tipos_documento),
    estadosVigencia: mo(d.estados_vigencia),
    tiposSesion: mo(d.tipos_sesion),
    tiposDecision: mo(d.tipos_decision),
    macroCategorias: mo(d.macro_categorias),
    categorias: mo(d.categorias),
    tiposArea: mo(d.tipos_area),
    subAreas: mo(d.sub_areas),
    tiposPrograma: mo(d.tipos_programa),
    niveles: mo(d.niveles_academicos),
    carreras: mo(d.carreras),
    jornadas: mo(d.jornadas),
    departamentos: mo(d.departamentos),
    sedes: mo(d.sedes_campus),
    roles: mo(d.roles_institucionales),
    beneficios: mo(d.beneficios),
    nombramientos: mo(d.tipos_nombramiento),
    tiposRelacion: mo(d.tipos_relacion),
    fuentesDeteccion: mo(d.fuentes_deteccion),
    respaldosLegales: mo(d.respaldos_legales)
  };
};

export const getEditableDocument = async (id: string): Promise<any> => {
  const response = await api.get(`/documents/${id}/editable`);
  const d = response.data;
  return {
    ...d,
    areasemisoras: d.areaseemisorasids || [],
    niveles: d.nivelesids || [],
    carreras: d.carrerasids || [],
    jornadas: d.jornadasids || [],
    departamentos: d.departamentosids || [],
    sedes: d.sedesids || [],
    roles: d.rolesids || [],
    beneficios: d.beneficiosids || [],
    nombramientos: d.nombramientosids || [],
    relaciones: d.relaciones || []
  };
};

export const saveEditableDocument = async (id: string, data: any): Promise<any> => {
  const payload = {
    ...data,
    areaseemisorasids: data.areasemisoras,
    nivelesids: data.niveles,
    carrerasids: data.carreras,
    jornadasids: data.jornadas,
    departamentosids: data.departamentos,
    sedesids: data.sedes,
    rolesids: data.roles,
    beneficiosids: data.beneficios,
    nombramientosids: data.nombramientos,
  };
  const response = await api.put(`/documents/${id}`, payload);
  return response.data;
};

export const searchDocumentsForAdmin = async (query: string): Promise<any> => {
  const response = await api.post('/search', { query, filters: {}, page: 1, page_size: 50 });
  return response.data.results;
};