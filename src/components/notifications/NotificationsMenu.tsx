
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationsMenu: React.FC = () => {
  return (
    <Button variant="ghost" size="icon">
      <Bell className="h-5 w-5" />
    </Button>
  );
};

export default NotificationsMenu;
