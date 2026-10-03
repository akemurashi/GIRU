import { useMemo, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { DocumentListItem } from "./DocumentListItem";
import { DocumentEditor } from "./DocumentEditor";
import type { CatalogOption, EditableDocument } from "./types";
import { mockCatalogs, mockDocuments } from "./mockData"; // TODO: reemplazar por la API del backend

const labelOf = (opts: CatalogOption[], id: number | null) => opts.find((o) => o.value === id)?.label ?? "";

export const DocumentSearch = () => {
  const toast = useRef<Toast>(null);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<EditableDocument[]>(mockDocuments);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const catalogs = mockCatalogs;

  const selectedDocument = documents.find((d) => d.iddocumento === selectedId) ?? null;

  const documentOptions = useMemo<CatalogOption[]>(
    () => documents.map((d) => ({ value: d.iddocumento, label: `${d.numero} – ${d.titulo}` })),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return documents;
    return documents.filter((d) =>
      [
        d.numero,
        d.titulo,
        d.nommetadato,
        labelOf(catalogs.tiposDocumento, d.idtipodocumento),
        labelOf(catalogs.estadosVigencia, d.idestadovigencia),
      ].some((field) => field.toLowerCase().includes(search))
    );
  }, [query, documents, catalogs]);

  const handleSelect = (id: number) => {
    if (id === selectedId) return;
    if (dirty && !window.confirm("Hay cambios sin guardar. ¿Descartarlos y abrir otro documento?")) return;
    setSelectedId(id);
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Hay cambios sin guardar. ¿Descartarlos?")) return;
    setSelectedId(null);
  };

  const handleSave = (draft: EditableDocument) => {
    // TODO: enviar al backend (PUT documento + tablas puente + relaciones en una sola transacción).
    // Si la BD rechaza algo (idx_rel_unica, trigger DAG), mostrar el mensaje en el Toast.
    setDocuments((prev) => prev.map((d) => (d.iddocumento === draft.iddocumento ? draft : d)));
    toast.current?.show({ severity: "success", summary: "Cambios guardados", detail: draft.numero, life: 3500 });
  };

  return (
    <div className="w-full bg-slate-50">
      <Toast ref={toast} />
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
        {/* BUSCADOR */}
        <section className="mb-6">
          <label htmlFor="document-search" className="mb-2 block text-sm font-semibold text-slate-700">
            Buscar documento
          </label>
          <div className="relative flex h-14 items-center rounded-2xl border border-slate-300 bg-white shadow-sm transition focus-within:border-[#003d7a] focus-within:ring-4 focus-within:ring-[#003d7a]/10">
            <i className="pi pi-search pointer-events-none absolute left-5 text-slate-400" />
            <InputText
              id="document-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por metadato, número o título del documento"
              className="h-full w-full rounded-2xl border-0! bg-transparent! pl-13 pr-12 text-base text-slate-700 shadow-none! outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setQuery("")}
                className="absolute right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <i className="pi pi-times text-sm" />
              </button>
            )}
          </div>
        </section>

        {/* RESULTADOS */}
        {filteredDocuments.length > 0 ? (
          <div className="w-full">
            <p className="m-0 mb-3 text-sm text-slate-500">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? "documento" : "documentos"}
              {query.trim() && ` para «${query.trim()}»`}
            </p>
            {filteredDocuments.map((doc) => (
              <DocumentListItem
                key={doc.iddocumento}
                documentCode={doc.numero}
                documentType={labelOf(catalogs.tiposDocumento, doc.idtipodocumento)}
                validity={labelOf(catalogs.estadosVigencia, doc.idestadovigencia)}
                title={doc.titulo}
                active={selectedId === doc.iddocumento}
                onClick={() => handleSelect(doc.iddocumento)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <i className="pi pi-search mb-3 text-3xl text-slate-300" />
            <p className="m-0 text-lg font-medium text-slate-700">No se encontraron documentos</p>
            <p className="m-0 mt-1 text-sm text-slate-500">Prueba con otro metadato, número o parte del título.</p>
          </div>
        )}

        {/* ESTADO INICIAL */}
        {!selectedDocument && filteredDocuments.length > 0 && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
            <i className="pi pi-file-edit mb-3 text-4xl text-slate-300" />
            <p className="m-0 text-lg font-medium text-slate-600">Selecciona un documento para editarlo</p>
          </div>
        )}

        {/* EDITOR: key reinicia el borrador al cambiar de documento */}
        {selectedDocument && (
          <DocumentEditor
            key={selectedDocument.iddocumento}
            initial={selectedDocument}
            catalogs={catalogs}
            documentOptions={documentOptions}
            onSave={handleSave}
            onCancel={handleCancel}
            onDirtyChange={setDirty}
          />
        )}
      </div>
    </div>
  );
};
