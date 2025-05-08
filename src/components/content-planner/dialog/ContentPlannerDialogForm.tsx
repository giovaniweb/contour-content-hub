
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ContentPlannerFormFields from "./ContentPlannerFormFields";
import TagsInput from "./TagsInput";
import { ContentPlannerItem, ContentFormat, ContentDistribution } from "@/types/content-planner";
import { Equipment } from "@/hooks/useEquipments";

interface ContentPlannerDialogFormProps {
  item?: ContentPlannerItem;
  onSave: (item: Partial<ContentPlannerItem>) => Promise<void>;
  onClose: () => void;
  equipments: Equipment[];
}

const ContentPlannerDialogForm: React.FC<ContentPlannerDialogFormProps> = ({
  item,
  onSave,
  onClose,
  equipments
}) => {
  const [title, setTitle] = React.useState(item?.title || "");
  const [description, setDescription] = React.useState(item?.description || "");
  const [tags, setTags] = React.useState<string[]>(item?.tags || []);
  const [format, setFormat] = React.useState<ContentFormat>(item?.format || "vídeo");
  const [objective, setObjective] = React.useState<string>(item?.objective || "🟡 Atrair Atenção");
  const [distribution, setDistribution] = React.useState<ContentDistribution>(item?.distribution || "Instagram");
  const [equipmentId, setEquipmentId] = React.useState<string>(item?.equipmentId || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const updatedItem: Partial<ContentPlannerItem> = {
      title,
      description,
      tags,
      format,
      objective,
      distribution,
      equipmentId: equipmentId || undefined,
      ...(item ? { id: item.id } : {})
    };
    
    try {
      await onSave(updatedItem);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ContentPlannerFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        format={format}
        setFormat={setFormat}
        objective={objective}
        setObjective={setObjective}
        distribution={distribution}
        setDistribution={setDistribution}
        equipmentId={equipmentId}
        setEquipmentId={setEquipmentId}
        equipments={equipments}
      />
      
      <TagsInput tags={tags} setTags={setTags} />
      
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ContentPlannerDialogForm;
