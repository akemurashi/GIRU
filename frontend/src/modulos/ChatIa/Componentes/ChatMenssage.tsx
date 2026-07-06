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
}: ChatMessageProps) => {
  const isUser = type === "user";

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-2xl items-start gap-3">
          <div className="rounded-2xl bg-sky-900 px-5 py-3 text-sm leading-6 text-white shadow-sm">
            {messageText}
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
            <i className="pi pi-user text-lg"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start">
      <div className="flex w-full max-w-4xl items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-900 text-white shadow-sm">
          <i className="pi pi-book text-lg"></i>
        </div>

        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-900">
              {interpretationTitle}
            </h3>

            <p className="text-sm leading-7 text-gray-700">
              {interpretationText}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-900">
                {sourceTitle}
              </h3>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <i className="pi pi-check-circle"></i>
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

            <button className="inline-flex items-center gap-2 rounded-xl bg-sky-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-800">
              <i className="pi pi-file-pdf"></i>
              {sourceButtonText}
              <i className="pi pi-external-link text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};