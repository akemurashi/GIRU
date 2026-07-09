import { ChatHeader } from "./ChatHeader";
import { ChatConversation } from "./ChatConversation";
import { InfoPanel } from "./InfoPanel";
import { ChatInput } from "./ChatInput";

export const ChatMain = () => {
  return (
    <main className="flex h-full min-h-0 overflow-hidden">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <ChatHeader />

        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10">
            <ChatConversation />
          </div>
        </div>

        <ChatInput />
      </section>

      <InfoPanel />
    </main>
  );
};