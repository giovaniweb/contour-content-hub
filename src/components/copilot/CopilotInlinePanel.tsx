import React, { useRef, useState } from "react";
import { Send } from "lucide-react";
import { useCopilotChat } from "@/hooks/useCopilotChat";

const CopilotInlinePanel: React.FC = () => {
  const { messages, sendMessage, loading, courseId } = useCopilotChat();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <aside aria-label="Fluida Academy" className="aurora-glass rounded-2xl p-4 border border-aurora-neon-blue/20 bg-aurora-card-bg/60">
      <header className="mb-3">
        <h2 className="text-xl font-semibold aurora-text-gradient">Fluida Academy</h2>
        <p className="text-sm text-white/60 mt-1">
          {courseId ? "Contexto do curso atual aplicado automaticamente." : "Consultas em conteúdos públicos."}
        </p>
      </header>

      <div
        ref={listRef}
        className="h-[360px] overflow-y-auto rounded-md border border-aurora-neon-blue/20 p-3 space-y-3 bg-black/10"
      >
        {messages.length === 0 && (
          <p className="text-sm text-white/70">Digite sua pergunta abaixo para começar.</p>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block max-w-[85%] rounded-lg px-3 py-2 " +
                (m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 text-white border border-white/10")
              }
            >
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
            </div>
            {m.role === "assistant" && m.citations && m.citations.length > 0 && (
              <div className="mt-2 text-xs text-white/60">
                <div className="font-medium">Fontes:</div>
                <ul className="list-disc pl-4">
                  {m.citations.map((c: any, i: number) => (
                    <li key={i}>{(c.title || "Fonte")} — score {(c.score ?? 0).toFixed(3)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-1 h-10 rounded-md border border-aurora-neon-blue/30 bg-black/20 px-3 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 h-10 px-3 rounded-md bg-primary text-primary-foreground border border-border disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </aside>
  );
};

export default CopilotInlinePanel;
