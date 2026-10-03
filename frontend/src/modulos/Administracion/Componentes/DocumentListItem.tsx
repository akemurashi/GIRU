export type DocumentListItemProps = {
  documentCode: string;
  documentType: string;
  validity: string;
  title: string;
  active?: boolean;
  onClick?: () => void;
};

// El color de la vigencia comunica el estado de un vistazo
const validityStyle = (validity: string) => {
  switch (validity.trim().toLowerCase()) {
    case "vigente":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "derogado":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "modificado":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    default:
      return "bg-blue-50 text-blue-700 ring-blue-200";
  }
};

export const DocumentListItem = ({
  documentCode,
  documentType,
  validity,
  title,
  active = false,
  onClick,
}: DocumentListItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group mb-2 flex min-h-23.5 w-full cursor-pointer items-center gap-5 rounded-2xl border px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#003d7a]/20 sm:px-6 ${
        active
          ? "border-[#003d7a] bg-blue-50/60 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
          active
            ? "bg-[#003d7a] text-white"
            : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
        }`}
      >
        <i className="pi pi-file text-xl" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{documentCode}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {documentType}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${validityStyle(validity)}`}
          >
            {validity}
          </span>
        </div>
        <p className="m-0 truncate text-base font-medium text-slate-900">{title}</p>
      </div>

      <i
        className={`pi pi-chevron-right shrink-0 text-xs transition ${
          active ? "text-[#003d7a]" : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500"
        }`}
      />
    </button>
  );
};
