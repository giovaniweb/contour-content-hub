
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useCopilotChat } from "@/hooks/useCopilotChat";

interface CopilotInlinePanelProps {
  lessonId: string;
  courseTitle: string;
  lessonTitle: string;
  vimeoUrl?: string;
}

const CopilotInlinePanel: React.FC<CopilotInlinePanelProps> = ({ lessonId, courseTitle, lessonTitle, vimeoUrl }) => {
  const { messages, sendMessage, loading, courseId } = useCopilotChat({ lessonId });
  const [input, setInput] = useState("");
  const [indexed, setIndexed] = useState<boolean | null>(null);
  const [showIndexer, setShowIndexer] = useState(false); // fallback manual somente se necessário
  const [transcript, setTranscript] = useState("");
  const [autoIndexing, setAutoIndexing] = useState(false);
  const [autoIndexError, setAutoIndexError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIndexed = async () => {
      if (!courseId || !lessonId) return;
      const { data, error } = await supabase
        .from("ai_knowledge_sources")
        .select("id")
        .eq("course_id", courseId)
        .eq("lesson_id", lessonId)
        .limit(1)
        .maybeSingle();
      if (error) {
        console.warn("Falha ao verificar conteúdo indexado:", error.message);
        setIndexed(false);
        return;
      }
      setIndexed(!!data);
    };
    checkIndexed();
  }, [courseId, lessonId]);

  useEffect(() => {
    // Dispara indexação automática quando não houver conteúdo indexado
    const runAutoIngest = async () => {
      if (indexed !== false) return;
      if (!courseId || !lessonId || !vimeoUrl) {
        // Sem dados suficientes para auto-indexar; cairá no fallback manual
        setShowIndexer(true);
        return;
      }
      setAutoIndexing(true);
      setAutoIndexError(null);
      try {
        const { data, error } = await supabase.functions.invoke("auto-ingest-lesson", {
          body: {
            course_id: courseId,
            lesson_id: lessonId,
            title: `${courseTitle} — ${lessonTitle}`,
            vimeo_url: vimeoUrl,
            language: "pt-BR",
          },
        });
        if (error) throw error;

        const res = data as any;
        if (res?.success || res?.alreadyIndexed) {
          toast.success("Conteúdo da aula indexado automaticamente.");
          setAutoIndexError(null);
          setIndexed(true);
          setShowIndexer(false);
        } else if (res?.noTranscript) {
          toast.warning("Não foi encontrada transcrição no Vimeo para esta aula. Você pode colar a transcrição manualmente.");
          setShowIndexer(true);
        } else {
          toast.warning("Não foi possível indexar automaticamente. Tente o modo manual.");
          setShowIndexer(true);
        }
      } catch (err: any) {
        console.error("Falha na indexação automática:", err);
        const isNetwork = err?.message?.includes("Failed to send a request") || err?.message?.includes("Failed to fetch");
        const msg = isNetwork
          ? "Não foi possível contatar a função de indexação (Edge Function). Usando modo manual."
          : (err?.message || "Falha ao indexar automaticamente. Usando modo manual.");
        setAutoIndexError(msg);
        toast.error(msg);
        setShowIndexer(true);
      } finally {
        setAutoIndexing(false);
      }
    };
    runAutoIngest();
  }, [indexed, courseId, lessonId, vimeoUrl, courseTitle, lessonTitle]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput("");
    requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
  };

  const handleIndex = async () => {
    if (!courseId) {
      toast.error("Curso não identificado na rota");
      return;
    }
    if (!transcript.trim()) {
      toast.error("Cole a transcrição ou texto da aula");
      return;
    }
    try {
      const { error } = await supabase.functions.invoke("ingest-knowledge", {
        body: {
          source: {
            title: `${courseTitle} — ${lessonTitle}`,
            course_id: courseId,
            lesson_id: lessonId,
            language: "pt-BR",
            is_public: false,
          },
          transcript,
        },
      });
      if (error) throw error;
      toast.success("Conteúdo indexado com sucesso");
      setIndexed(true);
      setShowIndexer(false);
      setTranscript("");
    } catch (err: any) {
      console.error("Falha ao indexar conteúdo:", err);
      toast.error(err?.message || "Falha ao indexar conteúdo");
    }
  };

  return (
    <Card className="aurora-glass border-aurora-electric-purple/20">
      <CardHeader>
        <CardTitle className="text-white">Fluida Academy</CardTitle>
      </CardHeader>
      <CardContent>
        {indexed === false && (
          <div className="mb-4 rounded-md border border-border bg-card p-3 text-sm">
            {autoIndexError && !autoIndexing && (
              <div className="mb-2 text-red-300">{autoIndexError}</div>
            )}
            {autoIndexing ? (
              <div className="flex items-center justify-between">
                <div>Indexando conteúdo da aula automaticamente...</div>
                <div className="animate-pulse text-white/70">Aguarde</div>
              </div>
            ) : showIndexer ? (
              <>
                <div className="mb-2">Nenhuma transcrição foi encontrada automaticamente. Você pode colar o texto para indexar:</div>
                <textarea
                  className="w-full h-32 rounded-md border border-border bg-background p-2 text-sm"
                  placeholder="Cole aqui a transcrição/texto da aula (pt-BR)"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={handleIndex}>Confirmar indexação</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowIndexer(false)}>Cancelar</Button>
                </div>
              </>
            ) : (
              <div>Nenhum conteúdo desta aula foi indexado ainda.</div>
            )}
          </div>
        )}

        <div
          ref={listRef}
          className="h-72 overflow-y-auto rounded-md border border-border p-3 space-y-3 bg-card"
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
                    : "bg-muted text-foreground border border-border")
                }
              >
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </div>
              {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                <div className="mt-2 text-xs text-white/70">
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
            placeholder="Pergunte sobre esta aula..."
            className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
          />
          <Button type="submit" disabled={loading} className="inline-flex items-center gap-2 h-10">
            <Send className="h-4 w-4" />
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CopilotInlinePanel;
