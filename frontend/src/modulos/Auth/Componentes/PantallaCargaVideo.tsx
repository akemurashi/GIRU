
interface PantallaCargaVideoProps {
  mensaje: string;
  subtitulo?: string;
}

export default function PantallaCargaVideo({
  mensaje,
  subtitulo = "Esto puede tardar unos segundos.",
}: PantallaCargaVideoProps) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Video integrado directamente en la página */}
      <video
        className="mb-5 block h-auto w-full max-w-xs object-contain sm:max-w-sm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/giruLupa.webm" type="video/webm" />
      </video>

      {/* Mensaje de carga */}
      <h1 className="text-xl font-semibold text-gray-800 sm:text-2xl">
        {mensaje}
      </h1>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {subtitulo}
      </p>

      {/* Indicador de progreso */}
      <div className="mt-6 h-1 w-28 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/2 animate-[loading-bar_1.5s_ease-in-out_infinite] rounded-full bg-blue-600" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-110%);
          }
          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </main>
  );
}
