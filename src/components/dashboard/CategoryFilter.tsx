
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 max-w-[70%]">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className={cn(
            "capitalize cursor-pointer",
            activeCategory === category ? 'bg-primary' : 'hover:bg-secondary'
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category === 'all' ? 'Todos' : category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;
