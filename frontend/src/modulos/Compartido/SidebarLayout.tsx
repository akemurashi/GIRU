import { type ReactNode, useState } from "react";
import Sidebar from "./Sidebar";

type SidebarLayoutProps = {
  children: ReactNode;
};

export default function SidebarLayout({
  children,
}: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        onDesktopToggle={setSidebarOpen}
      />

      <main
        className={`
          min-h-screen
          transition-[margin]
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "md:ml-64"
              : "md:ml-0"
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}