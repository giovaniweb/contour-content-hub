
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Image, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const LibrarySummarySection: React.FC = () => (
  <Card className="aurora-glass border-white/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Image className="w-5 h-5 text-cyan-400" />
        Minha Biblioteca
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <Link to="/before-after" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-cyan-900/10 to-cyan-700/10">
        <Image className="w-5 h-5" />
        <span>Fotos Antes/Depois</span>
      </Link>
      <Link to="/video-storage" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-blue-900/10 to-blue-700/10">
        <Video className="w-5 h-5" />
        <span>Meus Vídeos</span>
      </Link>
      <Link to="/my-documents" className="flex items-center gap-2 hover-scale px-2 py-2 rounded transition-all bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <FileText className="w-5 h-5" />
        <span>Meus Documentos</span>
      </Link>
    </CardContent>
  </Card>
);

export default LibrarySummarySection;
