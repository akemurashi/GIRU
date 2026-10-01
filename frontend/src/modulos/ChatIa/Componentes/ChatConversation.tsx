import { ChatMessage } from "./ChatMenssage";

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

interface ChatConversationProps {
  messages: Message[];
  onViewDocument?: (documentTitle: string) => void;
}

export const ChatConversation = ({ messages, onViewDocument }: ChatConversationProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
          <i className="pi pi-book text-3xl text-sky-900"></i>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Bienvenido al asistente de reglamentos
        </h3>
        <p className="max-w-md text-sm text-gray-600">
          Haz preguntas sobre reglamentos, normativas o resoluciones y recibirás respuestas basadas en los documentos oficiales.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          type={message.type}
          messageText={message.messageText}
          interpretationTitle={message.interpretationTitle}
          interpretationText={message.interpretationText}
          sourceTitle={message.sourceTitle}
          sourceStatus={message.sourceStatus}
          sourceDocumentTitle={message.sourceDocumentTitle}
          sourceDocumentMeta={message.sourceDocumentMeta}
          sourceDocumentUpdated={message.sourceDocumentUpdated}
          sourceQuote={message.sourceQuote}
          sourceButtonText={message.sourceButtonText}
          sourceDocumentOriginalTitle={message.sourceDocumentOriginalTitle}
          onViewDocument={onViewDocument}
        />
      ))}
    </div>
  );
};