import { VideoCard } from "./VideoCard";

export type VideoTutorialsProps = {
  onSelectChapter: (seconds: number) => void;
};

const videos = [
  {
    icon: "pi pi-home",
    title: "Inicio de la web",
    description:
      "Conoce cómo usar la pantalla de inicio, el buscador principal y el acceso rápido por categorías.",
    duration: "00:00",
    seconds: 0,
  },
  {
    icon: "pi pi-search",
    title: "Buscar documentos",
    description:
      "Aprende a buscar normativa por tema o mediante búsqueda léxica directa con # y autocompletado.",
    duration: "00:35",
    seconds: 35,
  },
  {
    icon: "pi pi-filter",
    title: "Aplicar filtros",
    description:
      "Descubre cómo acotar resultados por tipo, estado de vigencia, año, área, sede, departamento o carrera.",
    duration: "01:20",
    seconds: 80,
  },
  {
    icon: "pi pi-eye",
    title: "Ver documentos",
    description:
      "Revisa cómo abrir, recorrer y descargar los PDFs oficiales en el visor integrado.",
    duration: "01:54",
    seconds: 114,
  },
  {
    icon: "pi pi-share-alt",
    title: "Relaciones de documentos",
    description:
      "Explora la línea de tiempo normativa (hitos anteriores, documento actual y modificaciones posteriores).",
    duration: "02:13",
    seconds: 133,
  },
  {
    icon: "pi pi-comments",
    title: "Don Fede (Chatbot IA)",
    description:
      "Aprende a realizar consultas en lenguaje natural, usar sugerencias y verificar las fuentes citadas.",
    duration: "02:33",
    seconds: 153,
  },
];

export const VideoTutorials = ({
  onSelectChapter,
}: VideoTutorialsProps) => {
  return (
    <section className="mt-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Accesos rápidos al tutorial
        </h2>

        <p className="mt-2 text-slate-600">
          Selecciona una sección para comenzar el video desde ese punto.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard
            key={video.title}
            icon={video.icon}
            title={video.title}
            description={video.description}
            duration={video.duration}
            onClick={() => onSelectChapter(video.seconds)}
          />
        ))}
      </div>
    </section>
  );
};