import { useState } from "react";

import { ChatHeader } from "./ChatHeader";
import { ChatConversation } from "./ChatConversation";
import { InfoPanel } from "./InfoPanel";
import { ChatInput } from "./ChatInput";

export const ChatMain = () => {
  const [showHeader, setShowHeader] = useState(true);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;

    setShowHeader(scrollTop <= 10);
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
            <ChatConversation />
          </div>
        </div>

        {/* INPUT */}
        <ChatInput />
      </section>

      {/* PANEL DERECHO */}
      <InfoPanel />
    </main>
  );
};