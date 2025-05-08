
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormErrorDisplayProps {
  error: string | null;
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default FormErrorDisplay;
