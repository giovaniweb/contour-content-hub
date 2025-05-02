
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitFeedback: (feedback: string, approved: boolean) => void;
  isSubmitting: boolean;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onOpenChange,
  onSubmitFeedback,
  isSubmitting
}) => {
  const [feedback, setFeedback] = useState("");
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    onSubmitFeedback(feedback, approved);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      // Reset form when closing
      setFeedback("");
      setApproved(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback do Roteiro</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="approved" 
              checked={approved} 
              onCheckedChange={setApproved}
              disabled={isSubmitting}
            />
            <Label htmlFor="approved" className="flex items-center gap-1">
              {approved ? (
                <>
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>Aprovar este roteiro</span>
                </>
              ) : (
                <>
                  <ThumbsDown className="h-4 w-4 text-orange-500" />
                  <span>Precisa de revisão</span>
                </>
              )}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Seu feedback</Label>
            <Textarea
              id="feedback"
              placeholder="O que você gostou? O que precisa melhorar?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
