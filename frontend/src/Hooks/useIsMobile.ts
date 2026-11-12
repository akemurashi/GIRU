import { useEffect, useState } from "react";

/**
 * Ancho máximo de punto de quiebre para tablets en horizontal
 * (ej. Samsung Galaxy Tab S7 FE: 800px vertical / 1280px horizontal).
 */
const TABLET_LANDSCAPE_MAX_WIDTH = 1280;
const TABLET_PORTRAIT_MAX_WIDTH = 1024;

function detectMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;

  // 1. En navegadores móviles/tablets (como Chrome o Samsung Internet en Android Tab S7 FE),
  // navigator.pdfViewerEnabled es false, por lo que un <iframe> descarga el PDF en vez de mostrarlo.
  if (
    typeof navigator !== "undefined" &&
    "pdfViewerEnabled" in navigator &&
    navigator.pdfViewerEnabled === false
  ) {
    return true;
  }

  // 2. Dispositivos puramente táctiles sin puntero fino (móviles y tablets Android / iPadOS)
  const isPrimaryTouch =
    window.matchMedia("(pointer: coarse) and (hover: none)").matches;
  if (isPrimaryTouch) {
    return true;
  }

  // 3. Dispositivos con pantalla táctil dentro del rango de tablets (hasta 1280px, ej. Tab S7 FE horizontal)
  const hasTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);
  if (hasTouch && window.innerWidth <= TABLET_LANDSCAPE_MAX_WIDTH) {
    return true;
  }

  // 4. Punto de quiebre por ventana para móviles y tablets (< 1024px)
  return window.innerWidth < TABLET_PORTRAIT_MAX_WIDTH;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    detectMobileOrTablet()
  );

  useEffect(() => {
    const check = () => setIsMobile(detectMobileOrTablet());

    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const hoverQuery = window.matchMedia("(hover: none)");

    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    pointerQuery.addEventListener?.("change", check);
    hoverQuery.addEventListener?.("change", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      pointerQuery.removeEventListener?.("change", check);
      hoverQuery.removeEventListener?.("change", check);
    };
  }, []);

  return isMobile;
}
