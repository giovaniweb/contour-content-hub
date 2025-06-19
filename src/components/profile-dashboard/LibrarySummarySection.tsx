
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FileText, Video, Image } from "lucide-react";
import { Link } from "react-router-dom";

const LibrarySummarySection: React.FC = () => (
  <Card className="aurora-glass-enhanced aurora-border-enhanced">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-400" />
        Biblioteca de Conteúdo
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Link to="/videos" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-green-900/10 to-green-700/10">
        <Video className="w-5 h-5" />
        <span>Vídeos</span>
      </Link>
      <Link to="/admin/scientific-articles" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-blue-900/10 to-blue-700/10">
        <FileText className="w-5 h-5" />
        <span>Artigos Científicos</span>
      </Link>
      <Link to="/before-after" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-900/10 to-purple-700/10">
        <Image className="w-5 h-5" />
        <span>Antes e Depois</span>
      </Link>
    </CardContent>
  </Card>
);

export default LibrarySummarySection;
