import { ChatMessage } from "./ChatMenssage";

export const ChatConversation = () => {
  return (
    <div className="flex flex-col gap-8">
      <ChatMessage
        type="user"
        messageText="¿Qué ocurre si repruebo una asignatura por tercera vez?"
      />

      <ChatMessage
        type="assistant"
        interpretationTitle="Interpretación de la consulta"
        interpretationText="Si un estudiante reprueba una asignatura por tercera vez, quedará eliminado de la Universidad. Esta medida es definitiva y se aplica de forma automática una vez que se registra la tercera reprobación de la misma asignatura. El estudiante tiene derecho a ser notificado formalmente de esta situación y puede solicitar información sobre los procedimientos de apelación si considera que existen circunstancias excepcionales."
        sourceTitle="Fuente oficial"
        sourceStatus="Vigente"
        sourceDocumentTitle="Reglamento del Estudiante de Pregrado UTFSM"
        sourceDocumentMeta="Reglamento • Artículo 15, inciso 3"
        sourceDocumentUpdated="Actualizado: Enero 2025"
        sourceQuote="El estudiante que repruebe por tercera vez una misma asignatura, quedará eliminado de la Universidad."
        sourceButtonText="Ver documento completo"
      />
    </div>
  );
};