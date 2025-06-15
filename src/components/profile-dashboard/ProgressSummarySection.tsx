
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Link } from "react-router-dom";

const ProgressSummarySection: React.FC = () => (
  <Card className="aurora-glass border-white/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" />
        Meu Progresso
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Link to="/gamification" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-yellow-900/10 to-yellow-700/10">
        <Award className="w-5 h-5" />
        <span>Ver Gamificação</span>
      </Link>
    </CardContent>
  </Card>
);

export default ProgressSummarySection;
