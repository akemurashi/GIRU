import { pdfjs } from "react-pdf";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?worker&url";

// ✅ Vite compatible (emite .js en lugar de .mjs para evitar errores de MIME type en servidores estáticos)
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
