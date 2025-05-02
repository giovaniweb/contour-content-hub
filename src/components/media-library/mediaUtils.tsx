
import React from "react";
import { Video, Image, FileText, Film, Camera } from "lucide-react";

export const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4 mr-2" />;
    case "arte":
      return <Image className="h-4 w-4 mr-2" />;
    case "artigo":
      return <FileText className="h-4 w-4 mr-2" />;
    case "documentacao":
      return <FileText className="h-4 w-4 mr-2" />;
    case "video_pronto":
      return <Video className="h-4 w-4 mr-2" />;
    case "take":
      return <Film className="h-4 w-4 mr-2" />;
    case "image":
      return <Camera className="h-4 w-4 mr-2" />;
    default:
      return null;
  }
};
