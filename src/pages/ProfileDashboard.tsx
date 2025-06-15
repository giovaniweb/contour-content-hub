
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Book, LayoutDashboard, Image, Video, Award, Instagram } from "lucide-react";
import UserSummarySection from "@/components/profile-dashboard/UserSummarySection";
import LibrarySummarySection from "@/components/profile-dashboard/LibrarySummarySection";
import IntegrationsSummarySection from "@/components/profile-dashboard/IntegrationsSummarySection";
import ProgressSummarySection from "@/components/profile-dashboard/ProgressSummarySection";
import ProfileQuickActions from "@/components/profile-dashboard/ProfileQuickActions";

const ProfileDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-3 md:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Minha Central</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserSummarySection />
        <ProgressSummarySection />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LibrarySummarySection />
        <IntegrationsSummarySection />
      </div>
      <ProfileQuickActions />
    </div>
  );
};

export default ProfileDashboard;
