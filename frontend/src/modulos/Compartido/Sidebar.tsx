import { useState } from "react";

import { SidebarHeaderMenu } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

type SidebarProps = {
  onDesktopToggle?: (isOpen: boolean) => void;
};

export default function Sidebar({
  onDesktopToggle,
}: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const toggleDesktopSidebar = () => {
    const newState = !desktopOpen;

    setDesktopOpen(newState);
    onDesktopToggle?.(newState);
  };

  return (
    <>
      {/* =====================================================
          MOBILE
      ===================================================== */}
      <div className="md:hidden">
        {/* Espacio reservado para el menú fijo */}
        <div className="h-14" />

        <header
          className="
            fixed
            left-0
            top-0
            z-50
            w-full
            bg-sidebar
            text-white
          "
        >
          <div
            className="
              relative
              flex
              items-center
              justify-center
              py-2
            "
          >
            <SidebarHeaderMenu />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                absolute
                right-4
                text-2xl
              "
              aria-label={
                menuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* MENU MOBILE */}
          <div
            className={`
              overflow-hidden
              transition-all
              duration-300
              ${menuOpen ? "max-h-[80vh]" : "max-h-0"}
            `}
          >
            <div
              className="
                border-t
                border-white/10
                p-4
              "
            >
              <div className="max-h-[60vh] overflow-y-auto">
                <SidebarNav />
              </div>

              <div className="mt-4">
                <SidebarFooter />
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}
      <aside
        className={`
          hidden
          md:flex
          fixed
          left-0
          top-0
          z-50
          h-screen
          flex-col
          bg-sidebar
          text-white
          shadow-lg
          transition-all
          duration-300
          ease-in-out
          ${
            desktopOpen
              ? "w-64 translate-x-0"
              : "w-0 -translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div
          className={`
            transition-opacity
            duration-200
            ${
              desktopOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          <SidebarHeaderMenu />
        </div>

        {/* NAV */}
        <div
          className={`
            flex-1
            overflow-y-auto
            transition-opacity
            duration-200
            ${
              desktopOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          <SidebarNav />
        </div>

        {/* FOOTER */}
        <div
          className={`
            transition-opacity
            duration-200
            ${
              desktopOpen
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          <SidebarFooter />
        </div>
      </aside>

      {/* =====================================================
          BOTÓN SIDEBAR DESKTOP
      ===================================================== */}
      <button
        type="button"
        onClick={toggleDesktopSidebar}
        className="
          hidden
          md:flex
          fixed
          top-5
          z-60
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-slate-200
          bg-white
          text-slate-700
          shadow-md
          transition-all
          duration-300
          ease-in-out
          hover:bg-slate-100
          hover:shadow-lg
          hover:scale-105
          active:scale-95
        "
        style={{
          left: desktopOpen ? "15rem" : "1rem",
        }}
        aria-label={
          desktopOpen
            ? "Ocultar menú"
            : "Mostrar menú"
        }
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          {/* Icono cerrar */}
          <i
            className={`
              pi pi-angle-left
              absolute
              text-lg
              transition-all
              duration-300
              ease-in-out
              ${
                desktopOpen
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0"
              }
            `}
          />

          {/* Icono abrir */}
          <i
            className={`
              pi pi-bars
              absolute
              text-base
              transition-all
              duration-300
              ease-in-out
              ${
                desktopOpen
                  ? "scale-50 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }
            `}
          />
        </span>
      </button>
    </>
  );
}