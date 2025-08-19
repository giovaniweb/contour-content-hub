import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Play, Clock } from 'lucide-react';
import { AcademyLesson } from '@/hooks/useAcademyLessons';

interface LessonsListProps {
  lessons: AcademyLesson[];
  onEdit: (lesson: AcademyLesson) => void;
  onDelete: (id: string) => void;
  onReorder: (lessons: AcademyLesson[]) => void;
  onPlay?: (lesson: AcademyLesson) => void;
  showPlayButton?: boolean;
  isAdmin?: boolean;
}

export const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  onEdit,
  onDelete,
  onReorder,
  onPlay,
  showPlayButton = false,
  isAdmin = false
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isAdmin) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all items
    const updatedLessons = items.map((lesson, index) => ({
      ...lesson,
      order_index: index + 1
    }));

    onReorder(updatedLessons);
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>Nenhuma aula cadastrada ainda.</p>
      </div>
    );
  }

  const LessonCard = ({ lesson, index }: { lesson: AcademyLesson; index: number }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Badge variant="outline" className="text-xs">
                {lesson.order_index}
              </Badge>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">{lesson.title}</h4>
              {lesson.is_mandatory && (
                <Badge variant="secondary" className="text-xs">
                  Obrigatória
                </Badge>
              )}
            </div>
            
            {lesson.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {lesson.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {lesson.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration_minutes} min</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showPlayButton && onPlay && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPlay(lesson)}
              >
                <Play className="h-4 w-4 mr-1" />
                Assistir
              </Button>
            )}
            
            {isAdmin && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(lesson)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(lesson.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isAdmin) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="lessons">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {lessons.map((lesson, index) => (
                <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
                    >
                      <LessonCard lesson={lesson} index={index} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <div>
      {lessons.map((lesson, index) => (
        <LessonCard key={lesson.id} lesson={lesson} index={index} />
      ))}
    </div>
  );
};