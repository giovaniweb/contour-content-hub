
import React, { useState } from "react";
import { ContentPlannerFilter } from "@/types/content-planner";
import { useEquipments } from "@/hooks/useEquipments";
import { FilterHeader } from "./filters/FilterHeader";
import { FormatFilter } from "./filters/FormatFilter";
import { ObjectiveFilter } from "./filters/ObjectiveFilter";
import { DistributionFilter } from "./filters/DistributionFilter";
import { EquipmentFilter } from "./filters/EquipmentFilter";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { hasActiveFilters } from "./filters/FilterUtils";

interface ContentPlannerFiltersProps {
  filters: ContentPlannerFilter;
  onFilterChange: (filters: ContentPlannerFilter) => void;
}

const ContentPlannerFilters: React.FC<ContentPlannerFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.dateRange?.from,
    to: filters.dateRange?.to
  });
  const { equipments } = useEquipments();
  
  const handleFilterChange = (key: keyof ContentPlannerFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };
  
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    onFilterChange({
      ...filters,
      dateRange: range
    });
  };
  
  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    onFilterChange({});
  };
  
  return (
    <div className="bg-muted/20 p-4 rounded-md">
      <FilterHeader 
        hasActiveFilters={hasActiveFilters(filters)}
        onClearFilters={clearFilters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Format filter */}
        <div>
          <FormatFilter 
            value={filters.format || "all"}
            onValueChange={(value) => handleFilterChange('format', value)} 
          />
        </div>
        
        {/* Objective filter */}
        <div>
          <ObjectiveFilter 
            value={filters.objective || "all"}
            onValueChange={(value) => handleFilterChange('objective', value)}
          />
        </div>
        
        {/* Distribution filter */}
        <div>
          <DistributionFilter 
            value={filters.distribution || "all"}
            onValueChange={(value) => handleFilterChange('distribution', value)}
          />
        </div>
        
        {/* Equipment filter */}
        <div>
          <EquipmentFilter 
            value={filters.equipmentId || "all"}
            onValueChange={(value) => handleFilterChange('equipmentId', value)}
            equipments={equipments}
          />
        </div>
        
        {/* Date range filter */}
        <div>
          <DateRangeFilter 
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentPlannerFilters;
