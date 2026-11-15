export type PracticeCardProps = {
  icon: string;
  title: string;
  description: string;
};

export const PracticeCard = ({
  icon,
  title,
  description,
}: PracticeCardProps) => {
  return (
    <article className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 transition hover:border-sky-200 hover:shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100">
        <i className={`${icon} text-xl text-sky-900`} />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </article>
  );
};