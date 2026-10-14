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

export const ConfirmModal = ({
  visible,
  changes,
  onHide,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      draggable={false}
      closable={false}
      dismissableMask
      blockScroll
      className="mx-3 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      contentClassName="!bg-white !p-0"
      headerClassName="!hidden"
      maskClassName="!bg-black/75"
    >
      <div className="overflow-hidden rounded-2xl bg-white">
        {/* Cabecera */}
        <div className="flex items-center gap-4 border-b border-[#c5d9ef] bg-linear-to-r from-[#dceafa] via-[#e8f0fa] to-[#f0f5fb] px-5 py-5 sm:px-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#c5d9ef] bg-white text-[#1769AA] shadow-sm">
            <i className="pi pi-file-edit text-xl" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-lg font-bold text-[#173b60]">
              Confirmar cambios
            </h2>
            <p className="m-0 mt-1 text-sm leading-5 text-slate-600">
              Revisa las modificaciones realizadas antes de guardarlas.
            </p>
          </div>

          <button
            type="button"
            onClick={onHide}
            aria-label="Cerrar ventana"
            title="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <i className="pi pi-times text-lg" />
          </button>
        </div>

        {/* Resumen de cambios */}
        <div className="bg-white px-5 pt-5 sm:px-7">
          <div className="flex items-center gap-3 rounded-xl border border-[#cbdced] bg-[#edf3f9] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d5e2f0] bg-white text-[#1769AA]">
              <i className="pi pi-list text-base" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm font-semibold text-[#234565]">
                {changes.length === 0
                  ? "Sin modificaciones"
                  : `${changes.length} ${
                      changes.length === 1
                        ? "campo modificado"
                        : "campos modificados"
                    }`}
              </p>
              <p className="m-0 mt-0.5 text-xs leading-5 text-slate-600">
                {changes.length === 0
                  ? "No hay cambios pendientes para guardar."
                  : "Compara los valores originales con los nuevos valores."}
              </p>
            </div>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#c5d9ef] bg-white px-2 text-sm font-bold tabular-nums text-[#1769AA]">
              {changes.length}
            </span>
          </div>
        </div>

        {/* Lista de cambios */}
        <div className="max-h-[min(55vh,460px)] overflow-y-auto bg-white px-5 py-4 sm:px-7">
          {changes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <i className="pi pi-check-circle text-2xl" />
              </div>

              <p className="m-0 text-sm font-semibold text-slate-700">
                Todo está al día
              </p>
              <p className="m-0 mt-1 max-w-sm text-sm leading-5 text-slate-500">
                Modifica algún campo del documento para revisar los cambios aquí.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {changes.map((change, index) => (
                <div
                  key={`${change.field}-${index}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Nombre del campo */}
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1769AA]/10 text-[#1769AA]">
                      <i className="pi pi-pencil text-xs" />
                    </div>

                    <p className="m-0 min-w-0 flex-1 wrap-break-word text-sm font-semibold text-slate-800">
                      {change.field}
                    </p>

                    <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      Cambio {index + 1}
                    </span>
                  </div>

                  {/* Comparación antes y después */}
                  <div className="grid grid-cols-1 gap-3 bg-white p-3 sm:grid-cols-2 sm:p-4">
                    <div className="min-w-0 rounded-lg border border-rose-200 bg-rose-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <i className="pi pi-minus-circle text-sm text-rose-600" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                          Antes
                        </span>
                      </div>

                      <p className="m-0 whitespace-pre-wrap wrap-break-word text-sm leading-5 text-rose-950">
                        {change.before || "—"}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <i className="pi pi-check-circle text-sm text-emerald-600" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          Después
                        </span>
                      </div>

                      <p className="m-0 whitespace-pre-wrap wrap-break-word text-sm leading-5 text-emerald-950">
                        {change.after || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={onHide}
            className="rounded-xl! border-red-600! bg-red-600! px-4! py-2.5! text-white! hover:border-red-700! hover:bg-red-700! focus-visible:ring-2! focus-visible:ring-red-400!"
          />

          <Button
            label="Confirmar y guardar"
            icon="pi pi-check"
            onClick={onConfirm}
            disabled={changes.length === 0}
            className="rounded-xl! border-sidebar! bg-sidebar! px-4!  text-white! py-2.5! hover:border-[#002f5f]! hover:bg-[#002f5f]! disabled:cursor-not-allowed!"
          />
        </div>
      </div>
    </Dialog>
  );
};
