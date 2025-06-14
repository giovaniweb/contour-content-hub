import React, { useState } from "react";
import { CalendarCheck2, FileDown, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { exportElementAsPDF, exportElementAsImage, triggerDownload } from "@/utils/exportWeeklySchedule";
import SendToPlannerModal from "./SendToPlannerModal";
import { useContentPlanner } from "@/hooks/useContentPlanner";

type DayPlan = {
  day: string;
  title: string;
  description: string;
  highlight?: boolean;
};

interface SmartWeeklyScheduleProps {
  specialty: string;
  mainObjective: string;
  contentFrequency: string;
}

const WEEK_DAYS = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
];

const generateWeekPlan = (
  specialty: string,
  mainObjective: string,
  contentFrequency: string
): DayPlan[] => {
  // Sugestão básica para exemplo, poderá usar diagnósticos personalizados
  const baseActions = [
    {
      title: `Post educativo sobre ${specialty}`,
      description: "Destaque uma informação didática relevante.",
    },
    {
      title: "Depoimento de paciente",
      description: "Compartilhe um resultado recente ou história inspiradora.",
    },
    {
      title: `Dica prática de ${specialty}`,
      description: "Mostre um cuidado ou rotina que o público possa adotar.",
    },
    {
      title: "Bastidores ou rotina da clínica",
      description: "Mostre os cuidados, equipe e ambiente.",
    },
    {
      title: `Foco: ${mainObjective}`,
      description: "Postagem alinhada com objetivo-chave da semana.",
    },
    {
      title: "Enquete ou interação",
      description: "Chame a audiência para opinar ou interagir.",
    },
    {
      title: "Revisão e convite para ação",
      description: "Retome assuntos da semana e chame para agendar consulta.",
    }
  ];

  // Frequência pode ajustar highlights ou simplificar futuro ajuste
  return WEEK_DAYS.map((day, idx) => ({
    day,
    ...baseActions[idx % baseActions.length],
    highlight: idx === 0, // Marca segunda-feira como destaque
  }));
};

const SCHEDULE_ELEMENT_ID = "fluida-calendar-preview";

const SmartWeeklySchedule: React.FC<SmartWeeklyScheduleProps> = ({
  specialty,
  mainObjective,
  contentFrequency
}) => {
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | undefined>(undefined);

  const weekPlan = generateWeekPlan(specialty, mainObjective, contentFrequency);

  const { addItem } = useContentPlanner();

  // Exportação (PDF/imagem) - já implementado
  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const blob = await exportElementAsPDF(SCHEDULE_ELEMENT_ID, "Calendario-Semanal-Fluida");
      if (blob) {
        triggerDownload(blob, "Calendario-Semanal-Fluida.pdf");
        toast.success("🎉 Calendário exportado!", {
          description: "Seu calendário foi baixado em PDF."
        });
      } else {
        toast.error("Erro ao exportar", { description: "Não foi possível gerar o PDF." });
      }
    } catch (err) {
      toast.error("Erro inesperado na exportação.");
    }
    setExporting(false);
  };

  const handleExportImagem = async () => {
    setExporting(true);
    try {
      const blob = await exportElementAsImage(SCHEDULE_ELEMENT_ID);
      if (blob) {
        triggerDownload(blob, "Calendario-Semanal-Fluida.png");
        toast.success("Imagem exportada!", {
          description: "Imagem do calendário salva para compartilhamento."
        });
      } else {
        toast.error("Erro ao exportar imagem");
      }
    } catch {
      toast.error("Erro inesperado ao exportar imagem.");
    }
    setExporting(false);
  };

  // NOVO: Envio do plano semanal ao Content Planner
  const handleSendWeekToPlanner = async () => {
    setSending(true);
    let successCount = 0;
    for (const day of weekPlan) {
      // Convertemos para formato do ContentPlannerItem (simples)
      // Aqui você pode customizar para mentor, tipo, etc. — fluxo inicial:
      const item = {
        title: day.title,
        description: `${day.description}\n\n🔗 Origem: Calendário Fluida (${day.day})`,
        status: "idea",
        tags: [
          "fluida-smart-schedule",
          specialty?.toLowerCase().replace(/\s+/g, "-") || "clinica",
          day.day.toLowerCase()
        ],
        format: "carrossel",
        objective: "🟡 Atrair Atenção",
        distribution: "Instagram",
        aiGenerated: true
      };
      const createdItem = await addItem(item);
      if (createdItem) successCount++;
    }
    setSentCount(successCount);
    setSending(false);
    toast.success("Semana enviada para o Planner!", {
      description: `${successCount} sugestões adicionadas ao Content Planner!`,
      action: {
        label: "Ver Planejador",
        onClick: () => window.open('/content-planner', '_blank')
      }
    });
  };

  return (
    <Card className="aurora-card border border-aurora-sage/30 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-1 gap-2">
        <div className="flex gap-2 items-center">
          <CalendarCheck2 className="h-5 w-5 text-aurora-sage" />
          <CardTitle className="aurora-heading text-lg font-semibold">
            Calendário Semanal Inteligente
          </CardTitle>
          <Badge variant="outline" className="border-aurora-sage text-aurora-sage font-normal ml-2">
            Execução Fluida
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportPdf}
            size="sm"
            className="gap-2 text-xs border-aurora-sage"
            disabled={exporting}
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleExportImagem}
            size="sm"
            className="gap-2 text-xs border-aurora-sage"
            disabled={exporting}
          >
            <FileDown className="h-4 w-4" />
            Exportar Imagem
          </Button>
          <Button
            variant="aurora"
            onClick={() => {
              setSentCount(undefined);
              setModalOpen(true);
            }}
            size="sm"
            className="gap-2 text-xs"
          >
            <Send className="h-4 w-4" />
            Enviar Semana ao Planner
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-1">
        <div
          id={SCHEDULE_ELEMENT_ID}
          className="flex flex-col md:flex-row gap-3 md:gap-2 justify-between bg-white/90 md:bg-transparent rounded-lg p-2"
        >
          {weekPlan.map((plan, idx) => (
            <div
              key={plan.day}
              className={`
                flex-1 bg-muted rounded-md p-3 min-w-[130px] border
                ${plan.highlight ? "border-aurora-sage bg-aurora-sage/10 shadow-lg" : "border-border"}
                flex flex-col gap-1
              `}
            >
              <strong className="text-md text-aurora-sage">{plan.day}</strong>
              <span className="font-medium text-foreground/90 text-sm">{plan.title}</span>
              <span className="text-xs text-muted-foreground">{plan.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <SendToPlannerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        weekPlan={weekPlan}
        loading={sending}
        onConfirm={async () => {
          await handleSendWeekToPlanner();
        }}
        resultCount={sentCount}
      />
    </Card>
  );
};

export default SmartWeeklySchedule;
