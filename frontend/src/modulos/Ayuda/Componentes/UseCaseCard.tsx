export type UseCaseCardProps = {
  title: string;
  situation: string;
  solution: string;
};

export const UseCaseCard = ({
  title,
  situation,
  solution,
}: UseCaseCardProps) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <i className="pi pi-exclamation-circle text-sky-900" />

            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Situación
            </h4>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {situation}
          </p>
        </div>

        <div className="rounded-lg bg-sky-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <i className="pi pi-lightbulb text-sky-900" />

            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
              Solución recomendada
            </h4>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {solution}
          </p>
        </div>
      </div>
    </article>
  );
};