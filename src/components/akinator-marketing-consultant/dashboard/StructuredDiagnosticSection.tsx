
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  Puzzle,
  Copy,
  Download
} from "lucide-react";

interface StructuredDiagnosticSectionProps {
  diagnostic: string;
}

const StructuredDiagnosticSection: React.FC<StructuredDiagnosticSectionProps> = ({ 
  diagnostic 
}) => {
  // Parse das seções do diagnóstico
  const parseDiagnostic = (text: string) => {
    const sections = {
      diagnosticoEstrategico: '',
      ideiasConteudo: '',
      planoAcao: '',
      enigmaMentor: '',
      projecaoCrescimento: ''
    };

    // Regex para extrair cada seção
    const diagnosticoMatch = text.match(/## 📊 Diagnóstico Estratégico\s*([\s\S]*?)(?=## |$)/);
    const ideiasMatch = text.match(/## 💡 Ideias de Conteúdo Inteligente\s*([\s\S]*?)(?=## |$)/);
    const planoMatch = text.match(/## 📅 Plano de Ação[^\n]*\s*([\s\S]*?)(?=## |$)/);
    const enigmaMatch = text.match(/## 🧩 Enigma Satírico do Mentor\s*([\s\S]*?)(?=## |$)/);
    const projecaoMatch = text.match(/## 💸 Projeção de Crescimento\s*([\s\S]*?)(?=## |$)/);

    if (diagnosticoMatch) sections.diagnosticoEstrategico = diagnosticoMatch[1].trim();
    if (ideiasMatch) sections.ideiasConteudo = ideiasMatch[1].trim();
    if (planoMatch) sections.planoAcao = planoMatch[1].trim();
    if (enigmaMatch) sections.enigmaMentor = enigmaMatch[1].trim();
    if (projecaoMatch) sections.projecaoCrescimento = projecaoMatch[1].trim();

    return sections;
  };

  const sections = parseDiagnostic(diagnostic);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">
              📋 Relatório Completo do Consultor Fluida
            </h2>
            <p className="text-foreground/60 text-lg">
              Diagnóstico estruturado com plano de ação personalizado
            </p>
          </div>
        </div>
        <Button variant="outline" className="aurora-glass border-purple-500/30">
          <Download className="h-4 w-4 mr-2" />
          Baixar PDF
        </Button>
      </div>

      {/* Diagnóstico Estratégico */}
      {sections.diagnosticoEstrategico && (
        <Card className="aurora-glass border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                📊 Diagnóstico Estratégico
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(sections.diagnosticoEstrategico)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {sections.diagnosticoEstrategico.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ideias de Conteúdo */}
      {sections.ideiasConteudo && (
        <Card className="aurora-glass border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-400" />
                💡 Ideias de Conteúdo Inteligente
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(sections.ideiasConteudo)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {sections.ideiasConteudo.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plano de Ação */}
      {sections.planoAcao && (
        <Card className="aurora-glass border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-400" />
                📅 Plano de Ação - 3 Semanas
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(sections.planoAcao)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {sections.planoAcao.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projeção de Crescimento */}
      {sections.projecaoCrescimento && (
        <Card className="aurora-glass border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                💸 Projeção de Crescimento
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => copyToClipboard(sections.projecaoCrescimento)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {sections.projecaoCrescimento.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enigma do Mentor */}
      {sections.enigmaMentor && (
        <Card className="aurora-gradient-bg border-2 border-aurora-electric-purple/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Puzzle className="h-5 w-5" />
              🧩 Enigma Satírico do Mentor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-aurora-electric-purple/30">
              <p className="text-sm italic text-foreground leading-relaxed">
                {sections.enigmaMentor}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default StructuredDiagnosticSection;
