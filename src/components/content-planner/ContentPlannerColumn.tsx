
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ContentPlannerColumn as ColumnType, ContentPlannerItem } from "@/types/content-planner";
import ContentPlannerCard from "./ContentPlannerCard";

interface ContentPlannerColumnProps {
  column: ColumnType;
  onEditItem: (item: ContentPlannerItem) => void;
  onDeleteItem: (id: string) => void;
  onGenerateScript?: (item: ContentPlannerItem) => void;
  onValidateScript?: (item: ContentPlannerItem) => void;
  onScheduleItem?: (item: ContentPlannerItem) => void;
}

const ContentPlannerColumn: React.FC<ContentPlannerColumnProps> = ({
  column,
  onEditItem,
  onDeleteItem,
  onGenerateScript,
  onValidateScript,
  onScheduleItem
}) => {
  return (
    <div className="flex flex-col w-[300px] min-w-[300px] bg-muted/30 rounded-md">
      <div className="p-3 font-medium">
        <div className="flex items-center">
          <span className="mr-2">{column.icon}</span>
          <h3>{column.title}</h3>
          <span className="ml-2 text-sm text-muted-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center">
            {column.items.length}
          </span>
        </div>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 min-h-[200px] ${
              snapshot.isDraggingOver ? "bg-accent/50" : ""
            }`}
          >
            {column.items.map((item, index) => (
              <ContentPlannerCard
                key={item.id}
                item={item}
                index={index}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
                onGenerateScript={column.id === 'idea' ? onGenerateScript : undefined}
                onValidate={column.id === 'script_generated' ? onValidateScript : undefined}
                onSchedule={column.id === 'approved' ? onScheduleItem : undefined}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ContentPlannerColumn;
