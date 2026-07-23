import { VideoCard } from "./VideoCard";

export type VideoTutorialsProps = {
  onSelectChapter: (seconds: number) => void;
};

const videos = [
  {
    icon: "pi pi-home",
    title: "Introducción al sistema",
    description:
      "Conoce las principales funcionalidades disponibles en GIRU.",
    duration: "00:00",
    seconds: 0,
  },
  {
    icon: "pi pi-search",
    title: "Buscar documentos",
    description:
      "Aprende a encontrar reglamentos, decretos y documentos institucionales.",
    duration: "01:15",
    seconds: 75,
  },
  {
    icon: "pi pi-filter",
    title: "Aplicar filtros",
    description:
      "Descubre cómo utilizar filtros para obtener mejores resultados.",
    duration: "02:40",
    seconds: 160,
  },
  {
    icon: "pi pi-file",
    title: "Visualizar documentos",
    description:
      "Revisa el visor de documentos y sus principales herramientas.",
    duration: "03:30",
    seconds: 210,
  },
  {
    icon: "pi pi-comments",
    title: "Consultar con Don Fede",
    description:
      "Aprende a realizar preguntas sobre reglamentos y normativas.",
    duration: "04:30",
    seconds: 270,
  },
  {
    icon: "pi pi-question-circle",
    title: "Preguntas frecuentes",
    description:
      "Resuelve las dudas más comunes sobre el funcionamiento de GIRU.",
    duration: "06:00",
    seconds: 360,
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