import Sidebar from "../../Compartido/Sidebar";
import { ChatMain } from "../Componentes/ChatMain";

export default function PaginaChatIa() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="h-full md:pl-64">
        <ChatMain />
      </div>
    </div>
  );
}