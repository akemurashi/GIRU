export interface SourceItem {
  documento: string;
  tituloLimpio: string;
  fragmento?: string | null;
  esOficial: boolean;
}

export interface Message {
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
  streamingStatus?: string;
  sources?: SourceItem[];
}
