
import React from 'react';
import { Puzzle } from "lucide-react";
import { DiagnosticSection } from './DiagnosticSection';

interface MentorEnigmaSectionProps {
  content: string;
}

export const MentorEnigmaSection: React.FC<MentorEnigmaSectionProps> = ({ content }) => {
  return (
    <DiagnosticSection
      title="🧩 Enigma do Mentor"
      content={content}
      icon={<Puzzle className="h-4 w-4 text-yellow-400" />}
      color="yellow-400"
      index={1}
    />
  );
};
