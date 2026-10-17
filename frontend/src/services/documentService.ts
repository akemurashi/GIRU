
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// ----------------------------------------------------------------
// Transformación de documentos
// ----------------------------------------------------------------

const transformToDocumento = (apiDoc: DocumentoAPI): Documento => {
  const fecha = apiDoc.creacion
    ? new Date(apiDoc.creacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      })
    : "Sin fecha";

  return {
    id: apiDoc.iddocumento,
    titulo: apiDoc.titulo,
    tipo: apiDoc.tipodocumento || apiDoc.nommetadato || "Documento",
    estado: apiDoc.estadovigencia || "Vigente",
    fecha,
    organismo: apiDoc.nommetadato || "Universidad",
    descripcion: apiDoc.descripcion || "",
    archivo: `/Pdf/documento_${apiDoc.iddocumento}.pdf`,
    area: apiDoc.categorias?.[0]?.nombrecategoria || undefined,
    sede: apiDoc.sedes?.map((sede) => sede.nombrerecinto) || [],
    departamento: [],
    carrera: [],
  };
};

// ----------------------------------------------------------------
// Consultas API
// ----------------------------------------------------------------

const fetchDocuments = async (
  skip: number = 0,
  limit: number = 50
): Promise<Documento[]> => {
  const response = await api.get<DocumentoAPI[]>("/documents", {
    params: { skip, limit },
  });

  return response.data.map(transformToDocumento);
};

const fetchDocumentById = async (id: string): Promise<Documento> => {
  const response = await api.get<DocumentoAPI>(`/documents/${id}`);
  return transformToDocumento(response.data);
};

export const getDocumentUrl = async (id: string): Promise<string> => {
  const response = await api.get<DocumentUrlResponse>(
    `/documents/${id}/url`
  );

  return response.data.url;
};

// ----------------------------------------------------------------
// Hooks React Query
// ----------------------------------------------------------------

export const useDocuments = (
  skip: number = 0,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ["documents", skip, limit],
    queryFn: () => fetchDocuments(skip, limit),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });
};

export const useDocumentUrl = (id: string | null) => {
  return useQuery({
    queryKey: ["documentUrl", id],
    queryFn: () =>
      id
        ? getDocumentUrl(id)
        : Promise.reject(new Error("No ID")),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

// ----------------------------------------------------------------
// Actualización general de documentos
// ----------------------------------------------------------------

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

const updateDocument = async (
  id: string,
  data: DocumentUpdateData
): Promise<DocumentoAPI> => {
  const response = await api.put<DocumentoAPI>(`/documents/${id}`, data);
  return response.data;
};

const toggleDocumentActive = async (
  id: string
): Promise<DocumentoAPI> => {
  const response = await api.patch<DocumentoAPI>(
    `/documents/${id}/toggle-active`
  );

  return response.data;
};

const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DocumentUpdateData;
    }) => updateDocument(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.invalidateQueries({
        queryKey: ["document", variables.id],
      });
    },
  });
};

export const useToggleDocumentActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleDocumentActive(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
};

// ----------------------------------------------------------------
// Catálogos administrativos
// ----------------------------------------------------------------

export const getAdminCatalogs = async (): Promise<any> => {
  const response = await api.get("/documents/admin/catalogs");
  const data = response.data;

  const mapOptions = (items: any[] = []) =>
    items
      .map((item) => {
        const id =
          item.id ??
          item.idcategoria ??
          item.idCategoria ??
          item.idtipodocumento ??
          item.idTipoDocumento ??
          item.idestadovigencia ??
          item.idEstadoVigencia ??
          item.idtiposesion ??
          item.idTipoSesion ??
          item.idtipodecision ??
          item.idTipoDecision ??
          item.idtipoarea ??
          item.idTipoArea ??
          item.idsubarea ??
          item.idSubArea ??
          item.idtipoprograma ??
          item.idTipoPrograma ??
          item.idnivel ??
          item.idNivel;

        const label =
          item.nombre ??
          item.nombrecategoria ??
          item.nombreCategoria ??
          item.nombretipodocumento ??
          item.nombreTipoDocumento ??
          item.nombreestadovigencia ??
          item.nombreEstadoVigencia ??
          item.nombretiposesion ??
          item.nombreTipoSesion ??
          item.nombretipodecision ??
          item.nombreTipoDecision ??
          item.nombremacrocategoria ??
          item.nombreMacroCategoria ??
          item.nombretipoarea ??
          item.nombreTipoArea ??
          item.nombresubarea ??
          item.nombreSubArea ??
          item.nombreprograma ??
          item.nombrePrograma ??
          item.nombrenivel ??
          item.nombreNivel ??
          item.nombrecarrera ??
          item.nombreCarrera ??
          item.nombrejornada ??
          item.nombreJornada ??
          item.nombredepartamento ??
          item.nombreDepartamento ??
          item.nombrerecinto ??
          item.nombreRecinto ??
          item.nombrerol ??
          item.nombreRol ??
          item.nombrebeneficio ??
          item.nombreBeneficio ??
          item.nombramiento ??
          item.nombreNombramiento ??
          item.nombretiporelacion ??
          item.nombreTipoRelacion ??
          item.nombrefuente ??
          item.nombreFuente ??
          item.nombrerespaldolegal ??
          item.nombreRespaldoLegal;

        const code =
          item.code ??
          item.siglaMacro ??
          item.siglamacro ??
          item.sigla_macro ??
          item.numCategoria ??
          item.numcategoria ??
          item.num_categoria ??
          item.codigocarrera ??
          item.codigo_carrera;

        const parentId =
          item.parent_id ??
          item.parentId ??
          item.idMacroCategoria ??
          item.idmacrocategoria ??
          item.id_macro_categoria ??
          item.idTipoArea ??
          item.idtipoarea ??
          item.id_tipo_area ??
          item.idTipoPrograma ??
          item.idtipoprograma ??
          item.id_tipo_programa ??
          item.idNivel ??
          item.idnivel ??
          item.id_nivel;

        return {
          value: id,
          label: label == null ? "" : String(label),
          ...(code != null ? { code: String(code) } : {}),
          ...(parentId != null ? { parentId: Number(parentId) } : {}),
        };
      })
      .filter(
        (option: { value: unknown; label: string }) =>
          option.value != null && option.label !== ""
      );

  return {
    tiposDocumento: mapOptions(data.tipos_documento),
    estadosVigencia: mapOptions(data.estados_vigencia),
    tiposSesion: mapOptions(data.tipos_sesion),
    tiposDecision: mapOptions(data.tipos_decision),
    macroCategorias: mapOptions(data.macro_categorias),
    categorias: mapOptions(data.categorias),
    tiposArea: mapOptions(data.tipos_area),
    subAreas: mapOptions(data.sub_areas),
    tiposPrograma: mapOptions(data.tipos_programa),
    niveles: mapOptions(data.niveles_academicos),
    carreras: mapOptions(data.carreras),
    jornadas: mapOptions(data.jornadas),
    departamentos: mapOptions(data.departamentos),
    sedes: mapOptions(data.sedes_campus),
    roles: mapOptions(data.roles_institucionales),
    beneficios: mapOptions(data.beneficios),
    nombramientos: mapOptions(data.tipos_nombramiento),
    tiposRelacion: mapOptions(data.tipos_relacion),
    fuentesDeteccion: mapOptions(data.fuentes_deteccion),
    respaldosLegales: mapOptions(data.respaldos_legales),
  };
};

// ----------------------------------------------------------------
// Documento editable
// ----------------------------------------------------------------

export const getEditableDocument = async (
  id: string,
  catalogs: any
): Promise<any> => {
  const [editableResult, detailResult, lineageResult] = await Promise.allSettled([
    api.get(`/documents/${id}/editable`),
    api.get(`/documents/${id}`),
    api.get(`/relaciones/${id}/lineage`),
  ]);

  if (editableResult.status !== "fulfilled" || detailResult.status !== "fulfilled") {
    throw new Error("No se pudo cargar el documento.");
  }

  const editable = editableResult.value.data;
  const detail = detailResult.value.data;

  let relaciones: any[] = [];
  if (lineageResult.status === "fulfilled" && lineageResult.value.data?.relaciones_como_origen) {
    relaciones = lineageResult.value.data.relaciones_como_origen.map((r: any) => ({
      key: `rel-${r.idrelacion || crypto.randomUUID()}`,
      idrelacion: r.idrelacion,
      iddocumentodestino: r.iddocumentodestino,
      idtiporelacion: r.idtiporelacion,
      idrespaldolegal: r.idrespaldolegal ?? null,
      idfuentedeteccion: r.idfuentedeteccion ?? null,
      detallemodificacion: r.detalledemodificacion ?? r.detallemodificacion ?? "",
      confianza: r.confianza ?? 1.0,
      verificada: r.verificada ?? true,
      textoevidencia: r.textoevidencia ?? "",
      fechaefecto: r.fechaefecto ? String(r.fechaefecto).slice(0, 10) : "",
    }));
  }

  const normalizeDate = (value?: string | null): string => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  const documentTypeName =
    typeof detail.tipodocumento === "string"
      ? detail.tipodocumento
      : detail.tipodocumento?.nombre ??
        detail.tipodocumento?.nombretipodocumento ??
        "";

  const documentType = catalogs.tiposDocumento.find(
    (option: { label: string; value: number | string }) =>
      option.label.trim().toLowerCase() ===
      String(documentTypeName).trim().toLowerCase()
  );

  const categoryId =
    editable.idcategoria ??
    detail.categorias?.[0]?.idcategoria ??
    null;

  return {
    iddocumento: String(
      detail.iddocumento ?? editable.iddocumento ?? id
    ),
    numero: detail.numero ?? editable.numero ?? "",
    idtipodocumento:
      editable.idtipodocumento ??
      (documentType ? Number(documentType.value) : null),
    titulo: detail.titulo ?? editable.titulo ?? "",
    nommetadato: detail.nommetadato ?? editable.nommetadato ?? "",
    descripcion: editable.descripcion ?? detail.descripcion ?? "",
    idcategoria: categoryId,
    idtiposesion: editable.idtiposesion ?? null,
    numsesion: detail.numsesion ?? editable.numsesion ?? null,
    numacuerdo: detail.numacuerdo ?? editable.numacuerdo ?? null,
    idtipodecision: editable.idtipodecision ?? null,
    idestadovigencia: editable.idestadovigencia ?? null,
    creacion: normalizeDate(detail.creacion ?? editable.creacion),
    derogacion: normalizeDate(
      editable.derogacion ?? detail.derogacion
    ),
    aplicacioninmediata:
      editable.aplicacioninmediata ??
      detail.aplicacioninmediata ??
      false,
    isactive: editable.isactive ?? detail.isactive ?? true,

    // No se expone la URL de S3 en el editor.
    urlarchivooriginals3: "",

    areasemisoras: editable.areaseemisorasids ?? [],
    niveles: editable.nivelesids ?? [],
    carreras: editable.carrerasids ?? [],
    jornadas: editable.jornadasids ?? [],
    departamentos: editable.departamentosids ?? [],
    sedes: editable.sedesids ?? [],
    roles: editable.rolesids ?? [],
    beneficios: editable.beneficiosids ?? [],
    nombramientos: editable.nombramientosids ?? [],

    relaciones,
  };
};

// ----------------------------------------------------------------
// Guardado del documento editable con diagnóstico de errores
// ----------------------------------------------------------------

export const saveEditableDocument = async (
  id: string,
  data: any,
  initialRelaciones?: any[]
): Promise<any> => {
  // Construir explícitamente el payload para no enviar propiedades
  // adicionales que el esquema de FastAPI podría rechazar.
  const payload = {
    descripcion: data.descripcion ?? "",
    idcategoria: data.idcategoria ?? null,
    idtipodecision: data.idtipodecision ?? null,
    idtiposesion: data.idtiposesion ?? null,
    idestadovigencia: data.idestadovigencia ?? null,
    derogacion: data.derogacion || null,
    aplicacioninmediata: Boolean(data.aplicacioninmediata),
    isactive: Boolean(data.isactive),

    areaseemisorasids: data.areasemisoras ?? [],
    nivelesids: data.niveles ?? [],
    carrerasids: data.carreras ?? [],
    jornadasids: data.jornadas ?? [],
    departamentosids: data.departamentos ?? [],
    sedesids: data.sedes ?? [],
    rolesids: data.roles ?? [],
    beneficiosids: data.beneficios ?? [],
    nombramientosids: data.nombramientos ?? [],
  };

  console.group("GIRU · Diagnóstico de guardado");
  console.log("Documento:", id);
  console.log("Datos originales del editor:", data);
  console.log("Payload enviado a FastAPI:", payload);
  console.groupEnd();

  try {
    const response = await api.put(`/documents/${id}`, payload);

    // Persistencia de relaciones si se incluyeron en el editor
    if (Array.isArray(data.relaciones)) {
      // 1. Eliminar relaciones que estaban en initialRelaciones pero ya no en draft
      if (Array.isArray(initialRelaciones)) {
        const currentRelIds = new Set(
          data.relaciones
            .map((r: any) => r.idrelacion)
            .filter(Boolean)
        );
        for (const initR of initialRelaciones) {
          if (initR.idrelacion && !currentRelIds.has(initR.idrelacion)) {
            try {
              await api.delete("/relaciones/", {
                data: { idrelacion: initR.idrelacion },
              });
            } catch (delErr) {
              console.warn("Error al eliminar relación:", delErr);
            }
          }
        }
      }

      // 2. Guardar o modificar cada relación en data.relaciones
      for (const r of data.relaciones) {
        if (r.iddocumentodestino && r.idtiporelacion) {
          await api.post("/relaciones/", {
            iddocumentoorigen: id,
            iddocumentodestino: r.iddocumentodestino,
            idtiporelacion: r.idtiporelacion,
            detallemodificacion: r.detallemodificacion || null,
            fechaefecto: r.fechaefecto || null,
            verificada: r.verificada ?? true,
            confianza: r.confianza ?? 1.0,
            textoevidencia: r.textoevidencia || null,
            idfuentedeteccion: r.idfuentedeteccion ?? null,
            idrespaldolegal: r.idrespaldolegal ?? null,
            idrelacion: r.idrelacion ?? null,
          });
        }
      }
    }

    console.info("GIRU · Documento guardado correctamente:", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    const response = error?.response;

    console.group("GIRU · Error al guardar documento");
    console.error("Documento:", id);
    console.error("Estado HTTP:", response?.status);
    console.error("Respuesta de FastAPI:", response?.data);
    console.error("Payload enviado:", payload);

    if (Array.isArray(response?.data?.detail)) {
      console.table(
        response.data.detail.map((item: any) => ({
          campo: Array.isArray(item.loc)
            ? item.loc.join(" → ")
            : String(item.loc ?? ""),
          mensaje: item.msg ?? "",
          tipo: item.type ?? "",
          valorRecibido:
            item.input === undefined
              ? ""
              : JSON.stringify(item.input),
        }))
      );
    }

    console.groupEnd();

    throw error;
  }
};

// ----------------------------------------------------------------
// Búsqueda administrativa
// ----------------------------------------------------------------

export const searchDocumentsForAdmin = async (
  query: string
): Promise<any> => {
  const response = await api.post("/search", {
    query,
    filters: {},
    page: 1,
    page_size: 50,
  });

  return response.data.results;
};
