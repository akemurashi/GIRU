import Sidebar from "../../Compartido/Sidebar";
import { FaqHero } from "../Componentes/FaqHero";

export default function PaginaFaq() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="min-w-0 lg:pl-64">
        <FaqHero />
      </main>
    </div>
  );
}