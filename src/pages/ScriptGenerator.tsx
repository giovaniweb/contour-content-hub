
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { generateScript, ScriptType, ScriptResponse } from "@/utils/api";
import ScriptCard from "@/components/ScriptCard";
import { useToast } from "@/hooks/use-toast";
import { FileText, Sparkles, MessageSquare, LoaderIcon } from "lucide-react";

const ScriptGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const initialScriptType = (searchParams.get("type") || "videoScript") as ScriptType;
  
  const [activeTab, setActiveTab] = useState<ScriptType>(initialScriptType);
  const [topic, setTopic] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [bodyArea, setBodyArea] = useState("");
  const [purpose, setPurpose] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<ScriptResponse[]>([]);
  
  // Set equipment from user profile if available
  useEffect(() => {
    if (user?.equipment && user.equipment.length > 0) {
      setEquipment(user.equipment);
    }
  }, [user]);
  
  const handleGenerateScript = async () => {
    if (!topic) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a topic for your script",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const script = await generateScript({
        type: activeTab,
        topic,
        equipment,
        bodyArea: bodyArea || undefined,
        purpose: purpose || undefined,
        additionalInfo: additionalInfo || undefined,
        tone: tone || undefined,
        language: user?.language || "EN",
      });
      
      setGeneratedScripts(prev => [script, ...prev]);
      
      toast({
        title: "Script generated",
        description: "Your new script is ready",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Could not generate script",
      });
      console.error("Script generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getTabIcon = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return <FileText className="h-4 w-4 mr-2" />;
      case "bigIdea":
        return <Sparkles className="h-4 w-4 mr-2" />;
      case "dailySales":
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };
  
  const getTabLabel = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return "Video Script";
      case "bigIdea":
        return "Big Idea";
      case "dailySales":
        return "Daily Sales";
    }
  };
  
  const getTabDescription = (type: ScriptType) => {
    switch (type) {
      case "videoScript":
        return "Create detailed scripts for educational treatment videos";
      case "bigIdea":
        return "Develop strategic content campaigns for your brand";
      case "dailySales":
        return "Generate quick, persuasive sales stories for social media";
    }
  };
  
  return (
    <Layout title="Script Generator">
      <div className="grid gap-6">
        {/* Script generator form */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Script</CardTitle>
            <CardDescription>
              Select the type of content and provide details to create your script
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ScriptType)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="videoScript" className="flex items-center">
                  {getTabIcon("videoScript")}
                  <span className="hidden sm:inline">Video Script</span>
                  <span className="sm:hidden">Video</span>
                </TabsTrigger>
                <TabsTrigger value="bigIdea" className="flex items-center">
                  {getTabIcon("bigIdea")}
                  <span className="hidden sm:inline">Big Idea</span>
                  <span className="sm:hidden">Idea</span>
                </TabsTrigger>
                <TabsTrigger value="dailySales" className="flex items-center">
                  {getTabIcon("dailySales")}
                  <span className="hidden sm:inline">Daily Sales</span>
                  <span className="sm:hidden">Sales</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    {getTabIcon(activeTab)}
                    {getTabLabel(activeTab)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getTabDescription(activeTab)}
                  </p>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic *</Label>
                      <Input
                        id="topic"
                        placeholder="e.g. UltraSonic Facial Treatment"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment</Label>
                      <Select
                        value={equipment[0] || "no-equipment"}
                        onValueChange={(value) => setEquipment(value === "no-equipment" ? [] : [value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-equipment">No equipment</SelectItem>
                          {(user?.equipment || ["UltraSonic", "Venus Freeze", "Laser"]).map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bodyArea">Body Area</Label>
                      <Input
                        id="bodyArea"
                        placeholder="e.g. Face, Abdomen, Thighs"
                        value={bodyArea}
                        onChange={(e) => setBodyArea(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input
                        id="purpose"
                        placeholder="e.g. Anti-aging, Slimming"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={tone}
                      onValueChange={setTone}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any specific details or requirements for your script"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    onClick={handleGenerateScript}
                    disabled={isGenerating || !topic}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        {getTabIcon(activeTab)}
                        Generate {getTabLabel(activeTab)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Generated scripts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {generatedScripts.length === 0
              ? "Your generated scripts will appear here"
              : "Generated Scripts"}
          </h2>
          
          {generatedScripts.length === 0 ? (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No scripts generated yet. Fill the form above to create your first script.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {generatedScripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScriptGenerator;
