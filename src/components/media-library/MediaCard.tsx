import React from "react";
import { MediaItem } from "./mockData";
import MediaCard from "@/components/MediaCard";

interface MediaCardProps {
  media: MediaItem;
  viewMode?: "grid" | "list";
  onUpdate?: () => void;
}

// Simple wrapper to keep old import path for MediaCard
const MediaCardProxy: React.FC<MediaCardProps> = (props) => <MediaCard {...props} />;
export default MediaCardProxy;
