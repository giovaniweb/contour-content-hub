
import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import ContentPlannerColumn from "./ContentPlannerColumn";
import { ContentPlannerItem, ContentPlannerColumn as ColumnType } from "@/types/content-planner";

interface ContentPlannerColumnsProps {
  columns: ColumnType[];
  onEditItem: (item: ContentPlannerItem) => void;
  onDeleteItem: (id: string) => void;
  onScheduleItem: (item: ContentPlannerItem) => void;
  onDragEnd: (result: DropResult) => void;
}

const ContentPlannerColumns: React.FC<ContentPlannerColumnsProps> = ({
  columns,
  onEditItem,
  onDeleteItem,
  onScheduleItem,
  onDragEnd
}) => {
  return (
    <div className="mt-6 flex-1 overflow-x-auto pb-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map(column => (
            <ContentPlannerColumn
              key={column.id}
              column={column}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
              onGenerateScript={() => {}} // TODO: Implement script generation
              onValidateScript={() => {}} // TODO: Implement script validation
              onScheduleItem={onScheduleItem}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ContentPlannerColumns;
