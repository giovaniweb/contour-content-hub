import React from "react";
import { CalendarCheck2, FileDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { exportElementAsPDF, exportElementAsImage, triggerDownload } from "@/utils/exportWeeklySchedule";
import { useState } from "react";

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
  const weekPlan = generateWeekPlan(specialty, mainObjective, contentFrequency);

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
    </Card>
  );
};

export default SmartWeeklySchedule;
