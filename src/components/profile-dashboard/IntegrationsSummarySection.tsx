
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const IntegrationsSummarySection: React.FC = () => (
  <Card className="aurora-glass border-white/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Instagram className="w-5 h-5 text-pink-400" />
        Integrações
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Link to="/integrations/instagram" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-pink-900/10 to-pink-700/10">
        <Instagram className="w-5 h-5" />
        <span>Instagram</span>
      </Link>
    </CardContent>
  </Card>
);

export default IntegrationsSummarySection;
