
import { useState, useRef, useEffect } from "react";
import { externalAiService, type AskResponse, type AskRequest } from "../../../services/externalAiService";
import api from "../../../services/api";
import { PdfModal } from "../../Documentos/Componentes/PdfModal";
import { ChatHeader } from "./ChatHeader";
import { ChatConversation } from "./ChatConversation";
import { InfoPanel } from "./InfoPanel";
import { ChatInput } from "./ChatInput";
import type { Message, SourceItem } from "../types";

export const ChatMain = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Inicializa la sesión real, igual que antes.
  useEffect(() => {
    initializeSession();
  }, []);

  // Mantiene la conversación desplazada hacia el último mensaje.
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
      const response = await api.get<{ id: number; titulo: string }>(
        `/documents/by-title/${encodeURIComponent(documentTitle)}`
      );

      setSelectedDocumentId(response.data.id);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error getting document by title:", error);
      alert("Error al abrir el documento");
    }
  };

  const cleanDocumentTitle = (title: string): string => {
    return title.replace(/\.md$/i, "");
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage ?? inputValue).trim();
    if (!textToSend || !sessionId || isLoading) return;

    const userMessage = textToSend;
    if (customMessage === undefined) {
      setInputValue("");
    }
    setIsLoading(true);

    // Añade el mensaje del usuario.
    const userMsg: Message = {
      type: "user",
      messageText: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Añade el mensaje provisional del asistente.
    // isStreaming activa el video del avatar mientras llega la respuesta.
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
          // Recibe actualizaciones de estado o fragmentos de texto.
          if (chunk.status) {
            setMessages((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.type === "assistant"
                  ? { ...msg, streamingStatus: chunk.status }
                  : msg
              )
            );
          } else if (chunk.chunk) {
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
          // La respuesta terminó: el SVG volverá a mostrarse.
          const response = complete as AskResponse;
          const fuentesRaw = response.fuentes || [];
          const topSources: SourceItem[] = fuentesRaw.slice(0, 3).map((f) => ({
            documento: f.documento,
            tituloLimpio: cleanDocumentTitle(f.documento),
            fragmento: f.fragmento || null,
            esOficial: Boolean(f.fragmento),
          }));

          const firstSource = topSources[0];
          const hasVerifiedQuote = Boolean(firstSource?.fragmento);

          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 && msg.type === "assistant"
                ? {
                    ...msg,
                    interpretationText: response.respuesta || fullResponse,
                    sourceTitle: hasVerifiedQuote ? "Fuente oficial" : "Documento relacionado",
                    sourceStatus: hasVerifiedQuote ? "Cita verificada" : "Sin cita textual",
                    sourceDocumentTitle: firstSource
                      ? firstSource.tituloLimpio
                      : "Documento no especificado",
                    sourceDocumentMeta: "", // Se descarta 'referencia' (UUID generado al azar)
                    sourceDocumentOriginalTitle: firstSource?.documento || "",
                    sourceQuote: firstSource?.fragmento || undefined,
                    sources: topSources,
                    streamingStatus: undefined,
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
                ? {
                    ...msg,
                    interpretationText: `Error: ${error}`,
                    streamingStatus: undefined,
                    isStreaming: false,
                  }
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
            ? {
                ...msg,
                interpretationText:
                  "Error al obtener respuesta. Por favor, intenta nuevamente.",
                streamingStatus: undefined,
                isStreaming: false,
              }
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
            ${showHeader ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
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
          <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
            <ChatConversation
              messages={messages}
              onViewDocument={handleViewDocument}
            />
            <div ref={conversationEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          disabled={isLoading || !sessionId}
        />
      </section>

      {/* PANEL DERECHO */}
      <InfoPanel
        onSelectQuery={handleSendMessage}
        disabled={isLoading || !sessionId}
      />

      {/* PDF MODAL */}
      {showPdfModal && selectedDocumentId && (
        <PdfModal
          documentId={String(selectedDocumentId)}
          onClose={() => {
            setShowPdfModal(false);
            setSelectedDocumentId(null);
          }}
        />
      )}
    </main>
  );
};
