import React, { useState } from "react";
import { CalendarCheck2, FileDown, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { exportElementAsPDF, exportElementAsImage, triggerDownload } from "@/utils/exportWeeklySchedule";
import SendToPlannerModal from "./SendToPlannerModal";
import { useContentPlanner } from "@/hooks/useContentPlanner";
import { ContentPlannerStatus, ContentFormat } from "@/types/content-planner";

export type DayPlan = {
  day: string;
  title: string;
  description: string;
  highlight?: boolean;
};

export interface SmartWeeklyScheduleProps {
  specialty: string;
  mainObjective: string;
  contentFrequency: string;
}

const WEEK_DAYS = [
  "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"
];

export const generateWeekPlan = (
  specialty: string,
  mainObjective: string,
  contentFrequency: string
): DayPlan[] => {
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

  return WEEK_DAYS.map((day, idx) => ({
    day,
    ...baseActions[idx % baseActions.length],
    highlight: idx === 0,
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
      const item = {
        title: day.title,
        description: `${day.description}\n\n🔗 Origem: Calendário Fluida (${day.day})`,
        status: 'idea' as ContentPlannerStatus,
        tags: [
          "fluida-smart-schedule",
          specialty?.toLowerCase().replace(/\s+/g, "-") || "clinica",
          day.day.toLowerCase()
        ],
        format: 'carrossel' as ContentFormat,
        objective: "🟡 Atrair Atenção",
        distribution: "Instagram" as const,
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
            variant="action"
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
          className={`
            grid gap-3 md:gap-2
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-7
            w-full
            transition-all
            mb-2
            overflow-x-auto
          `}
          style={{
            minWidth: 0,
          }}
        >
          {weekPlan.map((plan, idx) => (
            <div
              key={plan.day}
              className={`
                flex flex-col gap-1 flex-1
                bg-muted rounded-md border
                ${plan.highlight ? "border-aurora-sage bg-aurora-sage/10 shadow-lg" : "border-border"}
                p-2 md:p-3 min-w-0
              `}
            >
              <strong className="text-md text-aurora-sage truncate">{plan.day}</strong>
              <span className="font-medium text-foreground/90 text-sm leading-snug truncate">{plan.title}</span>
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
