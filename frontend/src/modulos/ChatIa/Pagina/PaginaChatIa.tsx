import Sidebar from "../../Compartido/Sidebar";
import { ChatMain } from "../Componentes/ChatMain";

export default function PaginaChatIa() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-gray-50 md:block">
      <Sidebar />

      <div className="min-h-0 flex-1 md:h-full md:pl-64">
        <ChatMain />
      </div>
    </div>
  );
}