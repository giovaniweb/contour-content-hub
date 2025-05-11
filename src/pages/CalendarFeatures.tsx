
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, PlusCircleIcon } from 'lucide-react';
import { CalendarPreferences, CalendarSuggestion } from '@/types/calendar';
import CalendarSettings from '@/components/CalendarSettings';

interface CalendarFeaturesProps {
  events?: CalendarSuggestion[];
}

const CalendarFeatures: React.FC<CalendarFeaturesProps> = ({ events = [] }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [newEventOpen, setNewEventOpen] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<Partial<CalendarPreferences>>({
    defaultView: 'week',
    firstDayOfWeek: 0,
    showWeekends: true,
    autoGenerate: false,
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    notifications: {
      email: true,
      push: false,
      desktop: false
    }
  });
  
  const handlePreferenceChange = (key: keyof CalendarPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSavePreferences = async (updatedPreferences: CalendarPreferences) => {
    try {
      // Here you would normally save the preferences to your backend
      console.log('Saving calendar preferences:', updatedPreferences);
      setPreferences(updatedPreferences);
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error saving calendar preferences:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Agenda de Conteúdo</CardTitle>
            <CardDescription>
              Organize seus conteúdos e acompanhe suas publicações.
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setSettingsOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Preferências
            </Button>
            <Button 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setNewEventOpen(true)}
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Novo Evento
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-7 gap-6">
            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Empty state for now */}
              <div className="col-span-full flex items-center justify-center p-8 border border-dashed rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Nenhum evento programado para esta data</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewEventOpen(true)}
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Adicionar Evento
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Calendário</h3>
                </div>
                <div className="p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Você pode agendar conteúdos, criar campanhas e organizar sua estratégia social.
          </p>
        </CardFooter>
      </Card>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preferências de Calendário</DialogTitle>
          </DialogHeader>
          <CalendarSettings 
            preferences={preferences}
            onPreferencesChange={handlePreferenceChange}
            onSave={handleSavePreferences}
            onCancel={() => setSettingsOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* New Event Dialog */}
      <Dialog open={newEventOpen} onOpenChange={setNewEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          {/* Placeholder for new event form */}
          <div className="py-4">
            <p>Interface para adicionar um novo evento no calendário.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewEventOpen(false)}>
              Cancelar
            </Button>
            <Button>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarFeatures;
