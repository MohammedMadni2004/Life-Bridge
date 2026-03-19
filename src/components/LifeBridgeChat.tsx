import { useState, useRef, useEffect, type FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "I'm the LifeBridge Guidance Assistant. I'm here to help you navigate the practical steps that follow the loss of a loved one — with care, clarity, and compassion.\n\nYou can ask me about anything from immediate next steps, to financial accounts, insurance, documents, or what to prioritize right now.\n\n**How can I help you today?**",
};

export default function LifeBridgeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Only send actual conversation messages (not the welcome message)
    const apiMessages = updatedMessages
      .filter((_, i) => i > 0 || updatedMessages[0].role === "user")
      .map((m) => ({ role: m.role, content: m.content }));

    // If welcome message is first, skip it for API
    const messagesToSend =
      updatedMessages[0] === WELCOME_MESSAGE
        ? apiMessages.slice(1)
        : apiMessages;

    // Add placeholder for assistant response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend.length > 0 ? messagesToSend : [{ role: "user", content: trimmed }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Something went wrong. Please try again."
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream available.");

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantContent += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      // If no content was streamed, try parsing as regular JSON
      if (!assistantContent) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content:
              "I apologize, but I wasn't able to generate a response. Please try asking again.",
          };
          return updated;
        });
      }
    } catch (error: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            error.message ||
            "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open chat from external trigger (hero input)
  const openChat = () => {
    setIsOpen(true);
  };

  // Expose openChat globally so the hero input can trigger it
  useEffect(() => {
    (window as any).__openLifeBridgeChat = openChat;
    return () => {
      delete (window as any).__openLifeBridgeChat;
    };
  }, []);

  // Simple markdown-like rendering (bold, bullet points)
  const renderContent = (content: string) => {
    if (!content) return null;

    return content.split("\n").map((line, i) => {
      // Bold text
      let processedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      );

      // Bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="text-[#4a6b8a] flex-shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^[•\-]\s/, "") }} />
          </div>
        );
      }

      // Numbered items
      const numberedMatch = line.match(/^(\d+)\.\s/);
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 ml-2 my-0.5">
            <span className="text-[#4a6b8a] flex-shrink-0 font-medium">{numberedMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\.\s/, "") }} />
          </div>
        );
      }

      // Headers (## style)
      if (line.startsWith("## ")) {
        return (
          <h4
            key={i}
            className="font-semibold text-[#2c3e50] mt-3 mb-1 text-sm"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {line.replace(/^##\s/, "")}
          </h4>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: processedLine }} />
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#4a6b8a] hover:bg-[#3a5570] text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:-translate-y-1"
          aria-label="Open chat assistant"
          id="chat-floating-btn"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#4a6b8a] animate-ping opacity-20" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-full sm:h-[600px] sm:max-h-[80vh] flex flex-col bg-white sm:rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4a6b8a] to-[#3a5570] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className="text-white font-medium text-[15px]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  LifeBridge Guidance
                </h3>
                <p className="text-white/70 text-xs">
                  Your compassionate assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-[#f8fafb] to-white">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#4a6b8a] text-white rounded-br-md"
                      : "bg-white text-[#4a5568] rounded-bl-md shadow-sm border border-slate-100"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-0.5">
                      {msg.content ? (
                        renderContent(msg.content)
                      ) : isLoading && i === messages.length - 1 ? (
                        <div className="flex items-center gap-1.5 py-1">
                          <div className="w-2 h-2 bg-[#4a6b8a]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-[#4a6b8a]/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-[#4a6b8a]/40 rounded-full animate-bounce" />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#f5f7f9] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4a6b8a]/30 focus:border-[#4a6b8a]/50 text-[14px] text-[#4a5568] placeholder:text-[#a0aec0] disabled:opacity-60 transition-all"
              id="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#4a6b8a] hover:bg-[#3a5570] disabled:bg-[#a0b4c8] text-white p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 disabled:cursor-not-allowed"
              aria-label="Send message"
              id="chat-send-btn"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-[#f8fafb] border-t border-slate-50 flex-shrink-0">
            <p className="text-[10px] text-[#a0aec0] text-center leading-tight">
              Education & guidance only. Not legal, tax, or financial advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
