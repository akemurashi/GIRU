import { useState } from "react";


const sugerencias = [
  "Reglamento académico",
  "Reglamento del Estudiante de Pregrado",
  "Decretos universitarios",
  "Actas de consejo",
  "Elecciones estudiantiles",
  "Convenios institucionales",
  "Normativa de estudiantes",
];


export const SearchBox = () => {


  const [busqueda, setBusqueda] = useState("");



  const sugerenciasFiltradas = sugerencias.filter((item) =>
    item
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );



  return (

    <div className="relative">


      <i
        className="
          pi pi-search
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-500
        "
      />



      <input

        type="text"

        value={busqueda}

        onChange={(e) => setBusqueda(e.target.value)}

        placeholder="Busca por tema, artículo, palabra clave o haz una pregunta"

        className="
          w-full
          pl-12
          pr-4
          py-4
          text-lg
          rounded-xl
          border
          border-slate-300
          focus:outline-none
          focus:ring-2
          focus:ring-sidebar
          focus:border-sidebar
        "

      />



      {busqueda.length > 0 && sugerenciasFiltradas.length > 0 && (

        <div
          className="
            absolute
            top-full
            left-0
            right-0
            mt-2
            bg-white
            rounded-xl
            shadow-lg
            border
            border-slate-200
            z-50
            overflow-hidden
          "
        >


          {sugerenciasFiltradas.map((sugerencia) => (

            <button

              key={sugerencia}

              onClick={() => setBusqueda(sugerencia)}

              className="
                w-full
                text-left
                px-5
                py-3
                hover:bg-slate-100
                text-slate-700
              "

            >

              <i className="pi pi-search mr-3 text-slate-400" />

              {sugerencia}

            </button>

          ))}


        </div>

      )}


    </div>

  );

};