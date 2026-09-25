import SidebarLayout from "../../Compartido/SidebarLayout";

import { ChatMain } from "../Componentes/ChatMain";

export default function PaginaChatIa() {
  return (
    <SidebarLayout>
      <div className="h-dvh overflow-hidden">
        <ChatMain />
      </div>
    </SidebarLayout>
  );
}