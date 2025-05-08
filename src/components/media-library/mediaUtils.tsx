
import React from "react";
import { Video, Image, FileText, Film, Camera } from "lucide-react";

export const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "arte":
      return <Image className="h-4 w-4" />;
    case "artigo":
      return <FileText className="h-4 w-4" />;
    case "documentacao":
      return <FileText className="h-4 w-4" />;
    case "video_pronto":
      return <Film className="h-4 w-4" />;
    case "take":
      return <Film className="h-4 w-4" />;
    case "image":
      return <Camera className="h-4 w-4" />;
    default:
      return null;
  }
};

export const getMediaTypeName = (type: string) => {
  switch (type) {
    case "all":
      return "Todos os itens";
    case "video":
      return "Vídeos";
    case "arte":
      return "Artes";
    case "artigo":
      return "Artigos";
    case "documentacao":
      return "Documentação";
    case "video_pronto":
      return "Vídeos Prontos";
    case "take":
      return "Takes Brutos";
    case "image":
      return "Imagens";
    default:
      return "Mídia";
  }
};

export const mediaTypeToColor = (type: string): string => {
  switch (type) {
    case "video":
    case "video_pronto":
    case "take":
      return "text-blue-600 bg-blue-100";
    case "arte":
    case "image":
      return "text-purple-600 bg-purple-100";
    case "artigo":
      return "text-green-600 bg-green-100";
    case "documentacao":
      return "text-amber-600 bg-amber-100";
    default:
      return "text-slate-600 bg-slate-100";
  }
};
