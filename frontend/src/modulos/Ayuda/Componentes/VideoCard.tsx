export type VideoCardProps = {
  icon?: string;
  title: string;
  description: string;
  duration: string;
  onClick?: () => void;
};

export const VideoCard = ({
  icon = "pi pi-play-circle",
  title,
  description,
  duration,
  onClick,
}: VideoCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-slate-50
        p-6
        text-center
        transition
        hover:border-sky-900
        hover:shadow-md
      "
    >
      <div
        className="
          mb-4
          flex
          h-32
          w-full
          items-center
          justify-center
          rounded-xl
          bg-slate-200
        "
      >
        <i className={`${icon} text-6xl text-sky-900`} />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mb-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="flex items-center justify-center gap-2 text-sm font-medium text-sky-900">
        <i className="pi pi-play-circle" />
        <span>Comienza en {duration}</span>
      </div>
    </button>
  );
};