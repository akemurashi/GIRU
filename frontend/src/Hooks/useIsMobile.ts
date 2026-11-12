import { useEffect, useState } from "react";

/**
 * Ancho máximo de punto de quiebre para tablets en horizontal y pantallas compactas
 * (ej. Samsung Galaxy Tab S7 FE: 800px vertical / 1280px–1600px horizontal).
 */
const TABLET_MAX_VIEWPORT_WIDTH = 1280;
const TOUCH_TABLET_MAX_WIDTH = 1600;

function detectMobileOrTablet(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Si el navegador indica explícitamente que no tiene visor PDF nativo en iframe
  if (
    typeof navigator !== "undefined" &&
    "pdfViewerEnabled" in navigator &&
    navigator.pdfViewerEnabled === false
  ) {
    return true;
  }

  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const platform =
    typeof navigator !== "undefined" ? navigator.platform || "" : "";

  // 2. Detectar dispositivos Android / iOS / iPadOS / Tablets por User-Agent o arquitectura ARM en Linux
  // (Incluso cuando Chrome/Samsung Internet en una Galaxy Tab S7 FE activa "Sitio para computadoras",
  // platform sigue siendo "Linux armv8l" / "Linux aarch64" o maxTouchPoints > 0 en sistema no-Windows).
  const isMobileOrTabletOS =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|SM-T|Silk|Kindle|PlayBook/i.test(
      ua
    ) || /Linux armv|Linux aarch64|iPad|iPhone|iPod/i.test(platform);

  if (isMobileOrTabletOS) {
    return true;
  }

  // 3. Usar any-pointer / any-hover / maxTouchPoints para tablets con S Pen, teclado o mouse conectado
  // (En Galaxy Tab S7 FE, el S Pen reporta pointer: fine y hover: hover, pero any-pointer: coarse y maxTouchPoints > 0 siguen activos).
  const hasCoarsePointer =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(any-pointer: coarse)").matches;
  const hasTouchPoints =
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
    "ontouchstart" in window;
  const isWindowsDesktop = /Windows NT/i.test(ua);

  // En cualquier dispositivo táctil que no sea Windows (ej. Android en modo escritorio o iPadOS), siempre usar el visor adaptado
  if ((hasCoarsePointer || hasTouchPoints) && !isWindowsDesktop) {
    return true;
  }

  // En pantallas táctiles de hasta 1600px (cubre tablets grandes como Tab S7 FE 2560x1600 en cualquier escala)
  if ((hasCoarsePointer || hasTouchPoints) && window.innerWidth <= TOUCH_TABLET_MAX_WIDTH) {
    return true;
  }

  // 4. Punto de quiebre por ancho de ventana (móviles y tablets hasta 1280px inclusive)
  return window.innerWidth <= TABLET_MAX_VIEWPORT_WIDTH;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    detectMobileOrTablet()
  );

  useEffect(() => {
    const check = () => setIsMobile(detectMobileOrTablet());

    const pointerQuery = window.matchMedia("(any-pointer: coarse)");
    const hoverQuery = window.matchMedia("(any-hover: none)");

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

