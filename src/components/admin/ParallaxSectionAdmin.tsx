
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ParallaxSectionAdminProps {
  id: string;
  defaultValues?: {
    title: string;
    description: string;
    backgroundImage: string;
  };
  onSave?: (data: any) => void;
}

const ParallaxSectionAdmin: React.FC<ParallaxSectionAdminProps> = ({
  id,
  defaultValues = {
    title: '',
    description: '',
    backgroundImage: ''
  },
  onSave
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      id,
      title: formData.get('title'),
      description: formData.get('description'),
      backgroundImage: formData.get('backgroundImage')
    };
    
    if (onSave) onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Parallax Section</CardTitle>
        <CardDescription>Customize the appearance and content of this parallax section</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input id="title" name="title" defaultValue={defaultValues.title} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={defaultValues.description} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">Background Image URL</Label>
            <Input id="backgroundImage" name="backgroundImage" type="url" defaultValue={defaultValues.backgroundImage} />
            <p className="text-xs text-muted-foreground">Enter a URL for the background image</p>
          </div>
          
          <div className="pt-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParallaxSectionAdmin;
