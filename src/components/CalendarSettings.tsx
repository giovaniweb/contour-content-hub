
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarPreferences } from "@/utils/api";
import { DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface CalendarSettingsProps {
  onSave: (preferences: CalendarPreferences) => Promise<void>;
  onCancel: () => void;
}

const CalendarSettings: React.FC<CalendarSettingsProps> = ({ onSave, onCancel }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  
  const defaultPreferences: CalendarPreferences = {
    frequency: "weekly",
    contentTypes: { video: true, story: true, image: true },
    equipment: [],
    topics: [],
    preferredDays: ["monday", "wednesday", "friday"],
    audienceType: "general"
  };
  
  const form = useForm({
    defaultValues: defaultPreferences
  });

  const handleSubmit = async (data: CalendarPreferences) => {
    try {
      setIsSaving(true);
      await onSave(data);
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Frequência de Publicação</h3>
          <RadioGroup 
            defaultValue="weekly" 
            className="flex flex-col space-y-2"
            {...form.register("frequency")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Diária (alta frequência)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Semanal (frequência média)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="biweekly" id="biweekly" />
              <Label htmlFor="biweekly">Quinzenal (baixa frequência)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Tipos de Conteúdo</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="video" 
                defaultChecked 
                {...form.register("contentTypes.video")} 
              />
              <Label htmlFor="video">Vídeos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="stories"  
                defaultChecked 
                {...form.register("contentTypes.story")} 
              />
              <Label htmlFor="stories">Stories</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="images" 
                defaultChecked 
                {...form.register("contentTypes.image")} 
              />
              <Label htmlFor="images">Imagens</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="topics">Tópicos Preferenciais (separados por vírgula)</Label>
          <Input 
            id="topics" 
            placeholder="Ex: tratamentos faciais, pele, procedimentos não-invasivos" 
            {...form.register("topics")} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="audienceType">Tipo de Audiência</Label>
          <RadioGroup 
            defaultValue="general" 
            className="flex flex-col space-y-2"
            {...form.register("audienceType")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="general" id="general" />
              <Label htmlFor="general">Público Geral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specialized" id="specialized" />
              <Label htmlFor="specialized">Profissionais da Área</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Preferências"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CalendarSettings;
