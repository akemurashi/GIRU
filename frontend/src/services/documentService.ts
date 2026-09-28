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
  iddocumento: number;
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
  id: number;
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

const fetchDocumentById = async (id: number): Promise<Documento> => {
  const response = await api.get<DocumentoAPI>(`/documents/${id}`);
  return transformToDocumento(response.data);
};

const getDocumentUrl = async (id: number): Promise<string> => {
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

export const useDocument = (id: number) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDocumentUrl = (id: number | null) => {
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

const updateDocument = async (id: number, data: DocumentUpdateData): Promise<DocumentoAPI> => {
  const response = await api.put<DocumentoAPI>(`/documents/${id}`, data);
  return response.data;
};

const toggleDocumentActive = async (id: number): Promise<DocumentoAPI> => {
  const response = await api.patch<DocumentoAPI>(`/documents/${id}/toggle-active`);
  return response.data;
};

const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DocumentUpdateData }) => 
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
    mutationFn: (id: number) => toggleDocumentActive(id),
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
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      // Invalidate and refetch documents queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });
};