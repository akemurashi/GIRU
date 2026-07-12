export type FaqItemProps = {
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export const FaqItem = ({
  category,
  question,
  answer,
  isOpen,
  onToggle,
}: FaqItemProps) => {
  return (
    <article
      className={`
        overflow-hidden
        rounded-xl
        border
        bg-white
        transition
        ${
          isOpen
            ? "border-sky-900 shadow-sm"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          p-5
          text-left
          transition
          hover:bg-gray-50
        "
      >
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-900">
            {category}
          </p>

          <p className="font-semibold text-gray-900">
            {question}
          </p>
        </div>

        <i
          className={`
            pi
            pi-chevron-down
            shrink-0
            text-gray-500
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          grid
          transition-all
          duration-300
          ${
            isOpen
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="leading-7 text-gray-600">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};