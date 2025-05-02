
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, ArrowLeft, ArrowRight } from "lucide-react";

interface MediaFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedEquipment: string;
  setSelectedEquipment: (value: string) => void;
  selectedBodyArea: string;
  setSelectedBodyArea: (value: string) => void;
  selectedPurpose: string;
  setSelectedPurpose: (value: string) => void;
  handleReset: () => void;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  search,
  setSearch,
  selectedEquipment,
  setSelectedEquipment,
  selectedBodyArea,
  setSelectedBodyArea,
  selectedPurpose,
  setSelectedPurpose,
  handleReset
}) => {
  // Equipment, body area, and purpose options based on the updated database schema
  const equipmentOptions = [
    "Adélla Laser",
    "Enygma X-Orbital",
    "Focuskin",
    "Hipro",
    "Hive Pro",
    "Laser Crystal 3D Plus",
    "MultiShape",
    "Reverso",
    "Supreme Pro",
    "Ultralift - Endolaser",
    "Unyque PRO",
    "X-Tonus"
  ];
  
  const bodyAreaOptions = [
    "Face", 
    "Pescoço", 
    "Abdômen", 
    "Coxas", 
    "Glúteos", 
    "Braços",
    "Corpo todo"
  ];
  
  const purposeOptions = [
    "Rugas",
    "Emagrecimento", 
    "Tonificação", 
    "Hidratação", 
    "Flacidez",
    "Gordura localizada",
    "Lipedema",
    "Sarcopenia"
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recentes
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger>
              <SelectValue placeholder="Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Equipment</SelectItem>
              {equipmentOptions.map((equipment) => (
                <SelectItem key={equipment} value={equipment}>
                  {equipment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={selectedBodyArea} onValueChange={setSelectedBodyArea}>
            <SelectTrigger>
              <SelectValue placeholder="Body Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Body Areas</SelectItem>
              {bodyAreaOptions.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
            <SelectTrigger>
              <SelectValue placeholder="Purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Purposes</SelectItem>
              {purposeOptions.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MediaFilters;
