import React, { useRef, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Bot, Send } from "lucide-react";
import { useCopilotChat } from "@/hooks/useCopilotChat";

const UserCopilotWidget: React.FC = () => {
  const { messages, sendMessage, loading, courseId } = useCopilotChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-4 right-4 z-50">
        <DrawerTrigger asChild>
          <button
            className="rounded-full px-4 py-3 bg-primary text-primary-foreground shadow-lg border border-border hover:opacity-90 transition"
            aria-label="Abrir Fluida Academy"
          >
            <span className="inline-flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span>Fluida Academy</span>
            </span>
          </button>
        </DrawerTrigger>
      </div>

      <DrawerContent className="bg-background text-foreground border-border">
        <DrawerHeader>
          <DrawerTitle>Fluida Academy</DrawerTitle>
          <DrawerDescription>
            Faça uma pergunta. {courseId ? "Contexto: Curso atual" : "Conteúdo público"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <div
            ref={listRef}
            className="h-[50vh] overflow-y-auto rounded-md border border-border p-3 space-y-3 bg-card"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">Digite sua pergunta abaixo para começar.</p>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
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
                {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
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
              className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserCopilotWidget;
