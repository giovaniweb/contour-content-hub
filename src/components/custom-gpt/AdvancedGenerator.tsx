
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AdvancedGeneratorProps } from './types';
import AdvancedOptions from './AdvancedOptions';

const AdvancedGenerator: React.FC<AdvancedGeneratorProps> = ({
  form,
  selectedType,
  setSelectedType,
  selectedEquipment,
  setSelectedEquipment,
  equipments,
  equipmentsLoading,
  handleSubmit,
  isSubmitting
}) => {
  return (
    <>
      <div>
        <Label htmlFor="type">Tipo de Conteúdo</Label>
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roteiro">Roteiro para Vídeo</SelectItem>
            <SelectItem value="bigIdea">Big Idea</SelectItem>
            <SelectItem value="stories">Stories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="equipment">Equipamento</Label>
        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
          <SelectTrigger id="equipment">
            <SelectValue placeholder="Selecione o equipamento" />
          </SelectTrigger>
          <SelectContent>
            {equipmentsLoading ? (
              <SelectItem value="loading" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </SelectItem>
            ) : (
              equipments.map((equipment) => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.nome}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tópico</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Dicas de skincare" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tom de voz</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Entusiasmado, informativo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informações adicionais</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: Mencionar a importância da proteção solar"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AdvancedOptions form={form} />

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Gerar Conteúdo
          </>
        )}
      </Button>
    </>
  );
};

export default AdvancedGenerator;
