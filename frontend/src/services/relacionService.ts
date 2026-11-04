import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

/** Hito normativo individual en la línea de tiempo */
export interface HitoNormativo {
  /** Código oficial del decreto/resolución (ej: "DECRETO 053/1992") */
  decreto: string;
  /** Fecha en formato ISO YYYY-MM-DD o null si no se conoce con exactitud */
  fecha: string | null;
  /** Año del hito (ej: 1992) o null */
  anio: number | null;
  /**
   * Nombre del archivo Markdown o PDF digitalizado en el corpus.
   * IMPORTANTE: Si es null, la norma existe formalmente pero NO está digitalizada.
   */
  nombre_archivo: string | null;
}

/** Contenedor consolidado de trazabilidad */
export interface TrazabilidadData {
  cant_antes: number;
  cant_despues: number;
  ultima_sincronizacion: string | null; // ISO timestamp
  antes: HitoNormativo[];
  despues: HitoNormativo[];
}

/** Respuesta del endpoint ligero GET /api/v1/documents/:id/trazabilidad */
export interface DocumentoTrazabilidadResponse {
  iddocumento: string; // UUIDv7
  numero: string;
  titulo: string;
  nommetadato: string | null;
  estadovigencia: string | { id: number; nombre: string } | null;
  trazabilidad: TrazabilidadData;
}

/** Payload para PUT /api/v1/documents/:id/trazabilidad (Panel de Administración) */
export interface TrazabilidadUpsertPayload {
  antes: HitoNormativo[];
  despues: HitoNormativo[];
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
  sedes?: unknown[];
  categorias?: unknown[];
  trazabilidad?: TrazabilidadData;
  [key: string]: unknown;
}

// ----------------------------------------------------------------
// Llamadas API de Trazabilidad Normativa
// ----------------------------------------------------------------

/**
 * Consulta la trazabilidad de un documento (Disponible para rol basic y admin)
 */
export const getTrazabilidad = async (
  documentId: string
): Promise<DocumentoTrazabilidadResponse> => {
  const response = await api.get<DocumentoTrazabilidadResponse>(
    `/documents/${encodeURIComponent(documentId)}/trazabilidad`
  );
  return response.data;
};

/**
 * Resuelve el ID y título oficial de un documento a partir de su 'nombre_archivo'
 * (Soporta automáticamente nombres con extensión .md, .pdf, caracteres especiales UTF-8 y variaciones de puntuación).
 */
export const resolveDocumentoPorTitulo = async (
  nombreArchivo: string
): Promise<{ id: string; titulo: string }> => {
  const response = await api.get<{
    id?: string;
    iddocumento?: string;
    titulo: string;
  }>(`/documents/by-title/${encodeURIComponent(nombreArchivo)}`);

  const data = response.data;
  const resolvedId = data.id || data.iddocumento || "";
  if (!resolvedId) {
    throw new Error("No se encontró el identificador del documento relacionado.");
  }

  return {
    id: String(resolvedId),
    titulo: data.titulo,
  };
};

/**
 * Modifica o crea la trazabilidad (Solo rol admin)
 */
export const updateTrazabilidad = async (
  documentId: string,
  payload: TrazabilidadUpsertPayload
): Promise<DocumentoTrazabilidadResponse> => {
  const response = await api.put<DocumentoTrazabilidadResponse>(
    `/documents/${encodeURIComponent(documentId)}/trazabilidad`,
    payload
  );
  return response.data;
};

/**
 * Elimina la trazabilidad de un documento (Solo rol admin)
 */
export const deleteTrazabilidad = async (
  documentId: string
): Promise<{ status: string; iddocumento?: string; message: string }> => {
  const response = await api.delete<{
    status: string;
    iddocumento?: string;
    message: string;
  }>(`/documents/${encodeURIComponent(documentId)}/trazabilidad`);
  return response.data;
};

export const getDocumentCanonicalDetail = async (
  documentId: string
): Promise<DocumentoDetalleCanonico> => {
  const response = await api.get<DocumentoDetalleCanonico>(
    `/documents/${encodeURIComponent(documentId)}/detail`
  );
  return response.data;
};

export const trazabilidadService = {
  getTrazabilidad,
  resolveDocumentoPorTitulo,
  updateTrazabilidad,
  deleteTrazabilidad,
};

// ----------------------------------------------------------------
// Hooks React Query
// ----------------------------------------------------------------

export const useDocumentTrazabilidad = (documentId: string | null) => {
  return useQuery({
    queryKey: ["document-trazabilidad", documentId],
    queryFn: () => (documentId ? getTrazabilidad(documentId) : null),
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

export const useUpdateTrazabilidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      documentId,
      payload,
    }: {
      documentId: string;
      payload: TrazabilidadUpsertPayload;
    }) => updateTrazabilidad(documentId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["document-trazabilidad", variables.documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document-canonical-detail", variables.documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document-detail", variables.documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId],
      });
      void queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useDeleteTrazabilidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => deleteTrazabilidad(documentId),
    onSuccess: (_, documentId) => {
      void queryClient.invalidateQueries({
        queryKey: ["document-trazabilidad", documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document-canonical-detail", documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document-detail", documentId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["document", documentId],
      });
      void queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};
