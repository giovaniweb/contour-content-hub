
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCalendarSuggestions, CalendarSuggestion } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import CalendarDay from "@/components/CalendarDay";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LoaderIcon } from "lucide-react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar: React.FC = () => {
  const { toast } = useToast();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [frequency, setFrequency] = useState<1 | 2 | 3>(2);
  const [observations, setObservations] = useState("");
  const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Fetch calendar suggestions
  useEffect(() => {
    fetchCalendarSuggestions();
  }, [currentMonth, currentYear, frequency]);
  
  const fetchCalendarSuggestions = async () => {
    try {
      setIsLoading(true);
      const data = await getCalendarSuggestions(currentMonth, currentYear, frequency);
      setSuggestions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load calendar",
        description: "Could not load calendar suggestions",
      });
      console.error("Failed to fetch calendar suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const calendarDays = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
      calendarDays.push({ date, isCurrentMonth: false });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split("T")[0];
      const suggestion = suggestions.find(s => s.date === dateString);
      calendarDays.push({ date, isCurrentMonth: true, suggestion });
    }
    
    // Next month's days
    const remainingDays = 7 - (calendarDays.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(currentYear, currentMonth + 1, day);
        calendarDays.push({ date, isCurrentMonth: false });
      }
    }
    
    return calendarDays;
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Handle updating observations
  const handleSaveObservations = () => {
    // In a real app, this would call an API to save the observations
    toast({
      title: "Preferences saved",
      description: "Your content preferences have been updated",
    });
  };
  
  // Format the month and year
  const formatMonthYear = () => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(currentDate);
  };
  
  return (
    <Layout title="Content Calendar">
      <div className="grid gap-6">
        {/* Calendar header and controls */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>Intelligent Content Agenda</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[140px] text-center">
                    {formatMonthYear()}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardTitle>
            <CardDescription>
              Plan your content schedule with AI-powered suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Frequency
                </label>
                <Select
                  value={frequency.toString()}
                  onValueChange={(value) => setFrequency(parseInt(value) as 1 | 2 | 3)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x per week</SelectItem>
                    <SelectItem value="2">2x per week</SelectItem>
                    <SelectItem value="3">3x per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Preferences
                </label>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="e.g., I want to focus on lipedema treatments this month"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="flex-grow"
                  />
                  <Button className="self-end" onClick={handleSaveObservations}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar grid */}
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                  <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Generating your content calendar...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className="text-center font-medium text-sm py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((day, index) => (
                    <CalendarDay
                      key={index}
                      date={day.date}
                      suggestion={day.suggestion}
                      isCurrentMonth={day.isCurrentMonth}
                      onUpdate={fetchCalendarSuggestions}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;
