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
