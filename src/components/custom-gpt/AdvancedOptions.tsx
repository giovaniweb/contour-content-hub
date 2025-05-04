import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import VideoObjectiveSelector from "@/components/admin/VideoObjectiveSelector";
import BodyAreaSelector from '@/components/script-generator/BodyAreaSelector';
import PurposeSelector from '@/components/script-generator/PurposeSelector';
import { MarketingObjectiveType } from '@/types/script';

interface AdvancedOptionsProps {
  form: UseFormReturn<any>;
  bodyAreas: Array<{ value: string; label: string }>;
  purposes: Array<{ value: string; label: string }>;
  selectedPurposes: string[];
  onPurposeChange: (value: string) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  form,
  bodyAreas,
  purposes,
  selectedPurposes,
  onPurposeChange
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Tema/Assunto Principal */}
      <AccordionItem value="topic">
        <AccordionTrigger>Tema/Assunto Principal</AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tema/Assunto</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Tratamento para flacidez facial" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* Objetivo de Marketing */}
      <AccordionItem value="marketingObjective">
        <AccordionTrigger>Objetivo de Marketing</AccordionTrigger>
        <AccordionContent>
          <VideoObjectiveSelector
            value={form.watch('marketingObjective') as MarketingObjectiveType}
            onValueChange={(value) => form.setValue('marketingObjective', value)}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* Área do Corpo */}
      <AccordionItem value="bodyArea">
        <AccordionTrigger>Área do Corpo</AccordionTrigger>
        <AccordionContent>
          <BodyAreaSelector
            bodyAreas={bodyAreas}
            value={form.watch('bodyArea') as string}
            onValueChange={(value) => form.setValue('bodyArea', value)}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* Finalidade do Tratamento */}
      <AccordionItem value="purposes">
        <AccordionTrigger>Finalidade do Tratamento</AccordionTrigger>
        <AccordionContent>
          <PurposeSelector
            purposes={purposes}
            selectedPurposes={selectedPurposes}
            onPurposeChange={onPurposeChange}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* Informações Adicionais */}
      <AccordionItem value="additionalInfo">
        <AccordionTrigger>Informações Adicionais</AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Detalhes específicos, pontos-chave, públicos especiais, etc."
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedOptions;
