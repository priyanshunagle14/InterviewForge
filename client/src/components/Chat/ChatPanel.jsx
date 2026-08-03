import { useState, useRef, useEffect } from "react";
import Card from "../Common/Card";

export default function ChatPanel({ messages, onSend, mySocketId, role, chatMuted, onToggleMute }) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function handleSend() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <Card className="p-6 flex flex-col h-80 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-dim tracking-wide">CHAT</h3>
        {role === "interviewer" && (
          <button
            onClick={onToggleMute}
            className={`text-xs px-2 py-1 rounded ${chatMuted ? "bg-interviewer text-bg" : "text-dim"}`}
          >
            {chatMuted ? "Unmute" : "Mute candidate"}
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 mb-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-dim text-sm">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span
              className={m.role === "interviewer" ? "text-interviewer font-semibold" : "text-candidate font-semibold"}
            >
              {m.name}
            </span>
            <span className="text-dim">: </span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={chatMuted && role === "candidate" ? "Chat is muted by the interviewer" : "Type a message…"}
          disabled={chatMuted && role === "candidate"}
          className="flex-1 min-w-0 bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dim outline-none focus:border-interviewer disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={chatMuted && role === "candidate"}
          className="shrink-0 px-4 py-2 rounded-lg bg-interviewer text-bg text-sm font-semibold hover:brightness-110 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </Card>
  );
}