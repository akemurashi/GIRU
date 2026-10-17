import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export interface RelacionItem {
  idrelacion: number;
  iddocumentoorigen?: string;
  iddocumentodestino?: string;
  idtiporelacion: number;
  nombretiporelacion?: string;
  detalledemodificacion?: string;
  fechaefecto?: string;
  verificada: boolean;
  confianza?: number;
}

export interface DocumentLineageResponse {
  document_id: string;
  relaciones_como_origen: RelacionItem[];
  relaciones_como_destino: RelacionItem[];
}

export interface RelacionCreatePayload {
  iddocumentoorigen: string;
  iddocumentodestino: string;
  idtiporelacion?: number | null;
  nombretiporelacion?: string | null;
  detallemodificacion?: string | null;
  fechaefecto?: string | null;
  verificada?: boolean;
  confianza?: number;
  textoevidencia?: string | null;
  idfuentedeteccion?: number | null;
  idrespaldolegal?: number | null;
  idrelacion?: number | null;
}

export interface RelacionDeletePayload {
  idrelacion?: number | null;
  iddocumentoorigen?: string | null;
  iddocumentodestino?: string | null;
  idtiporelacion?: number | null;
}

export interface DocumentoDetalleCanonico {
  iddocumento: string;
  numero: string;
  titulo: string;
  nommetadato: string;
  descripcion?: string;
  tipodocumento?: string | { id?: number; nombre?: string; nombretipodocumento?: string };
  estadovigencia?: string | { id?: number; nombre?: string; estadovigencia?: string };
  creacion?: string;
  derogacion?: string;
  aplicacioninmediata?: boolean;
  isactive?: boolean;
  sedes?: any[];
  categorias?: any[];
  relaciones_como_origen?: Array<{
    idrelacion: number;
    iddocumentodestino: string;
    idtiporelacion: number;
    nombretiporelacion?: string;
    detalledemodificacion?: string;
    fechaefecto?: string;
    verificada: boolean;
    confianza?: number;
    documentodestino?: {
      iddocumento: string;
      numero: string;
      titulo: string;
    };
  }>;
  relaciones_como_destino?: Array<{
    idrelacion: number;
    iddocumentoorigen: string;
    idtiporelacion: number;
    nombretiporelacion?: string;
    detalledemodificacion?: string;
    fechaefecto?: string;
    verificada: boolean;
    confianza?: number;
    documentoorigen?: {
      iddocumento: string;
      numero: string;
      titulo: string;
    };
  }>;
  [key: string]: any;
}

// ----------------------------------------------------------------
// Llamadas API
// ----------------------------------------------------------------

export const getDocumentLineage = async (
  documentId: string
): Promise<DocumentLineageResponse> => {
  const response = await api.get<DocumentLineageResponse>(
    `/relaciones/${documentId}/lineage`
  );
  return response.data;
};

export const getDocumentCanonicalDetail = async (
  documentId: string
): Promise<DocumentoDetalleCanonico> => {
  const response = await api.get<DocumentoDetalleCanonico>(
    `/documents/${documentId}/detail`
  );
  return response.data;
};

export const createOrUpdateRelation = async (
  payload: RelacionCreatePayload
): Promise<{ status: string; message: string }> => {
  const response = await api.post<{ status: string; message: string }>(
    "/relaciones/",
    payload
  );
  return response.data;
};

export const deleteRelation = async (
  payload: RelacionDeletePayload
): Promise<{ status: string; message: string }> => {
  const response = await api.delete<{ status: string; message: string }>(
    "/relaciones/",
    { data: payload }
  );
  return response.data;
};

// ----------------------------------------------------------------
// Hooks React Query
// ----------------------------------------------------------------

export const useDocumentLineage = (documentId: string | null) => {
  return useQuery({
    queryKey: ["document-lineage", documentId],
    queryFn: () => (documentId ? getDocumentLineage(documentId) : null),
    enabled: Boolean(documentId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDocumentCanonicalDetail = (documentId: string | null) => {
  return useQuery({
    queryKey: ["document-canonical-detail", documentId],
    queryFn: () => (documentId ? getDocumentCanonicalDetail(documentId) : null),
    enabled: Boolean(documentId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOrUpdateRelation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RelacionCreatePayload) =>
      createOrUpdateRelation(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["document-lineage", variables.iddocumentoorigen],
      });
      queryClient.invalidateQueries({
        queryKey: ["document-canonical-detail", variables.iddocumentoorigen],
      });
      queryClient.invalidateQueries({
        queryKey: ["document-canonical-detail", variables.iddocumentodestino],
      });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useDeleteRelation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RelacionDeletePayload) => deleteRelation(payload),
    onSuccess: (_, variables) => {
      if (variables.iddocumentoorigen) {
        queryClient.invalidateQueries({
          queryKey: ["document-lineage", variables.iddocumentoorigen],
        });
        queryClient.invalidateQueries({
          queryKey: ["document-canonical-detail", variables.iddocumentoorigen],
        });
      }
      if (variables.iddocumentodestino) {
        queryClient.invalidateQueries({
          queryKey: ["document-canonical-detail", variables.iddocumentodestino],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};
