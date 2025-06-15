
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Book, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const UserSummarySection: React.FC = () => (
  <Card className="aurora-glass border-white/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-purple-400" />
        Meus Dados
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Link to="/approved-scripts" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-700/40 to-blue-700/30">
        <FileText className="w-5 h-5 text-blue-400" />
        <span>Meus Roteiros</span>
      </Link>
      <Link to="/diagnostic-history" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-900/40 to-blue-800/20">
        <Book className="w-5 h-5 text-pink-400" />
        <span>Meus Diagnósticos</span>
      </Link>
      <Link to="/profile-dashboard" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-800/20 to-blue-900/20">
        <LayoutDashboard className="w-5 h-5 text-emerald-400" />
        <span>Minha Dashboard</span>
      </Link>
    </CardContent>
  </Card>
);

export default UserSummarySection;
