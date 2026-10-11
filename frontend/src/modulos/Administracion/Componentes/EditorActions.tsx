import { Button } from "primereact/button";

interface Props {
  isModified: boolean;
  /** Cantidad de campos modificados (opcional) */
  changeCount?: number;
  onCancel: () => void;
  onSave: () => void;
}

export function EditorActions({
  isModified,
  changeCount,
  onCancel,
  onSave,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      {/* Estado de edición */}
      <div
        className="flex min-w-0 items-center gap-3"
        aria-live="polite"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isModified
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <i
            className={`pi ${
              isModified ? "pi-file-edit" : "pi-check-circle"
            } text-lg`}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <p className="m-0 text-sm font-semibold text-slate-800">
            {isModified ? "Cambios pendientes" : "Todo al día"}
          </p>

          <p className="m-0 mt-1 text-xs leading-5 text-slate-500">
            {isModified
              ? changeCount !== undefined && changeCount > 0
                ? `${changeCount} ${
                    changeCount === 1 ? "campo modificado" : "campos modificados"
                  } sin guardar`
                : "Tienes modificaciones sin guardar"
              : "No hay modificaciones por guardar"}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          onClick={onCancel}
          className="w-full rounded-xl border-slate-200! px-4! py-2.5! text-sm! font-medium! transition-colors hover:bg-slate-50! sm:w-auto"
        />
        <Button
          label="Guardar cambios"
          icon="pi pi-save"
          onClick={onSave}
          disabled={!isModified}
          className="w-full rounded-xl! border-[#1769AA]! bg-[#1769AA]! px-5! py-3! text-sm! font-semibold! text-white! shadow-sm! transition-all duration-200 hover:-translate-y-0.5! hover:border-[#125A94]! hover:bg-[#125A94]! hover:shadow-md! active:translate-y-0! disabled:cursor-not-allowed! disabled:opacity-50! disabled:shadow-none! sm:w-auto"
        />

        
      </div>
    </div>
  );
}
