import { CategoryCard } from "./CategoriaCard";

import reglamentosImg from "/assets/Imagenes/Inicio/Reglamentos.jpg";
import eleccionesImg from "/assets/Imagenes/Inicio/Elecciones.jpg";
import actasImg from "/assets/Imagenes/Inicio/Actas.jpeg";
import decretosImg from "/assets/Imagenes/Inicio/Decretos.jpg";
import conveniosImg from "/assets/Imagenes/Inicio/Convenios.jpg";


const categories = [
  {
    href: "/documentos?tipo=Reglamento",
    imageSrc: reglamentosImg,
    icon: "pi pi-book",
    title: "Reglamentos",
    description:
      "Normativas sobre planes de estudio y reglamentos institucionales.",
  },

  {
    href: "/documentos?tipo=Decreto",
    imageSrc: decretosImg,
    icon: "pi pi-file",
    title: "Decretos",
    description:
      "Derechos, deberes y procedimientos administrativos.",
  },

  {
    href: "/documentos?tipo=Acta",
    imageSrc: actasImg,
    icon: "pi pi-pencil",
    title: "Actas",
    description:
      "Decisiones institucionales y registros oficiales.",
  },

  {
    href: "/documentos?tipo=Eleccion",
    imageSrc: eleccionesImg,
    icon: "pi pi-users",
    title: "Elecciones",
    description:
      "Guías de procedimiento y procesos electorales.",
  },

  {
    href: "/documentos?tipo=Convenio",
    imageSrc: conveniosImg,
    icon: "pi pi-file-edit",
    title: "Convenios",
    description:
      "Convenios institucionales y acuerdos vigentes.",
  },
];


export const QuickAccessSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">

      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Acceso rápido por categoría
      </h2>


      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3">

        {categories.map((category) => (

          <CategoryCard
            key={category.title}
            {...category}
            trailingIcon="pi pi-arrow-right"
          />

        ))}

      </div>

    </section>
  );
};