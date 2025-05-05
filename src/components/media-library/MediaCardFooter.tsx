
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface MediaCardFooterProps {
  videoUrl?: string;
  viewMode?: "grid" | "list";
}

const MediaCardFooter: React.FC<MediaCardFooterProps> = ({
  videoUrl,
  viewMode = "grid",
}) => {
  return (
    <div className="p-4 pt-0">
      <Button 
        variant="default" 
        size="sm" 
        className={viewMode === "grid" ? "w-full" : "mr-2"} 
        asChild
      >
        <a href={videoUrl || "#"} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-1" />
          View Media
        </a>
      </Button>
    </div>
  );
};

export default MediaCardFooter;
