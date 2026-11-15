
import { useState, useRef, useEffect } from "react";
import { externalAiService, type AskResponse, type AskRequest } from "../../../services/externalAiService";
import { authService, type User } from "../../../services/authService";
import { resolveDocumentoPorTitulo } from "../../../services/relacionService";
import { PdfModal } from "../../Documentos/Componentes/PdfModal";
import { ChatHeader } from "./ChatHeader";
import { ChatConversation } from "./ChatConversation";
import { InfoPanel } from "./InfoPanel";
import { ChatInput } from "./ChatInput";
import type { Message, SourceItem } from "../types";

const formatearNombrePropio = (rawName: string): string => {
  return rawName
    .trim()
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
};

const obtenerNombreSaludo = (user: User | null): string | null => {
  if (!user) return null;

  const rawName = (user.name || "").trim();
  if (rawName && rawName.toLowerCase() !== "usuario") {
    return formatearNombrePropio(rawName);
  }

  if (user.email && user.email.includes("@")) {
    const emailPrefix = user.email.split("@")[0].trim();
    if (emailPrefix && emailPrefix.toLowerCase() !== "unknown") {
      return formatearNombrePropio(emailPrefix);
    }
  }

  return null;
};

const crearMensajeBienvenida = (user: User | null): Message => {
  const nombre = obtenerNombreSaludo(user);
  const saludoInicial = nombre
    ? `¡Hola, ${nombre}! Te doy la bienvenida a GIRU.`
    : "¡Hola! Te doy la bienvenida a GIRU.";

  return {
    type: "assistant",
    interpretationTitle: "Mensaje de bienvenida",
    interpretationText: `${saludoInicial} Soy Don Fede, tu asistente virtual de reglamentos, decretos y normativas de la UTFSM.\n\n¿En qué te puedo ayudar hoy? Escribe tu consulta abajo o selecciona una de las preguntas sugeridas para comenzar.`,
  };
};

// Duración máxima de una sesión desde su inicio: 7 minutos (420.000 ms)
const SESSION_MAX_DURATION_MS = 7 * 60 * 1000;
const ACTIVE_SESSION_STORAGE_KEY = "giru_active_chat_session";

interface StoredActiveSession {
  id: string;
  userId: string;
  startedAt: number;
}

const leerSesionActivaLocal = (): StoredActiveSession | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredActiveSession>;
    if (
      parsed &&
      typeof parsed.id === "string" &&
      typeof parsed.userId === "string" &&
      typeof parsed.startedAt === "number"
    ) {
      return {
        id: parsed.id,
        userId: parsed.userId,
        startedAt: parsed.startedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
};

const guardarSesionActivaLocal = (session: StoredActiveSession): void => {
  try {
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignorar si localStorage no está disponible
  }
};

const limpiarSesionActivaLocal = (): void => {
  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch {
    // Ignorar si localStorage no está disponible
  }
};

export const ChatMain = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [messages, setMessages] = useState<Message[]>(() => [
    crearMensajeBienvenida(authService.getUser()),
  ]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [pdfSeleccionado, setPdfSeleccionado] = useState<string | null>(null);

  const conversationEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const cerrarSesionPorTiempo = () => {
    limpiarSesionActivaLocal();
    setSessionId("");
  };

  // Inicializa la sesión real y sincroniza el nombre del usuario autenticado si es necesario.
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      void initializeSession();
    }

    const storedUser = authService.getUser();
    const token = authService.getToken();

    if (token && (!storedUser || !obtenerNombreSaludo(storedUser))) {
      authService
        .getCurrentUser(token)
        .then((freshUser) => {
          authService.setUser(freshUser);
          setMessages((prev) => {
            if (
              prev.length > 0 &&
              prev[0].type === "assistant" &&
              prev[0].interpretationTitle === "Mensaje de bienvenida"
            ) {
              const updated = [...prev];
              updated[0] = crearMensajeBienvenida(freshUser);
              return updated;
            }
            return prev;
          });
        })
        .catch(() => {
          // Si falla la consulta de perfil, se conserva el saludo por defecto.
        });
    }
  }, []);

  // Cierra automáticamente la sesión en el frontend cuando cumple 7 minutos desde su inicio.
  useEffect(() => {
    if (!sessionId) return;

    const stored = leerSesionActivaLocal();
    const startedAt =
      stored && stored.id === sessionId ? stored.startedAt : Date.now();
    const elapsed = Date.now() - startedAt;

    if (elapsed >= SESSION_MAX_DURATION_MS) {
      cerrarSesionPorTiempo();
      return;
    }

    const remainingMs = SESSION_MAX_DURATION_MS - elapsed;
    const timerId = window.setTimeout(() => {
      cerrarSesionPorTiempo();
    }, remainingMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [sessionId]);

  // Mantiene la conversación desplazada hacia el último mensaje cuando hay interacción.
  useEffect(() => {
    if (messages.length > 1) {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initializeSession = async () => {
    try {
      const userId = localStorage.getItem("user_id") || "default-user";

      // Si había una sesión local con 7 minutos o más desde su inicio, se cierra localmente.
      const previa = leerSesionActivaLocal();
      if (previa && Date.now() - previa.startedAt >= SESSION_MAX_DURATION_MS) {
        limpiarSesionActivaLocal();
      }

      const response = await externalAiService.createSession({
        user_id: userId,
        titulo: "Nueva consulta",
        modo: "cascade",
      });

      guardarSesionActivaLocal({
        id: response.id,
        userId,
        startedAt: Date.now(),
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
      const resolved = await resolveDocumentoPorTitulo(documentTitle);
      const documentId = String(resolved.id).trim();
      if (!documentId || ["NaN", "undefined", "null"].includes(documentId)) {
        console.error("Identificador de documento inválido:", resolved.id);
        return;
      }
      setPdfSeleccionado(documentId);
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

    const sesionActual = leerSesionActivaLocal();
    if (
      sesionActual &&
      sesionActual.id === sessionId &&
      Date.now() - sesionActual.startedAt >= SESSION_MAX_DURATION_MS
    ) {
      cerrarSesionPorTiempo();
      return;
    }

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
    <>
      <main
        className="
          fixed
          left-0
          right-0
          bottom-0
          top-14
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
            <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8 xl:px-10">
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
      </main>

      {/* PDF MODAL (Mismo visualizador que en la vista de Documentos) */}
      {pdfSeleccionado !== null && (
        <PdfModal
          documentId={pdfSeleccionado}
          onClose={() => setPdfSeleccionado(null)}
        />
      )}
    </>
  );
};
