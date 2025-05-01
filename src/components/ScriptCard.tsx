
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileText, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { ScriptResponse, saveScriptFeedback, generatePDF } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface ScriptCardProps {
  script: ScriptResponse;
  onFeedbackSubmit?: () => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [approved, setApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    try {
      setIsSubmitting(true);
      await saveScriptFeedback(script.id, feedback, approved);
      toast({
        title: approved ? "Script approved!" : "Feedback submitted",
        description: "Thank you for your feedback.",
      });
      setDialogOpen(false);
      if (onFeedbackSubmit) onFeedbackSubmit();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Could not submit your feedback.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generatePDF(script.id);
      toast({
        title: "PDF Generated",
        description: "Your CapCut editing guide is ready to download.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not generate PDF.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get badge color based on script type
  const getBadgeVariant = () => {
    switch (script.type) {
      case "videoScript":
        return "default";
      case "bigIdea":
        return "outline";
      case "dailySales":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get script type label
  const getScriptTypeLabel = () => {
    switch (script.type) {
      case "videoScript":
        return "Video Script";
      case "bigIdea":
        return "Big Idea";
      case "dailySales":
        return "Daily Sales";
      default:
        return "Script";
    }
  };

  return (
    <Card className="w-full reelline-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg md:text-xl">{script.title}</CardTitle>
          <Badge variant={getBadgeVariant()}>{getScriptTypeLabel()}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created on {formatDate(script.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-line">
          {script.content}
        </div>
        
        {script.suggestedVideos && script.suggestedVideos.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Suggested Videos</h4>
            <div className="horizontal-scroll">
              {script.suggestedVideos.map((video) => (
                <div 
                  key={video.id}
                  className="w-48 p-2 border rounded-md bg-white"
                >
                  <div className="aspect-video bg-gray-200 rounded-sm overflow-hidden mb-2">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium truncate">{video.title}</p>
                  <p className="text-xs text-muted-foreground">{video.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between pt-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            CapCut Guide
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Script Feedback</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="approved" 
                    checked={approved} 
                    onCheckedChange={setApproved} 
                  />
                  <Label htmlFor="approved" className="flex items-center gap-1">
                    {approved ? (
                      <>
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span>Approve this script</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 text-orange-500" />
                        <span>Needs revision</span>
                      </>
                    )}
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Your feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="What did you like? What needs improvement?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScriptCard;
