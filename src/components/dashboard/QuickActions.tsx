
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, BrainCircuit, Calendar, Shield } from "lucide-react";

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface QuickActionsProps {
  actions: ActionItem[];
  title: string;
  cols?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, title, cols = 4 }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
        {actions.map((action, index) => (
          <Link to={action.path} key={index} className="block">
            <Card className="hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${action.color} p-3 rounded-lg`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{action.label}</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
