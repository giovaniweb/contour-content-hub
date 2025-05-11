
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarPreferences } from '@/types/calendar';
import { useForm } from 'react-hook-form';

interface CalendarSettingsProps {
  onSave: (preferences: CalendarPreferences) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<CalendarPreferences>;
}

const CalendarSettings: React.FC<CalendarSettingsProps> = ({
  onSave,
  onCancel,
  initialValues = {}
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultValues: CalendarPreferences = {
    defaultView: initialValues.defaultView || 'month',
    firstDayOfWeek: initialValues.firstDayOfWeek || 0,
    showWeekends: initialValues.showWeekends !== false,
    autoScheduleSuggestions: initialValues.autoScheduleSuggestions !== false,
    reminderTime: initialValues.reminderTime || '1h',
  };
  
  const form = useForm<CalendarPreferences>({
    defaultValues
  });
  
  const handleSubmit = async (values: CalendarPreferences) => {
    try {
      setIsSaving(true);
      await onSave(values);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="defaultView"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visualização Padrão</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma visualização" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Como o calendário será exibido quando você abrir a página
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="firstDayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primeiro Dia da Semana</FormLabel>
              <RadioGroup
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="0" />
                  </FormControl>
                  <FormLabel className="font-normal">Domingo</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1" />
                  </FormControl>
                  <FormLabel className="font-normal">Segunda</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="showWeekends"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Mostrar Fins de Semana</FormLabel>
                <FormDescription>
                  Exibir sábados e domingos no calendário
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autoScheduleSuggestions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Sugestões Automáticas</FormLabel>
                <FormDescription>
                  Receber sugestões de agendamento baseadas em padrões de conteúdo
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="reminderTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempo de Lembretes</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tempo antes do evento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30m">30 minutos antes</SelectItem>
                  <SelectItem value="1h">1 hora antes</SelectItem>
                  <SelectItem value="3h">3 horas antes</SelectItem>
                  <SelectItem value="1d">1 dia antes</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CalendarSettings;
