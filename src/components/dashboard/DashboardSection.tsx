
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardSectionProps {
  title: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionPath?: string;
  children: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  icon,
  actionLabel,
  actionPath,
  children,
}) => {
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {actionLabel && actionPath && (
          <Button variant="ghost" size="sm" onClick={handleAction}>
            {actionLabel}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};

export default DashboardSection;
