
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  Heading, 
  Link as LinkIcon
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from "@/components/ui/textarea";

interface ScriptEditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ 
  content, 
  onChange,
  readOnly = false 
}) => {
  const [editMode, setEditMode] = useState<'visual' | 'markdown'>('visual');
  const [editorContent, setEditorContent] = useState(content);
  
  // Sync content with props
  useEffect(() => {
    setEditorContent(content);
  }, [content]);
  
  // Update parent component when content changes
  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };
  
  // Handle formatting commands
  const applyFormatting = (command: string) => {
    if (readOnly) return;
    
    const textarea = document.getElementById('script-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    let newContent = editorContent;
    let newCursorPos = end;
    
    switch(command) {
      case 'bold':
        newContent = editorContent.substring(0, start) + `**${selectedText}**` + editorContent.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newContent = editorContent.substring(0, start) + `*${selectedText}*` + editorContent.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newContent = editorContent.substring(0, start) + `__${selectedText}__` + editorContent.substring(end);
        newCursorPos = end + 4;
        break;
      case 'heading':
        // Check if we're at the start of a line
        const beforeSelection = editorContent.substring(0, start);
        const isStartOfLine = start === 0 || beforeSelection.slice(-1) === '\n';
        
        if (isStartOfLine) {
          newContent = editorContent.substring(0, start) + `## ${selectedText}` + editorContent.substring(end);
          newCursorPos = end + 3;
        } else {
          newContent = editorContent.substring(0, start) + `\n## ${selectedText}` + editorContent.substring(end);
          newCursorPos = end + 4;
        }
        break;
      case 'list':
        // Split selected text into lines
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => `- ${line}`).join('\n');
        newContent = editorContent.substring(0, start) + formattedLines + editorContent.substring(end);
        newCursorPos = start + formattedLines.length;
        break;
      case 'link':
        newContent = editorContent.substring(0, start) + `[${selectedText}](url)` + editorContent.substring(end);
        newCursorPos = end + 6;
        break;
    }
    
    handleContentChange(newContent);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  // Toggle between visual and markdown mode
  const toggleEditorMode = () => {
    if (readOnly) return;
    setEditMode(prevMode => prevMode === 'visual' ? 'markdown' : 'visual');
  };
  
  // Preview mode shows rendered markdown or simple preview
  const Preview = () => (
    <div className="prose max-w-none">
      {editorContent.split('\n').map((line, index) => (
        <p key={index}>{line || <br/>}</p>
      ))}
    </div>
  );
  
  return (
    <Card className="w-full">
      {!readOnly && (
        <div className="px-3 pt-3 pb-1 border-b flex flex-wrap gap-1">
          <Toggle 
            aria-label="Toggle bold" 
            onClick={() => applyFormatting('bold')}
            disabled={readOnly}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Toggle italic"
            onClick={() => applyFormatting('italic')}
            disabled={readOnly}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Toggle underline"
            onClick={() => applyFormatting('underline')}
            disabled={readOnly}
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Toggle 
            aria-label="Left align"
            disabled={readOnly}
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Center align"
            disabled={readOnly}
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Right align"
            disabled={readOnly}
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <Toggle 
            aria-label="Create list"
            onClick={() => applyFormatting('list')}
            disabled={readOnly}
          >
            <List className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Add heading"
            onClick={() => applyFormatting('heading')}
            disabled={readOnly}
          >
            <Heading className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            aria-label="Insert link"
            onClick={() => applyFormatting('link')}
            disabled={readOnly}
          >
            <LinkIcon className="h-4 w-4" />
          </Toggle>
          
          <div className="flex-grow"></div>
          
          {!readOnly && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleEditorMode}
            >
              {editMode === 'visual' ? 'Ver Markdown' : 'Modo Visual'}
            </Button>
          )}
        </div>
      )}
      
      <CardContent className={`pt-4 ${readOnly ? 'pb-2' : 'pb-4'}`}>
        {readOnly ? (
          <Preview />
        ) : editMode === 'visual' ? (
          <Textarea
            id="script-editor"
            className="min-h-[300px] font-mono"
            placeholder="Comece a escrever ou editar seu roteiro aqui..."
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            disabled={readOnly}
          />
        ) : (
          <div className="border rounded-md p-4 min-h-[300px]">
            <Preview />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptEditor;
