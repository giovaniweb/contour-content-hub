
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OPTIONS = [
  "Opção 1: Sim",
  "Opção 2: Não",
  "Opção 3: Prefiro não responder",
];

export default function ModalQuestion() {
  const [open, setOpen] = useState(false);

  const handleChoose = (option: string) => {
    localStorage.setItem("modalQuestionChoice", option);
    setOpen(false);
  };

  return (
    <>
      <Button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
        onClick={() => setOpen(true)}
      >
        Abrir Pergunta
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Qual dessas opções representa você?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            {OPTIONS.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => handleChoose(option)}
                className="justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
