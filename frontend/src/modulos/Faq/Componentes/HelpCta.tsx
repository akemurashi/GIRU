import { Link } from "react-router-dom";

export const HelpCta = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 md:px-8">
      <section className="rounded-xl border border-sky-200 bg-sky-50 p-5 md:p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-900 text-white sm:flex">
            <i className="pi pi-question-circle text-lg" />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              ¿No encuentras lo que buscas?
            </h2>

            <p className="leading-6 text-gray-600">
              Si tu pregunta no está respondida aquí, puedes consultar con Don
              Fede, nuestro asistente de inteligencia artificial, o revisar la
              guía de uso del sistema.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/chat-ia"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-sky-900
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-sky-800
            "
          >
            <i className="pi pi-comments" />
            Consultar con Don Fede
          </Link>

          <Link
            to="/ayuda"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            <i className="pi pi-book" />
            Ver guía de uso
          </Link>
        </div>
      </section>
    </div>
  );
};