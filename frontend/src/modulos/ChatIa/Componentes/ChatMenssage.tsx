import { useEffect, useRef } from "react";
import type { SourceItem } from "../types";

export type { SourceItem };

export type ChatMessageProps = {
  type: "user" | "assistant";
  messageText?: string;
  interpretationTitle?: string;
  interpretationText?: string;
  sourceTitle?: string;
  sourceStatus?: string;
  sourceDocumentTitle?: string;
  sourceDocumentMeta?: string;
  sourceDocumentUpdated?: string;
  sourceQuote?: string;
  sourceButtonText?: string;
  sourceDocumentOriginalTitle?: string;
  isStreaming?: boolean;
  streamingStatus?: string;
  sources?: SourceItem[];
  onViewDocument?: (documentTitle: string) => void;
};

export const ChatMessage = ({
  type,
  messageText,
  interpretationTitle,
  interpretationText,
  sourceTitle,
  sourceStatus,
  sourceDocumentTitle,
  sourceDocumentMeta,
  sourceDocumentUpdated,
  sourceQuote,
  sourceButtonText,
  sourceDocumentOriginalTitle,
  isStreaming,
  streamingStatus,
  sources,
  onViewDocument,
}: ChatMessageProps) => {
  const isUser = type === "user";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, [isStreaming]);

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-[90%] items-start gap-2.5 sm:max-w-2xl sm:gap-3">
          <div className="min-w-0 break-words rounded-2xl bg-sky-900 px-4 py-2.5 text-sm leading-6 text-white shadow-sm sm:px-5 sm:py-3">
            {messageText}
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 sm:h-10 sm:w-10">
            <i className="pi pi-user text-sm sm:text-lg" />
          </div>
        </div>
      </div>
    );
  }

  const isVerifiedQuote = Boolean(sourceQuote);

  return (
    <div className="flex w-full justify-start">
      <div className="flex w-full max-w-4xl flex-col items-start gap-2.5 sm:flex-row sm:gap-4">
        {/* Avatar: compacto y apilado en móvil; lateral en pantallas mayores */}
        <div className="flex items-center gap-2.5 sm:block">
          <div
            className={`shrink-0 overflow-hidden rounded-full bg-white ${
              isStreaming
                ? "h-20 w-20 sm:h-42 sm:w-42"
                : "h-12 w-12 sm:h-24 sm:w-24"
            }`}
          >
            {isStreaming ? (
              <video
                ref={videoRef}
                key="don-fede-thinking"
                src="/assets/Pensando.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full scale-[1.5] translate-y-1 object-contain sm:translate-y-2"
                aria-label="Don Fede está generando una respuesta"
              />
            ) : (
              <img
                src="/assets/Don fede2.svg"
                alt="Don Fede"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <span className="text-xs font-semibold text-gray-700 sm:hidden">
            Don Fede
          </span>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-3 sm:space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-900 sm:mb-3 sm:text-sm">
              {interpretationTitle}
            </h3>

            <p className="whitespace-pre-line break-words text-sm leading-6 text-gray-700 sm:leading-7">
              {isStreaming ? (
                interpretationText ? (
                  <>
                    {interpretationText}
                    <span
                      className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-sky-900 align-middle"
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <span
                    className="inline-flex items-center gap-2"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="animate-pulse">
                      {streamingStatus ||
                        "Analizando documentos y generando respuesta..."}
                    </span>
                    <i className="pi pi-spinner pi-spin shrink-0" />
                  </span>
                )
              ) : (
                interpretationText || (
                  <span className="italic text-gray-400">
                    Esperando respuesta...
                  </span>
                )
              )}
            </p>
          </div>

          {!isStreaming && interpretationText && sourceDocumentTitle && (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-5 sm:flex-nowrap sm:items-start sm:gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-sky-900 sm:text-sm">
                  {sourceTitle || (isVerifiedQuote ? "Fuente oficial" : "Documento relacionado")}
                </h3>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:px-3 sm:py-1 sm:text-xs ${
                    isVerifiedQuote
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <i className={`pi ${isVerifiedQuote ? "pi-check-circle" : "pi-info-circle"}`} />
                  {sourceStatus || (isVerifiedQuote ? "Cita verificada" : "Documento relacionado")}
                </span>
              </div>

              <div className="mb-4">
                <p className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                  {sourceDocumentTitle}
                </p>

                {sourceDocumentMeta ? (
                  <p className="mt-1 break-words text-xs text-gray-500 sm:text-sm">
                    {sourceDocumentMeta}
                  </p>
                ) : null}

                {sourceDocumentUpdated ? (
                  <p className="mt-1 text-xs text-gray-400">
                    {sourceDocumentUpdated}
                  </p>
                ) : null}
              </div>

              {/* Solo mostrar el bloque de cita si existe un fragmento verificado */}
              {isVerifiedQuote && (
                <div className="mb-4 rounded-r-xl border-l-4 border-sky-900 bg-sky-50 p-3 sm:mb-5 sm:p-4">
                  <p className="break-words text-xs italic leading-5 text-gray-700 sm:text-sm sm:leading-6">
                    “{sourceQuote}”
                  </p>
                </div>
              )}

              <button
                onClick={() =>
                  sourceDocumentOriginalTitle &&
                  onViewDocument?.(sourceDocumentOriginalTitle)
                }
                disabled={!sourceDocumentOriginalTitle}
                className="
                  inline-flex w-full items-center justify-center gap-2 rounded-xl
                  bg-sky-900 px-4 py-2.5 text-sm font-medium
                  text-white transition hover:bg-sky-800
                  disabled:cursor-not-allowed disabled:opacity-50
                  sm:w-auto sm:justify-start
                "
              >
                <i className="pi pi-file-pdf" />
                {sourceButtonText || "Ver documento completo"}
                <i className="pi pi-external-link text-xs" />
              </button>

              {/* Fuentes adicionales (hasta las 3 mejores fuentes) */}
              {sources && sources.length > 1 && (
                <div className="mt-4 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Otras fuentes consultadas:
                  </p>
                  <div className="space-y-2">
                    {sources.slice(1, 3).map((s, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-700 transition hover:border-gray-200 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3.5"
                      >
                        <div className="flex min-w-0 items-start gap-2 sm:items-center">
                          <i className="pi pi-file mt-0.5 shrink-0 text-sky-900 sm:mt-0" />
                          <span
                            className="line-clamp-2 break-words font-medium text-gray-900 sm:truncate"
                            title={s.tituloLimpio}
                          >
                            {s.tituloLimpio}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pl-5 sm:shrink-0 sm:justify-end sm:pl-0">
                          {s.fragmento ? (
                            <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                              Cita verificada
                            </span>
                          ) : (
                            <span className="sm:hidden" />
                          )}
                          <button
                            onClick={() => onViewDocument?.(s.documento)}
                            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-sky-900 hover:text-sky-700 hover:underline"
                          >
                            <span>Ver PDF</span>
                            <i className="pi pi-external-link text-[10px]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
