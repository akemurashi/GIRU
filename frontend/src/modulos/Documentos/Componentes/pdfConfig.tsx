import { pdfjs } from "react-pdf";

// ✅ Vite compatible (SIN CORS, SIN CDN)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();