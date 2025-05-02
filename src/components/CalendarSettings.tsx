
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

// Define the correct interface for calendar preferences
export interface CalendarPreferences {
  frequency: "daily" | "weekly" | "biweekly";
  contentTypes: { 
    video: boolean; 
    story: boolean; 
    image: boolean 
  };
  equipment: string[];
  topics: string[];
  preferredDays: string[];
  audienceType: "general" | "specialized";
  // Add these fields to match what's used in Calendar.tsx
  postFrequency?: string;
  preferredTimes?: string[];
}

// Define the validation schema for the form
const formSchema = z.object({
  frequency: z.enum(["daily", "weekly", "biweekly"]),
  contentTypes: z.object({
    video: z.boolean().default(true),
    story: z.boolean().default(true),
    image: z.boolean().default(true)
  }),
  equipment: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  preferredDays: z.array(z.string()).default(["monday", "wednesday", "friday"]),
  audienceType: z.enum(["general", "specialized"])
});

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
  
  const form = useForm<CalendarPreferences>({
    resolver: zodResolver(formSchema),
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

  // Parse topics from string to string array
  const handleTopicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const topicsString = e.target.value;
    const topicsArray = topicsString.split(',').map(topic => topic.trim()).filter(topic => topic !== '');
    form.setValue("topics", topicsArray);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Frequência de Publicação</h3>
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
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
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tipos de Conteúdo</h3>
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="contentTypes.video"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Vídeos</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentTypes.story"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Stories</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentTypes.image"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Imagens</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topics">Tópicos Preferenciais (separados por vírgula)</Label>
            <Input 
              id="topics" 
              placeholder="Ex: tratamentos faciais, pele, procedimentos não-invasivos" 
              onChange={handleTopicsChange}
              defaultValue={defaultPreferences.topics.join(', ')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audienceType">Tipo de Audiência</Label>
            <FormField
              control={form.control}
              name="audienceType"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
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
                </FormItem>
              )}
            />
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
    </Form>
  );
};

export default CalendarSettings;
