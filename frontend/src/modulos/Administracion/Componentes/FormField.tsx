import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

export type FormFieldOption = {
  label: string;
  value: string | number;
};

export type FormFieldGroup = {
  label: string;
  items: FormFieldOption[];
};

export type FormFieldType =
  | "text"
  | "textarea"
  | "url"
  | "date"
  | "boolean"
  | "select"
  | "multiselect"
  | "number";

export type FormFieldValue = string | number | boolean | number[] | null | undefined;

export type FormFieldProps = {
  label: string;
  type: FormFieldType;
  value: FormFieldValue;
  options?: FormFieldOption[];
  /** Opciones agrupadas por padre (solo multiselect). Tiene prioridad sobre `options`. */
  groups?: FormFieldGroup[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  /** Id único del input; obligatorio si el mismo label se repite en la pantalla */
  id?: string;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
  /** Solo type="number" */
  min?: number;
  max?: number;
  fractionDigits?: number;
};

// "2025-01-31" → Date local. new Date("2025-01-31") se interpreta como UTC y en Chile mostraría el día anterior.
const parseISODate = (v: unknown): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v ?? ""));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const FOCUS = "transition focus:border-[#003d7a]! focus:ring-4! focus:ring-[#003d7a]/10! focus:shadow-none!";
const BASE =
  "w-full rounded-xl border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-none placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500";
const SELECT =
  "w-full rounded-xl border-slate-300 bg-white text-sm shadow-none transition [&.p-focus]:border-[#003d7a]! [&.p-focus]:ring-4! [&.p-focus]:ring-[#003d7a]/10! [&.p-focus]:shadow-none!";

export function FormField({
  label,
  type,
  value,
  options = [],
  groups,
  onChange,
  id,
  readOnly = false,
  required = false,
  placeholder,
  helperText,
  error,
  className = "",
  min,
  max,
  fractionDigits = 0,
}: FormFieldProps) {
  const fieldId = id ?? `form-field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const invalid = error ? " p-invalid border-red-400!" : "";
  const inputCls = `${BASE} ${FOCUS}${invalid}`;

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <InputTextarea
            id={fieldId}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder={placeholder}
            rows={4}
            autoResize
            className={inputCls}
          />
        );

      case "url":
        return (
          <InputText
            id={fieldId}
            type="url"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder={placeholder}
            className={inputCls}
          />
        );

      case "number":
        return (
          <InputNumber
            inputId={fieldId}
            value={typeof value === "number" ? value : null}
            onValueChange={(e) => onChange(e.value ?? null)}
            disabled={readOnly}
            placeholder={placeholder}
            useGrouping={false}
            min={min}
            max={max}
            minFractionDigits={fractionDigits}
            maxFractionDigits={fractionDigits}
            className={`w-full${invalid}`}
            inputClassName={inputCls}
          />
        );

      case "date":
        return (
          <Calendar
            inputId={fieldId}
            value={parseISODate(value)}
            onChange={(e) => onChange(e.value instanceof Date ? toISODate(e.value) : "")}
            disabled={readOnly}
            dateFormat="dd/mm/yy"
            showIcon
            placeholder={placeholder ?? "dd/mm/aaaa"}
            className={`w-full${invalid}`}
            inputClassName={inputCls}
          />
        );

      case "boolean":
        return (
          <div className="flex min-h-11 items-center">
            <InputSwitch
              inputId={fieldId}
              checked={Boolean(value)}
              onChange={(e) => onChange(Boolean(e.value))}
              disabled={readOnly}
            />
          </div>
        );

      case "multiselect":
        return (
          <MultiSelect
            inputId={fieldId}
            value={Array.isArray(value) ? value : []}
            options={groups ?? options}
            optionGroupLabel={groups ? "label" : undefined}
            optionGroupChildren={groups ? "items" : undefined}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange(e.value)}
            disabled={readOnly}
            display="chip"
            filter
            showClear={!readOnly}
            placeholder={placeholder ?? "Seleccione una o más opciones"}
            emptyFilterMessage="Sin resultados"
            emptyMessage="Sin opciones disponibles"
            className={`${SELECT}${invalid}`}
            panelClassName="text-sm"
          />
        );

      case "select":
        return (
          <Dropdown
            inputId={fieldId}
            value={typeof value === "number" || typeof value === "string" ? value : null}
            options={options}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange(e.value ?? null)}
            disabled={readOnly}
            filter={options.length > 8}
            showClear={!required && !readOnly}
            placeholder={placeholder ?? "Seleccione una opción"}
            emptyMessage="Sin opciones disponibles"
            emptyFilterMessage="Sin resultados"
            className={`${SELECT}${invalid}`}
            panelClassName="text-sm"
          />
        );

      case "text":
      default:
        return (
          <InputText
            id={fieldId}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder={placeholder}
            className={inputCls}
          />
        );
    }
  };

  if (type === "boolean") {
    return (
      <div className={`flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 ${className}`}>
        <div className="min-w-0">
          <label htmlFor={fieldId} className="cursor-pointer text-sm font-semibold text-slate-700">
            {label}
          </label>
          {helperText && <p className="m-0 mt-0.5 text-xs text-slate-500">{helperText}</p>}
        </div>
        {renderField()}
      </div>
    );
  }

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={fieldId} className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>
      {renderField()}
      {error ? (
        <small className="flex items-center gap-1.5 text-red-600" role="alert">
          <i className="pi pi-exclamation-circle text-xs" />
          {error}
        </small>
      ) : (
        helperText && <small className="text-xs leading-5 text-slate-500">{helperText}</small>
      )}
    </div>
  );
}
