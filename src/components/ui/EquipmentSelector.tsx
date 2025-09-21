import React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useEquipments } from '@/hooks/useEquipments';
import { cn } from '@/lib/utils';

interface EquipmentSelectorProps {
  value: string[];
  onChange: (equipments: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
  className?: string;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  value,
  onChange,
  placeholder = "Selecionar equipamentos...",
  disabled = false,
  maxSelections = 10,
  className = ""
}) => {
  const { equipments, loading } = useEquipments();
  const [open, setOpen] = React.useState(false);

  const handleEquipmentToggle = (equipmentName: string) => {
    if (disabled) return;
    
    const isSelected = value.includes(equipmentName);
    
    if (isSelected) {
      onChange(value.filter(eq => eq !== equipmentName));
    } else if (value.length < maxSelections) {
      onChange([...value, equipmentName]);
    }
  };

  const removeEquipment = (equipmentName: string) => {
    onChange(value.filter(eq => eq !== equipmentName));
  };

  const selectedEquipments = equipments.filter(eq => value.includes(eq.nome));

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected equipments display */}
      <div className="flex flex-wrap gap-2">
        {selectedEquipments.map((equipment) => (
          <Badge
            key={equipment.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20"
          >
            {equipment.nome}
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeEquipment(equipment.nome)}
              >
                <X className="h-2 w-2" />
              </Button>
            )}
          </Badge>
        ))}
      </div>

      {/* Equipment selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || loading}
          >
            {loading ? "Carregando equipamentos..." : 
             value.length === 0 ? placeholder :
             value.length === 1 ? `${value.length} equipamento selecionado` :
             `${value.length} equipamentos selecionados`
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-popover z-50" align="start">
          <Command>
            <CommandInput placeholder="Buscar equipamento..." />
            <CommandEmpty>Nenhum equipamento encontrado.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {equipments.map((equipment) => {
                const isSelected = value.includes(equipment.nome);
                const isDisabled = !isSelected && value.length >= maxSelections;
                
                return (
                  <CommandItem
                    key={equipment.id}
                    value={equipment.nome}
                    onSelect={() => handleEquipmentToggle(equipment.nome)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center space-x-2 cursor-pointer",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{equipment.nome}</div>
                      <div className="text-xs text-muted-foreground">
                        {equipment.categoria}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      <div className="text-xs text-muted-foreground">
        {value.length}/{maxSelections} equipamentos selecionados
      </div>
    </div>
  );
};

export default EquipmentSelector;