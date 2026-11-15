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

export type FormFieldValue =
  | string
  | number
  | boolean
  | number[]
  | null
  | undefined;

export type FormFieldProps = {
  label: string;
  type: FormFieldType;
  value: FormFieldValue;
  options?: FormFieldOption[];
  groups?: FormFieldGroup[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  id?: string;
  readOnly?: boolean;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
  min?: number;
  max?: number;
  fractionDigits?: number;
};

// Convierte "2025-01-31" a una fecha local para evitar desfases de zona horaria.
const parseISODate = (value: unknown): Date | null => {
  const strValue = typeof value === "string" ? value : "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(strValue);

  if (!match) return null;

  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
};

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;

const FOCUS =
  "transition focus:border-[#003d7a]! focus:ring-4! focus:ring-[#003d7a]/10! focus:shadow-none!";

const BASE =
  "w-full rounded-xl border-slate-300 bg-white p-3 text-sm text-slate-800 shadow-none placeholder:text-slate-400 disabled:bg-slate-100 disabled:text-slate-500";

const SELECT =
  "w-full rounded-xl border-slate-300 bg-white text-sm shadow-none transition [&.p-focus]:border-[#003d7a]! [&.p-focus]:ring-4! [&.p-focus]:ring-[#003d7a]/10! [&.p-focus]:shadow-none!";

const PANEL_CLASS =
  "giru-dropdown-panel !z-[9999] !border !border-slate-200 !bg-white !opacity-100 !shadow-xl !rounded-xl overflow-hidden text-sm";

const getPortalTarget = () =>
  typeof document !== "undefined" ? document.body : undefined;

const dropdownItemTemplate = (option: FormFieldOption) => (
  <div className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2">
    <span>{option.label}</span>
  </div>
);

type InternalInputProps = Readonly<{
  fieldId: string;
  type: FormFieldType;
  value: FormFieldValue;
  options: FormFieldOption[];
  groups?: FormFieldGroup[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  readOnly: boolean;
  required: boolean;
  placeholder?: string;
  invalid: string;
  inputCls: string;
  min?: number;
  max?: number;
  fractionDigits: number;
}>;

const renderMultiSelectInput = (props: InternalInputProps) => (
  <MultiSelect
    inputId={props.fieldId}
    value={Array.isArray(props.value) ? props.value : []}
    options={props.groups ?? props.options}
    optionGroupLabel={props.groups ? "label" : undefined}
    optionGroupChildren={props.groups ? "items" : undefined}
    optionLabel="label"
    optionValue="value"
    onChange={(event) => props.onChange(event.value)}
    disabled={props.readOnly}
    display="chip"
    filter
    showClear={!props.readOnly}
    placeholder={props.placeholder ?? "Seleccione una o más opciones"}
    emptyFilterMessage="Sin resultados"
    emptyMessage="Sin opciones disponibles"
    className={`${SELECT}${props.invalid}`}
    panelClassName={PANEL_CLASS}
    appendTo={getPortalTarget()}
  />
);

const renderSelectInput = (props: InternalInputProps) => {
  const normalizedVal =
    typeof props.value === "number" || typeof props.value === "string"
      ? props.value
      : null;

  return (
    <Dropdown
      inputId={props.fieldId}
      value={normalizedVal}
      options={props.options}
      optionLabel="label"
      optionValue="value"
      onChange={(event) => props.onChange(event.value ?? null)}
      disabled={props.readOnly}
      filter={props.options.length > 8}
      showClear={!props.required && !props.readOnly}
      placeholder={props.placeholder ?? "Seleccione una opción"}
      emptyMessage="Sin opciones disponibles"
      emptyFilterMessage="Sin resultados"
      className={`${SELECT}${props.invalid}`}
      panelClassName={PANEL_CLASS}
      appendTo={getPortalTarget()}
      itemTemplate={dropdownItemTemplate}
    />
  );
};

const renderDateInput = (props: InternalInputProps) => (
  <Calendar
    inputId={props.fieldId}
    value={parseISODate(props.value)}
    onChange={(event) =>
      props.onChange(
        event.value instanceof Date ? toISODate(event.value) : ""
      )
    }
    disabled={props.readOnly}
    dateFormat="dd/mm/yy"
    showIcon
    placeholder={props.placeholder ?? "dd/mm/aaaa"}
    className={`w-full giru-calendar${props.invalid}`}
    inputClassName={props.inputCls}
    panelClassName="giru-calendar-panel"
    appendTo={getPortalTarget()}
    showButtonBar
  />
);

const renderControlByType = (props: InternalInputProps) => {
  const stringVal = typeof props.value === "string" ? props.value : "";

  switch (props.type) {
    case "textarea":
      return (
        <InputTextarea
          id={props.fieldId}
          value={stringVal}
          onChange={(event) => props.onChange(event.target.value)}
          disabled={props.readOnly}
          placeholder={props.placeholder}
          rows={4}
          autoResize
          className={props.inputCls}
        />
      );

    case "url":
      return (
        <InputText
          id={props.fieldId}
          type="url"
          value={stringVal}
          onChange={(event) => props.onChange(event.target.value)}
          disabled={props.readOnly}
          placeholder={props.placeholder}
          className={props.inputCls}
        />
      );

    case "number":
      return (
        <InputNumber
          inputId={props.fieldId}
          value={typeof props.value === "number" ? props.value : null}
          onValueChange={(event) => props.onChange(event.value ?? null)}
          disabled={props.readOnly}
          placeholder={props.placeholder}
          useGrouping={false}
          min={props.min}
          max={props.max}
          minFractionDigits={props.fractionDigits}
          maxFractionDigits={props.fractionDigits}
          className={`w-full${props.invalid}`}
          inputClassName={props.inputCls}
        />
      );

    case "date":
      return renderDateInput(props);

    case "boolean":
      return (
        <div className="flex min-h-11 items-center">
          <InputSwitch
            inputId={props.fieldId}
            checked={Boolean(props.value)}
            onChange={(event) => props.onChange(Boolean(event.value))}
            disabled={props.readOnly}
          />
        </div>
      );

    case "multiselect":
      return renderMultiSelectInput(props);

    case "select":
      return renderSelectInput(props);

    case "text":
    default:
      return (
        <InputText
          id={props.fieldId}
          value={stringVal}
          onChange={(event) => props.onChange(event.target.value)}
          disabled={props.readOnly}
          placeholder={props.placeholder}
          className={props.inputCls}
        />
      );
  }
};

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
}: Readonly<FormFieldProps>) {
  const fieldId =
    id ?? `form-field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const invalid = error ? " p-invalid border-red-400!" : "";
  const inputCls = `${BASE} ${FOCUS}${invalid}`;

  const control = renderControlByType({
    fieldId,
    type,
    value,
    options,
    groups,
    onChange,
    readOnly,
    required,
    placeholder,
    invalid,
    inputCls,
    min,
    max,
    fractionDigits,
  });

  if (type === "boolean") {
    return (
      <div
        className={`flex min-w-0 items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 ${className}`}
      >
        <div className="min-w-0">
          <label
            htmlFor={fieldId}
            className="cursor-pointer text-sm font-semibold text-slate-700"
          >
            {label}
          </label>

          {helperText && (
            <p className="m-0 mt-0.5 text-xs text-slate-500">
              {helperText}
            </p>
          )}
        </div>

        {control}
      </div>
    );
  }

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label
        htmlFor={fieldId}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {control}

      {error ? (
        <small
          className="flex items-center gap-1.5 text-red-600"
          role="alert"
        >
          <i className="pi pi-exclamation-circle text-xs" />
          <span>{error}</span>
        </small>
      ) : (
        helperText && (
          <small className="text-xs leading-5 text-slate-500">
            {helperText}
          </small>
        )
      )}
    </div>
  );
}
