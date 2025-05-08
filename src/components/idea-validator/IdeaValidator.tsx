
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Zap, MessageSquare, ThumbsUp, ThumbsDown, ArrowRight, Loader } from "lucide-react";
import IdeaEvaluation from "./IdeaEvaluation";
import IdeasGenerator from "./IdeasGenerator";

interface IdeaValidationResult {
  evaluation: 'good' | 'needs-work' | 'great';
  suggestions: string[];
  targetAudience: string;
  recommendedPlatforms: string[];
  suggestedFormats: string[];
}

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  format: string;
}

const IdeaValidator: React.FC = () => {
  const navigate = useNavigate();
  const [ideaInput, setIdeaInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<IdeaValidationResult | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const validateIdea = async () => {
    if (!ideaInput.trim()) {
      return;
    }

    setIsValidating(true);
    
    try {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const result: IdeaValidationResult = {
        evaluation: ['good', 'needs-work', 'great'][Math.floor(Math.random() * 3)] as 'good' | 'needs-work' | 'great',
        suggestions: [
          "Consider adding a personal story element",
          "Focus more on the emotional connection",
          "Add a call to action at the end"
        ],
        targetAudience: "Mothers aged 25-45 who appreciate handmade gifts",
        recommendedPlatforms: ["Instagram", "Facebook", "Pinterest"],
        suggestedFormats: ["Short video (60s)", "Carousel post", "Reels"]
      };
      
      setValidationResult(result);
    } catch (error) {
      console.error("Error validating idea:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerateIdeas = () => {
    setShowGenerator(true);
    setValidationResult(null);
  };

  const handleTurnIntoScript = () => {
    // Here we would navigate to the script generator with the validated idea
    navigate("/custom-gpt", { 
      state: { 
        initialPrompt: ideaInput,
        validationResult 
      } 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 fluida-gradient-text">Vamos Validar sua Ideia</h1>
        <p className="text-muted-foreground">Obtenha feedback inteligente para tornar sua ideia de conteúdo ainda melhor</p>
      </div>
      
      {!showGenerator ? (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-fluida-blue">
              <Lightbulb className="mr-2 h-6 w-6" />
              Sua Ideia de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Descreva sua ideia aqui... Ex: Um vídeo para o Dia das Mães usando massinha de modelar"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                className="min-h-[120px] text-base"
              />
              
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost" 
                  onClick={handleGenerateIdeas}
                >
                  Preciso de ideias...
                </Button>
                
                <Button
                  onClick={validateIdea}
                  disabled={!ideaInput.trim() || isValidating}
                  className="bg-fluida-blue hover:bg-fluida-blue/90"
                >
                  {isValidating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Validar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <IdeasGenerator 
          onSelectIdea={(idea) => {
            setIdeaInput(idea.title + ": " + idea.description);
            setShowGenerator(false);
          }} 
          onCancel={() => setShowGenerator(false)}
        />
      )}
      
      {validationResult && (
        <div className="space-y-6 mt-8 animate-fade-in">
          <IdeaEvaluation result={validationResult} />
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleTurnIntoScript}
              className="bg-fluida-pink hover:bg-fluida-pink/90"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Transformar em Roteiro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaValidator;
