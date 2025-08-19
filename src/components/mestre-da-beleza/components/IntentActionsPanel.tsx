import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  FileText, 
  BookOpen, 
  Play, 
  Wrench, 
  Stethoscope,
  ArrowRight
} from "lucide-react";

interface Action {
  type: string;
  label: string;
  data: any;
}

interface IntentActionsPanelProps {
  actions: Action[];
  onActionClick: (action: Action) => void;
}

const getActionIcon = (type: string) => {
  switch (type) {
    case 'generate_script':
      return <FileText className="h-4 w-4" />;
    case 'search_articles':
      return <BookOpen className="h-4 w-4" />;
    case 'search_videos':
      return <Play className="h-4 w-4" />;
    case 'equipment_info':
      return <Wrench className="h-4 w-4" />;
    case 'treatment_protocol':
      return <Stethoscope className="h-4 w-4" />;
    default:
      return <ArrowRight className="h-4 w-4" />;
  }
};

const IntentActionsPanel: React.FC<IntentActionsPanelProps> = ({
  actions,
  onActionClick
}) => {
  if (!actions || actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      <div className="text-xs text-muted-foreground mb-2 w-full">
        💡 Ações sugeridas:
      </div>
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action)}
            className="text-xs gap-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
          >
            {getActionIcon(action.type)}
            {action.label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default IntentActionsPanel;