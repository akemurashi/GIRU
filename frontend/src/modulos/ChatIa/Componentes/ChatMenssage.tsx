import { useEffect, useRef } from "react";

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
        <div className="flex max-w-2xl items-start gap-3">
          <div className="rounded-2xl bg-sky-900 px-5 py-3 text-sm leading-6 text-white shadow-sm">
            {messageText}
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
            <i className="pi pi-user text-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start">
      <div className="flex w-full max-w-4xl items-start gap-4">
        {/* Avatar: video ampliado durante la espera y SVG en estado normal */}
        <div
          className={`shrink-0 overflow-hidden rounded-full bg-white ${
            isStreaming ? "h-42 w-42" : "h-24 w-24"
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
              className="h-full w-full scale-[1.5] translate-y-2 object-contain"
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

        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-900">
              {interpretationTitle}
            </h3>

            <p className="text-sm leading-7 text-gray-700">
              {isStreaming ? (
                <span
                  className="inline-flex items-center gap-2"
                  role="status"
                  aria-live="polite"
                >
                  <span className="animate-pulse">
                    Analizando documentos y generando respuesta...
                  </span>
                  <i className="pi pi-spinner pi-spin" />
                </span>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-900">
                  {sourceTitle}
                </h3>

                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <i className="pi pi-check-circle" />
                  {sourceStatus}
                </span>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-900">
                  {sourceDocumentTitle}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {sourceDocumentMeta}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {sourceDocumentUpdated}
                </p>
              </div>

              <div className="mb-5 rounded-r-xl border-l-4 border-sky-900 bg-sky-50 p-4">
                <p className="text-sm italic leading-6 text-gray-700">
                  {sourceQuote}
                </p>
              </div>

              <button
                onClick={() =>
                  sourceDocumentOriginalTitle &&
                  onViewDocument?.(sourceDocumentOriginalTitle)
                }
                disabled={!sourceDocumentOriginalTitle}
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-sky-900 px-4 py-2.5 text-sm font-medium
                  text-white transition hover:bg-sky-800
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <i className="pi pi-file-pdf" />
                {sourceButtonText}
                <i className="pi pi-external-link text-xs" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
