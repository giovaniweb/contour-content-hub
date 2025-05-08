
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface MediaCardFooterProps {
  videoUrl?: string;
  viewMode?: "grid" | "list";
  onDownload: () => void;
}

const MediaCardFooter: React.FC<MediaCardFooterProps> = ({
  videoUrl,
  viewMode = "grid",
  onDownload
}) => {
  return (
    <div className="p-4 pt-0">
      <div className={viewMode === "list" ? "flex gap-2" : ""}>
        <Button 
          variant="outline" 
          size="sm" 
          className={viewMode === "grid" ? "w-full mb-2" : "mr-2"} 
          asChild
        >
          <a href={videoUrl || "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-1" />
            Visualizar
          </a>
        </Button>
        
        <Button 
          variant="default"
          size="sm"
          className={viewMode === "grid" ? "w-full" : ""}
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default MediaCardFooter;
