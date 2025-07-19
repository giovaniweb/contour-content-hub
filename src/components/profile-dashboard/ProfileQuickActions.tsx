
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Novo Roteiro",
    path: "/fluidaroteirista",
    color: "from-purple-500 to-blue-500"
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    path: "/dashboard",
    color: "from-cyan-500 to-purple-500"
  }
];

const ProfileQuickActions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
      {quickActions.map(action => (
        <Button
          key={action.label}
          onClick={() => navigate(action.path)}
          className={`flex items-center gap-2 justify-center px-6 py-4 aurora-glass bg-gradient-to-r ${action.color} text-white shadow-lg font-bold text-lg`}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ProfileQuickActions;
