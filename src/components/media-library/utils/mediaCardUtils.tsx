
import { cn } from "@/lib/utils";
import { Video as VideoIcon, Camera, Film } from "lucide-react";
import React from "react";

// Get the icon based on media type
export const getMediaTypeIcon = (type: string): React.ReactNode => {
  switch (type) {
    case "video_pronto":
      return React.createElement(VideoIcon, { className: "h-4 w-4" });
    case "take":
      return React.createElement(Film, { className: "h-4 w-4" });
    case "image":
      return React.createElement(Camera, { className: "h-4 w-4" });
    default:
      return React.createElement(VideoIcon, { className: "h-4 w-4" });
  }
};

// Get badge color based on media type
export const getBadgeVariant = (type: string) => {
  switch (type) {
    case "video_pronto":
      return "default";
    case "take":
      return "secondary";
    case "image":
      return "outline";
    default:
      return "default";
  }
};

// Get formatted media type name
export const getMediaTypeName = (type: string) => {
  switch (type) {
    case "video_pronto":
      return "Vídeo";
    case "take":
      return "Take";
    case "image":
      return "Imagem";
    default:
      return type;
  }
};
