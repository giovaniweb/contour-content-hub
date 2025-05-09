
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarPreferences } from '@/types/calendar';

// Re-export the type properly
export type { CalendarPreferences };

interface CalendarSettingsProps {
  onSave: (preferences: CalendarPreferences) => Promise<void>;
  onCancel: () => void;
  initialPreferences?: Partial<CalendarPreferences>;
}

const CalendarSettings: React.FC<CalendarSettingsProps> = ({
  onSave,
  onCancel,
  initialPreferences
}) => {
  const [preferences, setPreferences] = useState<CalendarPreferences>({
    defaultView: initialPreferences?.defaultView || 'month',
    firstDayOfWeek: initialPreferences?.firstDayOfWeek || 0,
    workingHours: initialPreferences?.workingHours || {
      start: '08:00',
      end: '18:00'
    },
    timeZone: initialPreferences?.timeZone || 'America/Sao_Paulo',
    showWeekends: initialPreferences?.showWeekends !== undefined ? initialPreferences.showWeekends : true,
    autoGenerate: initialPreferences?.autoGenerate !== undefined ? initialPreferences.autoGenerate : false,
    theme: initialPreferences?.theme || 'system',
    notifications: initialPreferences?.notifications || {
      email: true,
      push: true,
      desktop: true
    }
  });

  const handleSave = async () => {
    await onSave(preferences);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="defaultView">Visualização Padrão</Label>
          <Select 
            value={preferences.defaultView}
            onValueChange={(value: any) => setPreferences({ ...preferences, defaultView: value })}
          >
            <SelectTrigger id="defaultView">
              <SelectValue placeholder="Selecione uma visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstDayOfWeek">Primeiro Dia da Semana</Label>
          <Select 
            value={preferences.firstDayOfWeek.toString()}
            onValueChange={(value) => setPreferences({ ...preferences, firstDayOfWeek: parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 })}
          >
            <SelectTrigger id="firstDayOfWeek">
              <SelectValue placeholder="Selecione o primeiro dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Domingo</SelectItem>
              <SelectItem value="1">Segunda-feira</SelectItem>
              <SelectItem value="2">Terça-feira</SelectItem>
              <SelectItem value="3">Quarta-feira</SelectItem>
              <SelectItem value="4">Quinta-feira</SelectItem>
              <SelectItem value="5">Sexta-feira</SelectItem>
              <SelectItem value="6">Sábado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <Select 
            value={preferences.theme}
            onValueChange={(value: any) => setPreferences({ ...preferences, theme: value })}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Selecione um tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeZone">Fuso Horário</Label>
          <Select 
            value={preferences.timeZone}
            onValueChange={(value) => setPreferences({ ...preferences, timeZone: value })}
          >
            <SelectTrigger id="timeZone">
              <SelectValue placeholder="Selecione o fuso horário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Sao_Paulo">Horário de Brasília (GMT-3)</SelectItem>
              <SelectItem value="America/Manaus">Horário do Amazonas (GMT-4)</SelectItem>
              <SelectItem value="America/Rio_Branco">Horário do Acre (GMT-5)</SelectItem>
              <SelectItem value="America/Noronha">Horário de Fernando de Noronha (GMT-2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="showWeekends">Mostrar Finais de Semana</Label>
          <Switch 
            id="showWeekends" 
            checked={preferences.showWeekends}
            onCheckedChange={(checked) => setPreferences({ ...preferences, showWeekends: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="autoGenerate">Gerar Conteúdo Automaticamente</Label>
          <Switch 
            id="autoGenerate" 
            checked={preferences.autoGenerate}
            onCheckedChange={(checked) => setPreferences({ ...preferences, autoGenerate: checked })}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Notificações</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="emailNotifications">E-mail</Label>
            <Switch 
              id="emailNotifications" 
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, email: checked } 
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="pushNotifications">Push</Label>
            <Switch 
              id="pushNotifications" 
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, push: checked } 
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="desktopNotifications">Desktop</Label>
            <Switch 
              id="desktopNotifications" 
              checked={preferences.notifications.desktop}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, desktop: checked } 
                })
              }
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
};

export default CalendarSettings;
