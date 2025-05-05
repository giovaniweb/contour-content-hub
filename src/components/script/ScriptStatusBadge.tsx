
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";

interface ScriptStatusBadgeProps {
  status: string;
  isPDF?: boolean;
  isScheduled?: boolean;
}

const ScriptStatusBadge: React.FC<ScriptStatusBadgeProps> = ({ 
  status, 
  isPDF,
  isScheduled 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'gerado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600">Gerado</Badge>;
      case 'aprovado':
        return <Badge variant="outline" className="bg-green-50 text-green-600">Aprovado</Badge>;
      case 'editado':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600">Editado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      {getStatusBadge(status)}
      
      {isScheduled && (
        <Badge variant="outline" className="bg-purple-50 text-purple-600">
          <Calendar className="h-3 w-3 mr-1" />
          Agendado
        </Badge>
      )}
      
      {isPDF && (
        <Badge variant="outline" className="bg-red-50 text-red-600">
          <FileText className="h-3 w-3 mr-1" />
          PDF
        </Badge>
      )}
    </>
  );
};

export default ScriptStatusBadge;
