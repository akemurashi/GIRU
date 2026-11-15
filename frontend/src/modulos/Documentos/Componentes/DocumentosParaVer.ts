export type Documento = {
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
};
export const documentos: Documento[] = [
  {
    id: 1,
    titulo: "Reglamento General UTFSM",
    tipo: "Reglamento",
    estado: "Vigente",
    fecha: "Marzo 2026",
    organismo: "Secretaría General",
    descripcion: "Establece las normas generales de funcionamiento de la Universidad.",
    archivo: "/Pdf/reglamento1.pdf",

    area: "Académica",
    sede: ["Casa Central Valparaíso"],
    departamento: ["Departamento de Informática"],
    carrera: ["Ingeniería en Informática"],
  },

  {
    id: 2,
    titulo: "Reglamento de Estudiantes",
    tipo: "Reglamento",
    estado: "Vigente",
    fecha: "Abril 2025",
    organismo: "Secretaría General",
    descripcion: "Regula los derechos, deberes y normas aplicables a los estudiantes.",
    archivo: "/Pdf/reglamento2.pdf",

    area: "Estudiantil",
    sede: ["Sede Viña del Mar"],
    departamento: ["Departamento de Informática"],
    carrera: ["Ingeniería en Informática"],
  },

  {
    id: 3,
    titulo: "Normativa de Evaluación Académica",
    tipo: "Normativa",
    estado: "Vigente",
    fecha: "Mayo 2024",
    organismo: "Vicerrectoría Académica",
    descripcion: "Establece criterios y procedimientos para la evaluación académica.",
    archivo: "/Pdf/reglamento3.pdf",

    area: "Académica",
    sede: ["Campus San Joaquín"],
    departamento: ["Departamento de Matemática"],
    carrera: ["Ingeniería Civil Matemática"],
  },

  {
    id: 4,
    titulo: "Resolución de Aranceles",
    tipo: "Resolución",
    estado: "Vigente",
    fecha: "Enero 2026",
    organismo: "Vicerrectoría de Administración",
    descripcion: "Establece disposiciones relacionadas con aranceles universitarios.",
    archivo: "/Pdf/reglamento4.pdf",

    area: "Administrativa",
    sede: ["Casa Central Valparaíso"],
    departamento: ["Departamento de Administración"],
    carrera: ["Ingeniería Comercial"],
  },

  {
    id: 5,
    titulo: "Instructivo de Matrícula",
    tipo: "Instructivo",
    estado: "Vigente",
    fecha: "Enero 2025",
    organismo: "Dirección de Estudios",
    descripcion: "Define los procedimientos para realizar el proceso de matrícula.",
    archivo: "/Pdf/reglamento5.pdf",

    area: "Estudiantil",
    sede: ["Sede Viña del Mar"],
    departamento: ["Departamento de Administración"],
    carrera: ["Ingeniería Civil"],
  },

  {
    id: 6,
    titulo: "Reglamento de Biblioteca",
    tipo: "Reglamento",
    estado: "Reemplazado",
    fecha: "Agosto 2022",
    organismo: "Dirección de Biblioteca",
    descripcion: "Regula el uso de los servicios y recursos bibliográficos.",
    archivo: "/Pdf/reglamento6.pdf",

    area: "Administrativa",
    sede: ["Casa Central Valparaíso"],
    departamento: ["Departamento de Informática"],
    carrera: ["Ingeniería en Informática"],
  },

  {
    id: 7,
    titulo: "Normativa de Convivencia Universitaria",
    tipo: "Normativa",
    estado: "Derogado",
    fecha: "Junio 2020",
    organismo: "Secretaría General",
    descripcion: "Establece normas de convivencia y comportamiento universitario.",
    archivo: "/Pdf/reglamento7.pdf",

    area: "Disciplinaria",
    sede: ["Campus Vitacura"],
    departamento: ["Departamento de Electrónica"],
    carrera: ["Ingeniería Civil Electrónica"],
  },

  {
    id: 8,
    titulo: "Resolución de Actividades Académicas",
    tipo: "Resolución",
    estado: "Complementario",
    fecha: "Septiembre 2023",
    organismo: "Vicerrectoría Académica",
    descripcion: "Establece disposiciones complementarias para actividades académicas.",
    archivo: "/Pdf/reglamento8.pdf",

    area: "Académica",
    sede: ["Campus San Joaquín"],
    departamento: ["Departamento de Mecánica"],
    carrera: ["Ingeniería Civil Mecánica"],
  },

  {
    id: 9,
    titulo: "Reglamento de Prácticas Profesionales",
    tipo: "Reglamento",
    estado: "Vigente",
    fecha: "Julio 2024",
    organismo: "Vicerrectoría Académica",
    descripcion: "Regula las prácticas profesionales de los estudiantes.",
    archivo: "/Pdf/reglamento9.pdf",

    area: "Académica",
    sede: ["Sede Concepción"],
    departamento: ["Departamento de Industrias"],
    carrera: ["Ingeniería Civil Industrial"],
  },

  {
    id: 10,
    titulo: "Instructivo de Titulación",
    tipo: "Instructivo",
    estado: "Vigente",
    fecha: "Febrero 2026",
    organismo: "Dirección de Estudios",
    descripcion: "Define los procedimientos asociados al proceso de titulación.",
    archivo: "/Pdf/reglamento10.pdf",

    area: "Académica",
    sede: ["Sede Viña del Mar"],
    departamento: ["Departamento de Informática"],
    carrera: ["Ingeniería en Informática"],
  },

  {
    id: 11,
    titulo: "Reglamento de Postgrado",
    tipo: "Reglamento",
    estado: "Vigente",
    fecha: "Noviembre 2021",
    organismo: "Dirección de Postgrado",
    descripcion: "Establece las normas para los programas de postgrado.",
    archivo: "/Pdf/reglamento11.pdf",

    area: "Académica",
    sede: ["Casa Central Valparaíso"],
    departamento: ["Departamento de Obras Civiles"],
    carrera: ["Ingeniería Civil"],
  },

  {
    id: 12,
    titulo: "Normativa de Elecciones Universitarias",
    tipo: "Normativa",
    estado: "Reemplazado",
    fecha: "Marzo 2019",
    organismo: "Secretaría General",
    descripcion: "Regula los procesos de elecciones y representación universitaria.",
    archivo: "/Pdf/reglamento12.pdf",

    area: "Estudiantil",
    sede: ["Campus San Joaquín"],
    departamento: ["Departamento de Electrónica"],
    carrera: ["Ingeniería Civil Electrónica"],
  },

  {
    id: 13,
    titulo: "Resolución Administrativa",
    tipo: "Resolución",
    estado: "Vigente",
    fecha: "Octubre 2018",
    organismo: "Vicerrectoría de Administración",
    descripcion: "Establece disposiciones administrativas de la Universidad.",
    archivo: "/Pdf/reglamento13.pdf",

    area: "Administrativa",
    sede: ["Campus Vitacura"],
    departamento: ["Departamento de Administración"],
    carrera: ["Ingeniería Comercial"],
  },

  {
    id: 14,
    titulo: "Reglamento Disciplinario",
    tipo: "Reglamento",
    estado: "Derogado",
    fecha: "Mayo 2017",
    organismo: "Secretaría General",
    descripcion: "Define faltas disciplinarias y procedimientos de sanción.",
    archivo: "/Pdf/reglamento14.pdf",

    area: "Disciplinaria",
    sede: ["Casa Central Valparaíso"],
    departamento: ["Departamento de Informática"],
    carrera: ["Ingeniería en Informática"],
  },

  {
    id: 15,
    titulo: "Instructivo de Laboratorios",
    tipo: "Instructivo",
    estado: "Vigente",
    fecha: "Abril 2023",
    organismo: "Vicerrectoría Académica",
    descripcion: "Establece normas para el uso de laboratorios universitarios.",
    archivo: "/Pdf/reglamento15.pdf",

    area: "Académica",
    sede: ["Sede Concepción"],
    departamento: ["Departamento de Química y Medio Ambiente"],
    carrera: ["Ingeniería Civil Química"],
  },
];