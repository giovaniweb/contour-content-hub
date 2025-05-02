
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScriptType, MarketingObjectiveType } from "@/utils/api";
import VideoObjectiveSelector from "@/components/admin/VideoObjectiveSelector";
import EquipmentSelector from "./EquipmentSelector";
import BodyAreaSelector from "./BodyAreaSelector";
import PurposeSelector from "./PurposeSelector";
import ToneSelector from "./ToneSelector";

// List of equipment options
const equipmentOptions = [
  { id: "adella", label: "Adélla Laser" },
  { id: "enygma", label: "Enygma X-Orbital" },
  { id: "focuskin", label: "Focuskin" },
  { id: "hipro", label: "Hipro" },
  { id: "hive", label: "Hive Pro" },
  { id: "crystal", label: "Laser Crystal 3D Plus" },
  { id: "multi", label: "MultiShape" },
  { id: "reverso", label: "Reverso" },
  { id: "supreme", label: "Supreme Pro" },
  { id: "ultralift", label: "Ultralift - Endolaser" },
  { id: "unyque", label: "Unyque PRO" },
  { id: "xtonus", label: "X-Tonus" },
];

// Areas of the body
const bodyAreas = [
  { value: "face", label: "Face" },
  { value: "pescoco", label: "Pescoço" },
  { value: "abdomen", label: "Abdômen" },
  { value: "coxas", label: "Coxas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "bracos", label: "Braços" },
  { value: "corpotodo", label: "Corpo todo" },
];

// Treatment purposes
const purposes = [
  { value: "rugas", label: "Rugas" },
  { value: "emagrecimento", label: "Emagrecimento" },
  { value: "tonificacao", label: "Tonificação" },
  { value: "hidratacao", label: "Hidratação" },
  { value: "flacidez", label: "Flacidez" },
  { value: "gordura", label: "Gordura localizada" },
  { value: "lipedema", label: "Lipedema" },
  { value: "sarcopenia", label: "Sarcopenia" },
];

interface ScriptFormProps {
  scriptType: ScriptType;
  topic: string;
  setTopic: (value: string) => void;
  selectedEquipment: string[];
  setSelectedEquipment: (value: string[]) => void;
  bodyArea: string;
  setBodyArea: (value: string) => void;
  selectedPurposes: string[];
  setSelectedPurposes: (value: string[]) => void;
  additionalInfo: string;
  setAdditionalInfo: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  marketingObjective: MarketingObjectiveType | undefined;
  setMarketingObjective: (value: MarketingObjectiveType) => void;
  isGenerating: boolean;
  handleGenerateScript: (event: React.FormEvent) => void;
  resetForm: () => void;
  generatedScript: any;
}

const ScriptForm: React.FC<ScriptFormProps> = ({
  scriptType,
  topic,
  setTopic,
  selectedEquipment,
  setSelectedEquipment,
  bodyArea,
  setBodyArea,
  selectedPurposes,
  setSelectedPurposes,
  additionalInfo,
  setAdditionalInfo,
  tone,
  setTone,
  marketingObjective,
  setMarketingObjective,
  isGenerating,
  handleGenerateScript,
  resetForm,
  generatedScript,
}) => {
  // Handle checkbox change for equipment
  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(
      selectedEquipment.includes(value)
        ? selectedEquipment.filter((item) => item !== value)
        : [...selectedEquipment, value]
    );
  };

  // Handle checkbox change for purposes
  const handlePurposeChange = (value: string) => {
    setSelectedPurposes(
      selectedPurposes.includes(value)
        ? selectedPurposes.filter((item) => item !== value)
        : [...selectedPurposes, value]
    );
  };

  return (
    <form onSubmit={handleGenerateScript} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Tema/Assunto Principal*</Label>
        <Input
          id="topic"
          placeholder="Ex: Tratamento para flacidez facial"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <VideoObjectiveSelector
        value={marketingObjective}
        onValueChange={setMarketingObjective}
        className="pt-2"
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="equipment">
          <AccordionTrigger>Equipamentos</AccordionTrigger>
          <AccordionContent>
            <EquipmentSelector 
              equipmentOptions={equipmentOptions}
              selectedEquipment={selectedEquipment}
              onEquipmentChange={handleEquipmentChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bodyArea">
          <AccordionTrigger>Área do Corpo</AccordionTrigger>
          <AccordionContent>
            <BodyAreaSelector 
              bodyAreas={bodyAreas}
              value={bodyArea}
              onValueChange={setBodyArea}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="purpose">
          <AccordionTrigger>Finalidade do Tratamento</AccordionTrigger>
          <AccordionContent>
            <PurposeSelector 
              purposes={purposes}
              selectedPurposes={selectedPurposes}
              onPurposeChange={handlePurposeChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additionalInfo">
          <AccordionTrigger>Informações Adicionais</AccordionTrigger>
          <AccordionContent>
            <Textarea
              id="additionalInfo"
              placeholder="Detalhes específicos, pontos-chave, públicos especiais, etc."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tone">
          <AccordionTrigger>Tom da Comunicação</AccordionTrigger>
          <AccordionContent>
            <ToneSelector value={tone} onValueChange={setTone} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isGenerating || !marketingObjective}>
          {isGenerating ? "Gerando..." : "Gerar Roteiro"}
        </Button>
        {generatedScript && (
          <Button type="button" variant="outline" onClick={resetForm}>
            Novo Roteiro
          </Button>
        )}
      </div>
    </form>
  );
};

export default ScriptForm;
