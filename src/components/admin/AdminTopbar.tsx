
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Video, Image, BookOpen } from "lucide-react";
import { ROUTES } from "@/routes";

const AdminTopbar: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Upload de Vídeo",
      icon: Video,
      action: () => navigate(ROUTES.ADMIN.VIDEOS),
    },
    {
      label: "Upload de Imagem",
      icon: Image,
      action: () => navigate(ROUTES.MEDIA),
    },
    {
      label: "Artigo Científico",
      icon: BookOpen,
      action: () => navigate(ROUTES.ADMIN.SCIENTIFIC_ARTICLES),
    },
    {
      label: "Downloads em Massa",
      icon: Upload,
      action: () => navigate(ROUTES.DOWNLOADS.BATCH),
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={action.action}
          className="flex items-center gap-2"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default AdminTopbar;
