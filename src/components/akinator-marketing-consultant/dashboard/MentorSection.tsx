
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface MentorSectionProps {
  mentor: any;
  renderAIMentorSatire: () => string;
}

const MentorSection: React.FC<MentorSectionProps> = ({ mentor, renderAIMentorSatire }) => {
  return (
    <Card className="aurora-gradient-bg border-2 border-aurora-electric-purple/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5" />
          🧩 Mentor Estratégico Identificado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-aurora-electric-purple/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-aurora-electric-purple text-white rounded-full flex items-center justify-center font-bold text-sm">
              {mentor.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{mentor.name}</h3>
              <p className="text-xs text-foreground/70">{mentor.focus}</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80 mb-2">{mentor.style}</p>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="aurora-gradient-bg rounded-lg p-4">
          <p className="text-sm italic text-white leading-relaxed">
            "Se <strong>{mentor.name}</strong> olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. {renderAIMentorSatire()}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorSection;
