import { Button } from "primereact/button";

interface Props {
  isModified: boolean;
  /** Cantidad de campos modificados (opcional) */
  changeCount?: number;
  onCancel: () => void;
  onSave: () => void;
}

export function EditorActions({ isModified, changeCount, onCancel, onSave }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="m-0 flex items-center gap-2 text-sm text-slate-500" aria-live="polite">
        {isModified ? (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {changeCount
              ? `${changeCount} ${changeCount === 1 ? "cambio" : "cambios"} sin guardar`
              : "Cambios sin guardar"}
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            Sin cambios
          </>
        )}
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          outlined
          onClick={onCancel}
          className="w-full rounded-xl sm:w-auto"
        />
        <Button
          label="Guardar cambios"
          icon="pi pi-save"
          onClick={onSave}
          disabled={!isModified}
          className="w-full rounded-xl border-[#003d7a]! bg-[#003d7a]! hover:bg-[#002f5f]! sm:w-auto"
        />
      </div>
    </div>
  );
}
