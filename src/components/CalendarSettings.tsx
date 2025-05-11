
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { CalendarPreferences } from '@/types/calendar';

interface CalendarSettingsProps {
  preferences?: Partial<CalendarPreferences>;
  onPreferencesChange?: (key: keyof CalendarPreferences, value: any) => void;
  onSavePreferences?: () => void;
  onSave?: (preferences: CalendarPreferences) => Promise<void>;
  onCancel?: () => void;
}

const CalendarSettings: React.FC<CalendarSettingsProps> = ({ 
  preferences = {}, 
  onPreferencesChange,
  onSavePreferences,
  onSave,
  onCancel
}) => {
  const [localPreferences, setLocalPreferences] = useState<Partial<CalendarPreferences>>(preferences);

  const handleChange = (key: keyof CalendarPreferences, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
    if (onPreferencesChange) {
      onPreferencesChange(key, value);
    }
  };
  
  const handleSave = async () => {
    if (onSave) {
      await onSave(localPreferences as CalendarPreferences);
    } else if (onSavePreferences) {
      onSavePreferences();
    }
    
    toast({
      title: "Preferências salvas",
      description: "Suas configurações de calendário foram atualizadas com sucesso."
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações do Calendário</CardTitle>
        <CardDescription>Personalize o calendário de acordo com suas preferências</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="defaultView">Visualização padrão</Label>
            <Select 
              value={localPreferences.defaultView || 'week'} 
              onValueChange={(value) => handleChange('defaultView', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Escolha a visualização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="firstDayOfWeek">Primeiro dia da semana</Label>
            <Select 
              value={String(localPreferences.firstDayOfWeek || 0)} 
              onValueChange={(value) => handleChange('firstDayOfWeek', parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Escolha o dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Domingo</SelectItem>
                <SelectItem value="1">Segunda-feira</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showWeekends">Mostrar finais de semana</Label>
              <p className="text-sm text-muted-foreground">Exibir sábado e domingo no calendário</p>
            </div>
            <Switch 
              id="showWeekends" 
              checked={localPreferences.showWeekends ?? true}
              onCheckedChange={(checked) => handleChange('showWeekends', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoGenerate">Geração automática</Label>
              <p className="text-sm text-muted-foreground">Gerar sugestões de conteúdo automaticamente</p>
            </div>
            <Switch 
              id="autoGenerate" 
              checked={localPreferences.autoGenerate ?? false}
              onCheckedChange={(checked) => handleChange('autoGenerate', checked)}
            />
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">Horário de trabalho</Label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="workingHoursStart" className="text-sm text-muted-foreground">Início</Label>
              <Select 
                value={localPreferences.workingHours?.start || '09:00'} 
                onValueChange={(value) => handleChange('workingHours', {
                  ...(localPreferences.workingHours || {}),
                  start: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora de início" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="workingHoursEnd" className="text-sm text-muted-foreground">Término</Label>
              <Select 
                value={localPreferences.workingHours?.end || '18:00'} 
                onValueChange={(value) => handleChange('workingHours', {
                  ...(localPreferences.workingHours || {}),
                  end: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hora de término" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Notificações</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notificationsEmail" className="text-sm">Email</Label>
              <Switch 
                id="notificationsEmail" 
                checked={localPreferences.notifications?.email ?? true}
                onCheckedChange={(checked) => handleChange('notifications', {
                  ...(localPreferences.notifications || { push: false, desktop: false }),
                  email: checked
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notificationsPush" className="text-sm">Push</Label>
              <Switch 
                id="notificationsPush" 
                checked={localPreferences.notifications?.push ?? false}
                onCheckedChange={(checked) => handleChange('notifications', {
                  ...(localPreferences.notifications || { email: true, desktop: false }),
                  push: checked
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notificationsDesktop" className="text-sm">Desktop</Label>
              <Switch 
                id="notificationsDesktop" 
                checked={localPreferences.notifications?.desktop ?? false}
                onCheckedChange={(checked) => handleChange('notifications', {
                  ...(localPreferences.notifications || { email: true, push: false }),
                  desktop: checked
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
        )}
        <Button onClick={handleSave}>Salvar configurações</Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarSettings;
