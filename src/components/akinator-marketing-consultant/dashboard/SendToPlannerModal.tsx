
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";

interface SendToPlannerModalProps {
  open: boolean;
  onClose: () => void;
  weekPlan: { day: string; title: string; description: string; highlight?: boolean }[];
  loading: boolean;
  onConfirm: () => void;
  resultCount?: number;
}

const SendToPlannerModal: React.FC<SendToPlannerModalProps> = ({
  open,
  onClose,
  weekPlan,
  loading,
  onConfirm,
  resultCount
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-aurora-sage" />
            Adicionar semana ao Planner?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-muted-foreground text-sm">
            Os seguintes dias serão enviados como ideias para o Content Planner:
          </p>
          <ul className="grid gap-2">
            {weekPlan.map((plan, idx) => (
              <li
                key={idx}
                className={`flex flex-col border rounded-md p-2 bg-muted/50
                  ${plan.highlight ? "border-aurora-sage bg-aurora-sage/10" : "border-border/50"}
                `}
              >
                <span>
                  <Badge variant={plan.highlight ? "default" : "outline"} className={plan.highlight ? "bg-aurora-sage/80" : "border-aurora-sage text-aurora-sage"}>
                    {plan.day}
                  </Badge>{" "}
                  <span className="font-semibold">{plan.title}</span>
                </span>
                <span className="text-xs text-muted-foreground">{plan.description}</span>
              </li>
            ))}
          </ul>
          {typeof resultCount === "number" && (
            <div className="flex items-center gap-2 mt-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" /> {resultCount} itens enviados com sucesso!
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="aurora" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            Enviar para o Planner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendToPlannerModal;
