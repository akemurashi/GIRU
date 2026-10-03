// Datos de prueba con la forma del modelo GIRU. Sustituir por llamadas a la API (catálogos + documentos).
import { emptyDocument, type Catalogs, type EditableDocument } from "./types";

const o = (value: number, label: string, extra: { code?: string; parentId?: number } = {}) => ({ value, label, ...extra });

export const mockCatalogs: Catalogs = {
  tiposDocumento: [o(1, "Decreto"), o(2, "Resolución"), o(3, "Reglamento")],
  estadosVigencia: [o(1, "Vigente"), o(2, "Derogado"), o(3, "Modificado")],
  tiposSesion: [o(1, "Ordinaria"), o(2, "Extraordinaria")],
  tiposDecision: [o(1, "Aprobación"), o(2, "Autorización"), o(3, "Toma de conocimiento"), o(4, "Ratificación")],

  macroCategorias: [o(1, "AC – Académica", { code: "AC" }), o(2, "AD – Administrativa", { code: "AD" })],
  categorias: [
    o(1, "10 – Reglamentos", { code: "10", parentId: 1 }),
    o(2, "11 – Planes de estudio", { code: "11", parentId: 1 }),
    o(3, "20 – Finanzas", { code: "20", parentId: 2 }),
  ],

  tiposArea: [o(1, "Docencia"), o(2, "Finanzas")],
  subAreas: [
    o(1, "Dirección de Pregrado (DIRPRE)", { parentId: 1 }),
    o(2, "Dirección de Postgrado (DIRPOS)", { parentId: 1 }),
    o(3, "Dirección de Finanzas (DIRFIN)", { parentId: 2 }),
  ],

  tiposPrograma: [o(1, "Pregrado"), o(2, "Postgrado"), o(3, "Educación Continua")],
  niveles: [
    o(1, "Técnico", { parentId: 1 }),
    o(2, "Ingeniería Civil", { parentId: 1 }),
    o(3, "Magíster", { parentId: 2 }),
    o(4, "Doctorado", { parentId: 2 }),
    o(5, "Diplomado", { parentId: 3 }),
  ],
  carreras: [
    o(1, "ICI – Ingeniería Civil Informática", { parentId: 2 }),
    o(2, "MGI – Magíster en Gestión", { parentId: 3 }),
    o(3, "TNE – Técnico en Enfermería", { parentId: 1 }),
  ],

  jornadas: [o(1, "Diurno"), o(2, "Vespertino"), o(3, "Residencial")],
  departamentos: [o(1, "Informática"), o(2, "Ciencias Básicas")],
  sedes: [o(1, "Campus Central"), o(2, "Campus Norte")],
  roles: [o(1, "Alumno"), o(2, "Académico"), o(3, "Funcionario"), o(4, "Jefe de Carrera")],
  beneficios: [o(1, "Beca de Excelencia"), o(2, "Convenio de Salud")],
  nombramientos: [o(1, "Rector"), o(2, "Decano"), o(3, "Director de Departamento")],

  tiposRelacion: [o(1, "MODIFICA"), o(2, "DEROGA"), o(3, "COMPLEMENTA"), o(4, "REEMPLAZA")],
  fuentesDeteccion: [o(1, "Manual"), o(2, "Automática (Regex)"), o(3, "Nombre de archivo")],
  respaldosLegales: [o(1, "Sesión N° 337 – Acuerdo N° 1493"), o(2, "Sesión N° 337 – Acuerdo N° 1494")],
};

export const mockDocuments: EditableDocument[] = [
  {
    ...emptyDocument(1),
    numero: "REG-2025-001",
    idtipodocumento: 3,
    titulo: "Reglamento General de Estudios",
    nommetadato: "AC-10-001",
    descripcion: "Descripción del reglamento general...",
    cant_paginas: 42,
    idcategoria: 1,
    idtiposesion: 1,
    numsesion: 337,
    idtipodecision: 1,
    numacuerdo: 1493,
    idestadovigencia: 1,
    creacion: "2025-01-15",
    aplicacioninmediata: true,
    urlarchivooriginals3: "s3://giru-docs/reglamentos/reg-2025-001.pdf",
    areasemisoras: [1],
    niveles: [2],
    jornadas: [1, 2],
    roles: [1, 2],
  },
  {
    ...emptyDocument(2),
    numero: "DEC-2024-015",
    idtipodocumento: 1,
    titulo: "Decreto de Evaluación Académica",
    nommetadato: "AC-10-002",
    cant_paginas: 8,
    idcategoria: 1,
    idestadovigencia: 1,
    creacion: "2024-06-03",
    urlarchivooriginals3: "s3://giru-docs/decretos/dec-2024-015.pdf",
    areasemisoras: [1, 2],
  },
];
