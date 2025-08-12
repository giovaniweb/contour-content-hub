
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminAIPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; citations: any[] } | null>(null);

  const runSmokeTest = async () => {
    try {
      setLoading(true);
      setResult(null);
      toast.info("Iniciando ingestão de conhecimento...");

      const ingestPayload = {
        source: {
          title: "Smoke Test — Copilot (Auto)",
          description: "Fonte de teste rápida para validar ingestão e consulta.",
          is_public: true,
          language: "pt-BR",
        },
        text:
          "A criolipólise é um procedimento estético não invasivo que utiliza resfriamento controlado para reduzir gordura localizada. " +
          "O resfriamento induz apoptose dos adipócitos, que são eliminados gradualmente pelo organismo ao longo de semanas.",
      };

      const { data: ingestData, error: ingestError } = await supabase.functions.invoke("ingest-knowledge", {
        body: ingestPayload,
      });
      if (ingestError) throw ingestError;

      toast.success(`Ingestão concluída (${ingestData?.chunks_created || 0} chunks). Consultando...`);

      const { data: queryData, error: queryError } = await supabase.functions.invoke("copilot-query", {
        body: {
          query: "O que é criolipólise e como ela funciona?",
          top_k: 4,
          session_id: null,
        },
      });
      if (queryError) throw queryError;

      setResult(queryData as any);
      toast.success("Consulta concluída com sucesso!");
    } catch (err: any) {
      console.error("Smoke test error:", err);
      toast.error(`Falha no smoke test: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Painel de IA — Teste Copilot | FLUIDA</title>
        <meta name="description" content="Painel de IA para ingestão e consulta do Copilot com OpenAI." />
        <link rel="canonical" href="/admin/ai-panel" />
      </Helmet>

      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Painel de IA</h1>
        <p className="mb-4">Gerenciamento de recursos e configurações de IA.</p>

        <section aria-labelledby="smoke-test" className="space-y-4">
          <h2 id="smoke-test" className="text-xl font-semibold">Smoke test (ingest + consulta)</h2>
          <button
            onClick={runSmokeTest}
            disabled={loading}
            className="inline-flex items-center rounded-md px-4 py-2 border hover:bg-black/5 transition"
          >
            {loading ? "Executando..." : "Executar smoke test agora"}
          </button>

          {result && (
            <article className="rounded-lg border p-4 space-y-3">
              <h3 className="text-lg font-semibold">Resposta</h3>
              <p>{result.answer}</p>
              <aside>
                <h4 className="font-medium">Fontes</h4>
                <ul className="list-disc pl-5">
                  {result.citations?.map((c: any, idx: number) => (
                    <li key={idx}>
                      {(c.title || "Fonte")} — score {(c.score ?? 0).toFixed(3)}
                    </li>
                  ))}
                </ul>
              </aside>
            </article>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminAIPanel;

