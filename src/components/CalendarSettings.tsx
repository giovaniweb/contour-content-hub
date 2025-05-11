import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarPreferences } from '@/types/calendar';

interface CalendarSettingsProps {
  preferences: Partial<CalendarPreferences>;
  onPreferencesChange: (key: keyof CalendarPreferences, value: any) => void;
  onSave: (preferences: CalendarPreferences) => void;
  onCancel: () => void;
}

const CalendarSettings: React.FC<CalendarSettingsProps> = ({
  preferences,
  onPreferencesChange,
  onSave,
  onCancel,
}) => {
  const handleSave = () => {
    // Ensure all required fields have values with defaults
    const completePreferences: CalendarPreferences = {
      defaultView: preferences.defaultView || 'week',
      firstDayOfWeek: preferences.firstDayOfWeek !== undefined ? preferences.firstDayOfWeek : 0,
      showWeekends: preferences.showWeekends !== undefined ? preferences.showWeekends : true,
      autoGenerate: preferences.autoGenerate !== undefined ? preferences.autoGenerate : false,
      workingHours: {
        start: preferences.workingHours?.start || '09:00',
        end: preferences.workingHours?.end || '18:00',
      },
      notifications: {
        email: preferences.notifications?.email !== undefined ? preferences.notifications.email : true,
        push: preferences.notifications?.push !== undefined ? preferences.notifications.push : false,
        desktop: preferences.notifications?.desktop !== undefined ? preferences.notifications.desktop : false,
      },
    };
    
    onSave(completePreferences);
  };

  return (
    <div className="space-y-6 py-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultView">Visualização Padrão</Label>
          <Select 
            value={preferences.defaultView || 'week'} 
            onValueChange={(value) => onPreferencesChange('defaultView', value)}
          >
            <SelectTrigger id="defaultView">
              <SelectValue placeholder="Selecione a visualização padrão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstDayOfWeek">Primeiro Dia da Semana</Label>
          <Select 
            value={String(preferences.firstDayOfWeek || 0)} 
            onValueChange={(value) => onPreferencesChange('firstDayOfWeek', Number(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
          >
            <SelectTrigger id="firstDayOfWeek">
              <SelectValue placeholder="Selecione o primeiro dia da semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Domingo</SelectItem>
              <SelectItem value="1">Segunda</SelectItem>
              <SelectItem value="2">Terça</SelectItem>
              <SelectItem value="3">Quarta</SelectItem>
              <SelectItem value="4">Quinta</SelectItem>
              <SelectItem value="5">Sexta</SelectItem>
              <SelectItem value="6">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showWeekends">Exibir Final de Semana</Label>
          <Switch 
            id="showWeekends"
            checked={preferences.showWeekends}
            onCheckedChange={(checked) => onPreferencesChange('showWeekends', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="autoGenerate">Gerar Sugestões Automaticamente</Label>
          <Switch 
            id="autoGenerate"
            checked={preferences.autoGenerate}
            onCheckedChange={(checked) => onPreferencesChange('autoGenerate', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Horário de Trabalho</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workStart" className="text-xs text-muted-foreground">Início</Label>
              <Input 
                id="workStart"
                type="time"
                value={preferences.workingHours?.start || '09:00'}
                onChange={(e) => onPreferencesChange('workingHours', { 
                  ...preferences.workingHours, 
                  start: e.target.value 
                })}
              />
            </div>
            <div>
              <Label htmlFor="workEnd" className="text-xs text-muted-foreground">Fim</Label>
              <Input 
                id="workEnd"
                type="time"
                value={preferences.workingHours?.end || '18:00'}
                onChange={(e) => onPreferencesChange('workingHours', { 
                  ...preferences.workingHours, 
                  end: e.target.value 
                })}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Notificações</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif" className="text-sm">Email</Label>
              <Switch 
                id="emailNotif"
                checked={preferences.notifications?.email}
                onCheckedChange={(checked) => onPreferencesChange('notifications', { 
                  ...preferences.notifications, 
                  email: checked 
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotif" className="text-sm">Push</Label>
              <Switch 
                id="pushNotif"
                checked={preferences.notifications?.push}
                onCheckedChange={(checked) => onPreferencesChange('notifications', { 
                  ...preferences.notifications, 
                  push: checked 
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="desktopNotif" className="text-sm">Desktop</Label>
              <Switch 
                id="desktopNotif"
                checked={preferences.notifications?.desktop}
                onCheckedChange={(checked) => onPreferencesChange('notifications', { 
                  ...preferences.notifications, 
                  desktop: checked 
                })}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </div>
  );
};

export default CalendarSettings;
