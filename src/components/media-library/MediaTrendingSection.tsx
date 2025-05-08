
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, VideoIcon, ImageIcon, FileTextIcon } from "lucide-react";
import { MediaItem } from "./mockData";
import { Link } from "react-router-dom";

interface MediaTrendingSectionProps {
  title: string;
  type: "video" | "image" | "file";
  items: MediaItem[];
  onDownload: (item: MediaItem) => void;
}

const MediaTrendingSection: React.FC<MediaTrendingSectionProps> = ({
  title,
  type,
  items,
  onDownload
}) => {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <VideoIcon className="h-5 w-5 text-blue-600" />;
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-600" />;
      case "file":
        return <FileTextIcon className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-md">
            {getIcon()}
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <Link to={`/media/${type}`}>
          <Button variant="ghost" className="flex items-center gap-1 text-fluida-blue">
            See All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video">
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                  {item.duration}
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium line-clamp-1">{item.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {item.viewCount} views
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onDownload(item)}
                  className="text-xs h-7"
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaTrendingSection;
