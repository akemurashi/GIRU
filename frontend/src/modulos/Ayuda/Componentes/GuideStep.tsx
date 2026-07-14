export type GuideStepProps = {
  step: number | string;
  icon: string;
  title: string;
  description: string;
  tips?: string[];
};

export const GuideStep = ({
  step,
  icon,
  title,
  description,
  tips = [],
}: GuideStepProps) => {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-900 text-2xl font-bold text-white">
          {step}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-3">
            <i className={`${icon} text-2xl text-sky-900`} />

            <h3 className="text-xl font-bold text-gray-900">
              {title}
            </h3>
          </div>

          <p className="leading-7 text-gray-600">
            {description}
          </p>

          {tips.length > 0 && (
            <div className="mt-5 rounded-r-xl border-l-4 border-sky-900 bg-sky-50 p-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Consejos útiles:
              </p>

              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={`${step}-${index}`}
                    className="flex items-start gap-2 text-sm leading-5 text-gray-700"
                  >
                    <i className="pi pi-check-circle mt-0.5 shrink-0 text-sky-900" />

                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};