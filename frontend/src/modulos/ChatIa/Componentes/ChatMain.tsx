import { useState, useRef, useEffect } from "react";
import { externalAiService } from "../../../services/externalAiService";
import api from "../../../services/api";
import { PdfModal } from "../../Documentos/Componentes/PdfModal";
import { ChatHeader } from "./ChatHeader";
import { ChatConversation } from "./ChatConversation";
import { InfoPanel } from "./InfoPanel";
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

interface AskRequest {
  user_id: string;
  session_id: string;
  pregunta: string;
  modo?: string;
  documento?: string;
}

interface AskResponse {
  session_id: string;
  respuesta: string;
  fuentes: Array<{ documento: string; referencia?: string }>;
  modo: string;
  tiempo_s: number;
  llamadas_llm: number;
}

export const ChatMain = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeSession = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "default-user";
      const response = await externalAiService.createSession({
        user_id: userId,
        titulo: "Nueva consulta",
        modo: "cascade",
      });
      setSessionId(response.id);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setShowHeader(scrollTop <= 10);
  };

  const handleViewDocument = async (documentTitle: string) => {
    try {
      // Get document ID from title (handles .md extension)
      const response = await api.get<{ id: number; titulo: string }>(`/documents/by-title/${encodeURIComponent(documentTitle)}`);
      setSelectedDocumentId(response.data.id);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error getting document by title:", error);
      alert("Error al abrir el documento");
    }
  };

  const cleanDocumentTitle = (title: string): string => {
    // Remove .md extension if present
    return title.replace(/\.md$/, '');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      type: "user",
      messageText: userMessage,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Create placeholder for assistant message
    const assistantMsg: Message = {
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
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const userId = localStorage.getItem("user_id") || "default-user";
      const request: AskRequest = {
        user_id: userId,
        session_id: sessionId,
        pregunta: userMessage,
        modo: "cascade",
      };

      let fullResponse = "";

      await externalAiService.askStream(
        request,
        (chunk) => {
          // Handle streaming chunks (can be status updates or text fragments)
          if (chunk.status) {
            // Status update (phase information)
            setMessages((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.type === "assistant"
                  ? { ...msg, interpretationText: chunk.status }
                  : msg
              )
            );
          } else if (chunk.chunk) {
            // Text fragment
            fullResponse += chunk.chunk;
            setMessages((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.type === "assistant"
                  ? { ...msg, interpretationText: fullResponse }
                  : msg
              )
            );
          }
        },
        (complete) => {
          // Handle complete response
          const response = complete as AskResponse;
          const firstSource = response.fuentes[0];

          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 && msg.type === "assistant"
                ? {
                    ...msg,
                    interpretationText: response.respuesta,
                    sourceDocumentTitle: firstSource ? cleanDocumentTitle(firstSource.documento) : "Documento no especificado",
                    sourceDocumentMeta: firstSource?.referencia || "",
                    sourceDocumentOriginalTitle: firstSource?.documento || "",
                    sourceQuote: response.respuesta.slice(0, 200) + "...",
                    isStreaming: false,
                  }
                : msg
            )
          );
        },
        (error) => {
          console.error("Stream error:", error);
          console.error("Error details:", typeof error, error);
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 && msg.type === "assistant"
                ? { ...msg, interpretationText: `Error: ${error}`, isStreaming: false }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.type === "assistant"
            ? { ...msg, interpretationText: "Error al obtener respuesta. Por favor, intenta nuevamente.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-20
        z-0
        flex
        min-h-0
        overflow-hidden
        bg-white
        md:static
        md:h-full
      "
    >
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        {/* HEADER */}
        <div
          className={`
            shrink-0
            overflow-hidden
            transition-all
            duration-300
            ease-in-out
            ${
              showHeader
                ? "max-h-24 opacity-100"
                : "max-h-0 opacity-0"
            }

            md:max-h-none
            md:opacity-100
          `}
        >
          <ChatHeader />
        </div>

        {/* CONVERSACIÓN */}
        <div
          onScroll={handleScroll}
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-white
          "
        >
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10">
            <ChatConversation messages={messages} onViewDocument={handleViewDocument} />
            <div ref={conversationEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading || !sessionId}
        />
      </section>

      {/* PANEL DERECHO */}
      <InfoPanel />

      {/* PDF MODAL */}
      {showPdfModal && selectedDocumentId && (
        <PdfModal
          documentId={selectedDocumentId}
          onClose={() => {
            setShowPdfModal(false);
            setSelectedDocumentId(null);
          }}
        />
      )}
    </main>
  );
};