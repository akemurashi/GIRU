import api from "./api";

export interface CreateSessionRequest {
  user_id: string;
  titulo?: string;
  modo?: string;
}

export interface CreateSessionResponse {
  id: string;
  user_id: string;
  titulo: string;
  modo: string;
  creada: string;
  actualizada: string;
}

export interface AskRequest {
  user_id: string;
  session_id: string;
  pregunta: string;
  modo?: string;
  documento?: string;
}

export interface Fuente {
  documento: string;
  referencia?: string;
}

export interface AskResponse {
  session_id: string;
  respuesta: string;
  fuentes: Fuente[];
  modo: string;
  tiempo_s: number;
  llamadas_llm: number;
}

export interface SessionListItem {
  id: string;
  user_id: string;
  titulo: string;
  modo: string;
  creada: string;
  actualizada: string;
}

export interface ChatMessage {
  rol: string;
  contenido: string;
  creado: string;
  meta?: Record<string, any>;
}

export interface SessionDetail {
  id: string;
  titulo: string;
  modo: string;
  mensajes: ChatMessage[];
}

export class ExternalAiService {
  private static instance: ExternalAiService;

  private constructor() {}

  public static getInstance(): ExternalAiService {
    if (!ExternalAiService.instance) {
      ExternalAiService.instance = new ExternalAiService();
    }
    return ExternalAiService.instance;
  }

  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    const response = await api.post<CreateSessionResponse>("/ai/sessions", request);
    return response.data;
  }

  async ask(request: AskRequest): Promise<AskResponse> {
    const response = await api.post<AskResponse>("/ai/ask", request);
    return response.data;
  }

  async askStream(
    request: AskRequest,
    onChunk: (chunk: { status?: string; chunk?: string }) => void,
    onComplete: (response: AskResponse) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const token = localStorage.getItem("auth_token");
    const url = `${api.defaults.baseURL}/ai/ask-stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is not readable");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Split by double newline to get SSE blocks
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || ""; // Keep incomplete block

        for (const block of blocks) {
          const lines = block.split("\n");
          let eventType = "";
          let dataLine = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ")) {
              dataLine = line.slice(6);
            }
          }

          if (!eventType || !dataLine) continue;

          try {
            const data = JSON.parse(dataLine);

            if (eventType === "fase") {
              onChunk({ status: data.detalle });
            } else if (eventType === "token") {
              onChunk({ chunk: data.t });
            } else if (eventType === "fin") {
              onComplete(data);
              return;
            } else if (eventType === "error") {
              onError(data.mensaje);
              return;
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Unknown error occurred");
    }
  }

  async listSessions(userId: string): Promise<SessionListItem[]> {
    const response = await api.get<SessionListItem[]>("/ai/sessions", {
      params: { user_id: userId },
    });
    return response.data;
  }

  async getSession(sessionId: string, userId: string): Promise<SessionDetail> {
    const response = await api.get<SessionDetail>(`/ai/sessions/${sessionId}`, {
      params: { user_id: userId },
    });
    return response.data;
  }

  async deleteSession(sessionId: string, userId: string): Promise<void> {
    await api.delete(`/ai/sessions/${sessionId}`, {
      params: { user_id: userId },
    });
  }
}

export const externalAiService = ExternalAiService.getInstance();
