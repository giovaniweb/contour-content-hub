import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCopilotChat } from "@/hooks/useCopilotChat";
import { Send } from "lucide-react";

const CopilotPage: React.FC = () => {
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
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Copilot de Conhecimento | FLUIDA</title>
        <meta name="description" content="Faça perguntas ao Copilot e receba respostas com fontes confiáveis." />
        <link rel="canonical" href="/copilot" />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Copilot de Conhecimento</h1>
        <p className="text-muted-foreground mt-1">
          {courseId ? "Contexto do curso atual aplicado automaticamente." : "Consultas em conteúdos públicos."}
        </p>
      </header>

      <main>
        <section aria-labelledby="chat" className="space-y-3">
          <div
            ref={listRef}
            className="h-[55vh] overflow-y-auto rounded-md border border-border p-4 space-y-3 bg-card"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">Digite sua pergunta abaixo para começar.</p>
            )}
            {messages.map((m, idx) => (
              <article key={idx} className="space-y-2">
                <div className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-block max-w-[85%] rounded-lg px-3 py-2 " +
                      (m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border")
                    }
                  >
                    <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                  </div>
                </div>
                {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                  <aside className="mt-1 text-xs text-muted-foreground">
                    <div className="font-medium">Fontes:</div>
                    <ul className="list-disc pl-4">
                      {m.citations.map((c: any, i: number) => (
                        <li key={i}>{(c.title || "Fonte")} — score {(c.score ?? 0).toFixed(3)}</li>
                      ))}
                    </ul>
                  </aside>
                )}
              </article>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 h-11 rounded-md border border-border bg-background px-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-md bg-primary text-primary-foreground border border-border disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CopilotPage;
