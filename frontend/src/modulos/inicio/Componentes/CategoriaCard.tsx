import { Link } from "react-router-dom";

export type CategoryCardProps = {
  href: string;
  icon: string;
  imageSrc: string;
  title: string;
  description: string;
  trailingIcon?: string;
};

export const CategoryCard = ({
  href,
  icon,
  imageSrc,
  title,
  description,
  trailingIcon = "pi pi-arrow-right",
}: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className="
        overflow-hidden 
        rounded-xl 
        border 
        border-gray-200 
        bg-white 
        transition-all 
        hover:-translate-y-1 
        hover:shadow-lg
      "
    >

      {/* Imagen principal */}
      <img
        src={imageSrc}
        alt={title}
        className="h-48 w-full object-cover"
      />


      {/* Contenido */}
      <div className="flex items-start gap-4 p-6">


        {/* Icono PrimeReact */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <i 
            className={`${icon} text-xl text-slate-700`}
          />
        </div>


        {/* Texto */}
        <div className="flex-1">

          <h3 className="mb-1 text-lg font-semibold text-slate-900">
            {title}
          </h3>

          <p className="text-sm text-slate-600">
            {description}
          </p>

        </div>


        {/* Icono derecha */}
        <i
          className={`${trailingIcon} mt-2 text-lg text-slate-500`}
        />


      </div>

    </Link>
  );
};