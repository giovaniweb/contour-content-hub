
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface ParallaxSectionAdminProps {
  id: string;
  defaultValues?: {
    title: string;
    description: string;
    backgroundImage: string;
    interactive?: boolean;
    darkOverlay?: boolean;
    typingPhrases?: string[];
    ctaText?: string;
    ctaLink?: string;
  };
  onSave?: (data: any) => void;
}

const ParallaxSectionAdmin: React.FC<ParallaxSectionAdminProps> = ({
  id,
  defaultValues = {
    title: '',
    description: '',
    backgroundImage: '',
    interactive: false,
    darkOverlay: true,
    typingPhrases: [],
    ctaText: '',
    ctaLink: ''
  },
  onSave
}) => {
  const [phrasesText, setPhrasesText] = React.useState(defaultValues.typingPhrases?.join('\n') || '');
  const [isInteractive, setIsInteractive] = React.useState(defaultValues.interactive || false);
  const [hasDarkOverlay, setHasDarkOverlay] = React.useState(defaultValues.darkOverlay !== false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const typingPhrases = phrasesText.split('\n').filter(line => line.trim() !== '');
    
    const data = {
      id,
      title: formData.get('title'),
      description: formData.get('description'),
      backgroundImage: formData.get('backgroundImage'),
      interactive: isInteractive,
      darkOverlay: hasDarkOverlay,
      typingPhrases: isInteractive ? typingPhrases : [],
      ctaText: formData.get('ctaText'),
      ctaLink: formData.get('ctaLink')
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Background Image */}
          <div className="space-y-2">
            <Label htmlFor="backgroundImage">Background Image URL</Label>
            <Input id="backgroundImage" name="backgroundImage" type="url" defaultValue={defaultValues.backgroundImage} />
            <p className="text-xs text-muted-foreground">Enter a URL for the background image</p>
          </div>
          
          {/* Section Type */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="interactive">Interactive Prompt Section</Label>
              <Switch 
                id="interactive" 
                checked={isInteractive}
                onCheckedChange={setIsInteractive}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable for the home hero section with typing animation and prompt input
            </p>
          </div>
          
          {/* Dark Overlay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkOverlay">Dark Overlay</Label>
              <Switch 
                id="darkOverlay" 
                checked={hasDarkOverlay}
                onCheckedChange={setHasDarkOverlay}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Add a semi-transparent dark overlay to improve text readability
            </p>
          </div>
          
          {/* Section Content */}
          {!isInteractive && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <Input id="title" name="title" defaultValue={defaultValues.title} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={3} 
                  defaultValue={defaultValues.description} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctaText">Call-to-Action Text</Label>
                <Input 
                  id="ctaText" 
                  name="ctaText" 
                  defaultValue={defaultValues.ctaText} 
                  placeholder="e.g., Learn More, Explore" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctaLink">Call-to-Action Link</Label>
                <Input 
                  id="ctaLink" 
                  name="ctaLink" 
                  defaultValue={defaultValues.ctaLink} 
                  placeholder="e.g., /media-library" 
                />
              </div>
            </>
          )}
          
          {/* Typing Phrases - Only shown when interactive is true */}
          {isInteractive && (
            <div className="space-y-2">
              <Label htmlFor="typingPhrases">Typing Animation Phrases</Label>
              <Textarea 
                id="typingPhrases" 
                value={phrasesText} 
                onChange={(e) => setPhrasesText(e.target.value)}
                rows={4} 
                placeholder="Enter one phrase per line"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter one phrase per line. These will rotate in the typing animation.
              </p>
            </div>
          )}
          
          <div className="pt-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParallaxSectionAdmin;
