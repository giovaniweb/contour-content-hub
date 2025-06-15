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
    <Card className="aurora-card border border-aurora-sage/30 overflow-hidden w-full max-w-full">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between pb-1 gap-2 md:gap-2 flex-wrap">
        <div className="flex gap-2 items-center min-w-0 w-full md:w-auto">
          <CalendarCheck2 className="h-5 w-5 text-aurora-sage flex-shrink-0" />
          <CardTitle className="aurora-heading text-base md:text-lg font-semibold truncate">
            Calendário Semanal Inteligente
          </CardTitle>
          <Badge variant="outline" className="border-aurora-sage text-aurora-sage font-normal ml-2 whitespace-nowrap">
            Execução Fluida
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end mt-2 md:mt-0">
          <Button
            variant="outline"
            onClick={handleExportPdf}
            size="sm"
            className="gap-1 text-xs border-aurora-sage px-2"
            disabled={exporting}
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleExportImagem}
            size="sm"
            className="gap-1 text-xs border-aurora-sage px-2"
            disabled={exporting}
          >
            <FileDown className="h-4 w-4" />
            PNG
          </Button>
          <Button
            variant="action"
            onClick={() => {
              setSentCount(undefined);
              setModalOpen(true);
            }}
            size="sm"
            className="gap-1 text-xs px-2"
          >
            <Send className="h-4 w-4" />
            Enviar ao Planner
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-1 px-1 sm:px-2 md:px-4">
        <div
          id={SCHEDULE_ELEMENT_ID}
          className={`
            grid gap-2 sm:gap-2
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            w-full
            transition-all
            mb-2
            overflow-x-auto
            max-w-full
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
                p-2 sm:p-2 md:p-3 min-w-0
              `}
              style={{
                wordBreak: "break-word",
                minHeight: 96,
                minWidth: 0, // crítico: impede que cada coluna force largura
                maxWidth: "100%",
              }}
            >
              <div className="text-xs font-medium text-aurora-sage truncate mb-0">{plan.day}</div>
              <div className="font-semibold text-foreground/90 text-xs md:text-sm leading-snug truncate">
                {plan.title}
              </div>
              <div className="text-xs md:text-xs text-muted-foreground leading-tight line-clamp-2">
                {plan.description}
              </div>
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
