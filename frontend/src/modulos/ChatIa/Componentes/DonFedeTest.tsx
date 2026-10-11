
import { useEffect, useRef, useState } from "react";
import { ChatConversation } from "./ChatConversation";
import { ChatInput } from "./ChatInput";

interface Message {
  type: "user" | "assistant";
  messageText?: string;
  interpretationTitle?: string;
  interpretationText?: string;
  sourceTitle?: string;
  sourceStatus?: string;
  sourceDocumentTitle?: string;
  sourceDocumentMeta?: string;
  sourceDocumentUpdated?: string;
  sourceQuote?: string;
  sourceButtonText?: string;
  sourceDocumentOriginalTitle?: string;
  isStreaming?: boolean;
}

export default function DonFedeTest() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = () => {
    const question = inputValue.trim();

    if (!question || isLoading) return;

    setInputValue("");
    setIsLoading(true);

    const assistantMessage: Message = {
      type: "assistant",
      interpretationTitle: "Interpretación de la consulta",
      interpretationText: "",
      sourceTitle: "Fuente oficial",
      sourceStatus: "Vigente",
      sourceDocumentTitle: "",
      sourceDocumentMeta: "",
      sourceDocumentUpdated: "",
      sourceQuote: "",
      sourceButtonText: "Ver documento completo",
      isStreaming: true,
    };

    setMessages((previous) => [
      ...previous,
      { type: "user", messageText: question },
      assistantMessage,
    ]);

    // Simula el tiempo de espera sin utilizar la API.
    window.setTimeout(() => {
      setMessages((previous) =>
        previous.map((message, index) =>
          index === previous.length - 1 &&
          message.type === "assistant"
            ? {
                ...message,
                interpretationText:
                  "Esta es una respuesta simulada de Don Fede. En GIRU, la respuesta real se obtiene consultando la documentación institucional.",
                sourceDocumentTitle:
                  "Documento de ejemplo (simulación)",
                sourceDocumentMeta:
                  "Documento ficticio para probar la interfaz",
                sourceQuote:
                  "Este contenido es únicamente de prueba y no corresponde a una normativa oficial.",
                isStreaming: false,
              }
            : message
        )
      );

      setIsLoading(false);
    }, 5000);
  };

  return (
    <main className="fixed inset-0 z-0 flex min-h-0 flex-col overflow-hidden bg-white">
      <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <h1 className="text-lg font-semibold text-sky-900">
          GIRU — Prueba de animación
        </h1>
        <p className="text-sm text-gray-500">
          Modo de prueba sin conexión a la API
        </p>
      </header>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10">
            <ChatConversation messages={messages} />
            <div ref={conversationEndRef} />
          </div>
        </div>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </section>
    </main>
  );
}
