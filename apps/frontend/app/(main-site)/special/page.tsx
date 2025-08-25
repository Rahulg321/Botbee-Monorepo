// app/embed/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function EmbedPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = (params.get("theme") || "light") as "light" | "dark";
    setTheme(t);
  }, []);

  // auto-resize: observe content changes and post height to parent
  useEffect(() => {
    const el = rootRef.current!;
    const ro = new ResizeObserver(() => {
      const height = Math.ceil(el.scrollHeight);
      window.parent.postMessage({ type: "EMBED_SIZE", height }, "*");
    });
    ro.observe(el);

    window.parent.postMessage({ type: "EMBED_READY" }, "*");

    return () => ro.disconnect();
  }, []);

  const notifyClick = () => {
    console.log("notifyClick");
    window.parent.postMessage(
      { type: "EMBED_EVENT", action: "clicked_cta" },
      "*"
    );
  };

  return (
    <div ref={rootRef} className={`embed-container ${theme}`}>
      <div className="embed-header">
        <div className="header-content">
          <div className="status-indicator"></div>
          <h3 className="header-title">AI Assistant</h3>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === "user" ? "user" : "assistant"}`}
          >
            <div
              className={`message-bubble ${message.role === "user" ? "user" : "assistant"}`}
            >
              {message.parts.map((part) => {
                if (part.type === "text") {
                  return (
                    <div key={`${message.id}-text`} className="message-text">
                      {part.text}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Input Container */}
      <div className="input-container">
        <div className="input-wrapper">
          <Input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            onKeyDown={async (event) => {
              console.log("onKeyDown", event.key);
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (input.trim()) {
                  console.log("sendMessage", input);
                  sendMessage({
                    parts: [{ type: "text", text: input }],
                  });
                  setInput("");
                }
              }
            }}
            placeholder="Type your message..."
            className="message-input"
          />
          <Button
            onClick={() => {
              if (input.trim()) {
                sendMessage({
                  parts: [{ type: "text", text: input }],
                });
                setInput("");
              }
            }}
            className="send-button"
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
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .embed-container {
          min-height: 400px;
          max-height: 600px;
          width: 100%;
          max-width: 28rem;
          margin: 0 auto;
          font-family: sans-serif;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .embed-container.light {
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-tertiary: #f3f4f6;
          --text-primary: #111827;
          --text-secondary: #374151;
          --text-muted: #6b7280;
          --border-color: #e5e7eb;
          --border-secondary: #d1d5db;
          --accent-primary: #3b82f6;
          --accent-hover: #2563eb;
          --success: #10b981;
        }

        .embed-container.dark {
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --bg-tertiary: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #e5e7eb;
          --text-muted: #9ca3af;
          --border-color: #374151;
          --border-secondary: #4b5563;
          --accent-primary: #3b82f6;
          --accent-hover: #2563eb;
          --success: #34d399;
        }

        .embed-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-indicator {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--success);
        }

        .header-title {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          max-height: 400px;
          background: var(--bg-primary);
        }

        .empty-state {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-muted);
        }

        .empty-icon {
          width: 3rem;
          height: 3rem;
          margin: 0 auto 0.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
        }

        .empty-text {
          font-size: 0.875rem;
        }

        .message {
          display: flex;
          margin-bottom: 0.75rem;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .message-bubble.user {
          background: var(--accent-primary);
          color: white;
        }

        .message-bubble.assistant {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .input-container {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .input-wrapper {
          display: flex;
          gap: 0.5rem;
        }

        .message-input {
          flex: 1;
          font-size: 0.875rem;
          background: var(--bg-primary);
          border-color: var(--border-secondary);
          color: var(--text-primary);
        }

        .message-input::placeholder {
          color: var(--text-muted);
        }

        .message-input:focus {
          border-color: var(--accent-primary);
        }

        .send-button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          background: var(--accent-primary);
          color: white;
        }

        .send-button:hover {
          background: var(--accent-hover);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
