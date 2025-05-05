
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";

interface ScriptContentProps {
  content: string;
}

const ScriptContent: React.FC<ScriptContentProps> = ({ content }) => {
  // Format the content
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-3">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-3 mb-1">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-5 mt-1">{line.substring(2)}</li>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="mt-1">{line}</p>;
        }
      });
  };

  return (
    <TabsContent value="conteudo" className="mt-0 p-0">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {formatContent(content)}
      </div>
    </TabsContent>
  );
};

export default ScriptContent;
