import type { ReactNode } from "react";

interface EditorSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function EditorSection({ title, description, icon, children }: EditorSectionProps) {
  return (
    <section className="w-full overflow-clip rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003d7a]/10 text-[#003d7a]">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="m-0 text-base font-semibold text-slate-900">{title}</h2>
            {description && <p className="m-0 mt-0.5 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 gap-x-7 gap-y-6 md:grid-cols-2">{children}</div>
      </div>
    </section>
  );
}
