
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [currentTag, setCurrentTag] = useState("");
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <div className="flex gap-2">
        <Input
          id="tags"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar tag"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={handleAddTag}
          disabled={!currentTag.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsInput;
