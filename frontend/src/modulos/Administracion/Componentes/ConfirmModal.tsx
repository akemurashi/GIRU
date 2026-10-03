import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export type DocumentChange = {
  field: string;
  before: string;
  after: string;
};

type ConfirmModalProps = {
  visible: boolean;
  changes: DocumentChange[];
  onHide: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({ visible, changes, onHide, onConfirm }: ConfirmModalProps) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Confirmar cambios"
      modal
      draggable={false}
      className="w-175 max-w-[95vw]"
    >
      <p className="m-0 mb-4 text-sm text-slate-600">
        {changes.length === 0
          ? "No hay cambios para guardar."
          : `Revisa ${changes.length === 1 ? "el cambio" : `los ${changes.length} cambios`} antes de guardar.`}
      </p>

      <div className="flex max-h-90 flex-col gap-2 overflow-y-auto pr-1">
        {changes.map((change, index) => (
          <div key={`${change.field}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="m-0 text-sm font-semibold text-slate-800">{change.field}</p>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-rose-50 p-2.5 text-rose-900">
                <span className="mb-1 block text-xs font-medium text-rose-700">Antes</span>
                <span className="wrap-break-word">{change.before || "—"}</span>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-900">
                <span className="mb-1 block text-xs font-medium text-emerald-700">Después</span>
                <span className="wrap-break-word">{change.after || "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" outlined onClick={onHide} className="rounded-xl" />
        <Button
          label="Confirmar y guardar"
          icon="pi pi-check"
          onClick={onConfirm}
          disabled={changes.length === 0}
          className="rounded-xl border-[#003d7a]! bg-[#003d7a]! hover:bg-[#002f5f]!"
        />
      </div>
    </Dialog>
  );
};
