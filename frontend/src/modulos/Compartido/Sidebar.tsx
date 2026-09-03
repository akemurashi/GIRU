import { useState } from "react";

import { SidebarHeaderMenu } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE */}
      <header
        className="
          md:hidden
          bg-sidebar
          text-white
        "
      >
        {/* HEADER MOBILE */}
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
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
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
            {/* NAV MOBILE */}
            <div className="max-h-[60vh] overflow-y-auto">
              <SidebarNav />
            </div>

            {/* FOOTER MOBILE */}
            <div className="mt-4">
              <SidebarFooter />
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP */}
      <aside
        className="
          hidden
          md:flex
          fixed
          left-0
          top-0
          h-screen
          w-64
          flex-col
          bg-sidebar
          text-white
          shadow-lg
        "
      >
        <SidebarHeaderMenu />

        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>

        <SidebarFooter />
      </aside>
    </>
  );
}