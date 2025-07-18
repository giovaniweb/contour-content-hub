import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface Equipment {
  id: string;
  nome: string;
  beneficios?: string;
  diferenciais?: string;
}

interface Mentor {
  name: string;
  speciality: string;
}

interface AuroraMarketingPDFGeneratorProps {
  diagnosticData: {
    generatedDiagnostic: string;
    equipment?: Equipment;
    mentor?: Mentor;
    targetAudience?: string;
    currentRevenue?: string;
    revenueGoal?: string;
    mainChallenges?: string;
  };
}

const AuroraMarketingPDFGenerator: React.FC<AuroraMarketingPDFGeneratorProps> = ({
  diagnosticData
}) => {
  const generatePDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Configuração de cores Aurora
      const primaryColor = [139, 69, 244]; // Purple
      const secondaryColor = [236, 72, 153]; // Pink
      const darkBg = [15, 23, 42]; // Dark background
      const whiteText = [255, 255, 255];
      
      let yPosition = 20;
      
      // Header com gradiente simulado
      doc.setFillColor(139, 69, 244);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFillColor(236, 72, 153);
      doc.rect(0, 20, 210, 20, 'F');
      
      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('🧩 Relatório de Diagnóstico Marketing', 105, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Análise Estratégica Personalizada', 105, 35, { align: 'center' });
      
      yPosition = 60;
      
      // Informações do Mentor
      if (diagnosticData.mentor) {
        doc.setFillColor(55, 65, 81);
        doc.rect(15, yPosition - 5, 180, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('🎯 Mentor Estratégico Identificado', 20, yPosition + 5);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${diagnosticData.mentor.name}`, 20, yPosition + 12);
        doc.text(`Especialidade: ${diagnosticData.mentor.speciality}`, 20, yPosition + 18);
        
        yPosition += 35;
      }
      
      // Equipamento Principal
      if (diagnosticData.equipment) {
        doc.setFillColor(30, 41, 59);
        doc.rect(15, yPosition - 5, 180, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('⭐ Equipamento Principal', 20, yPosition + 5);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${diagnosticData.equipment.nome}`, 20, yPosition + 12);
        
        if (diagnosticData.equipment.beneficios) {
          const beneficios = diagnosticData.equipment.beneficios.split(';').slice(0, 2);
          beneficios.forEach((beneficio, index) => {
            doc.text(`• ${beneficio.trim()}`, 20, yPosition + 18 + (index * 5));
          });
        }
        
        yPosition += 40;
      }
      
      // Resumo Executivo
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('📊 Resumo Executivo', 20, yPosition);
      yPosition += 10;
      
      if (diagnosticData.targetAudience) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Público-alvo: ${diagnosticData.targetAudience}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (diagnosticData.currentRevenue && diagnosticData.revenueGoal) {
        doc.text(`Faturamento atual: ${diagnosticData.currentRevenue}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Meta de crescimento: ${diagnosticData.revenueGoal}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (diagnosticData.mainChallenges) {
        doc.text(`Principal desafio: ${diagnosticData.mainChallenges}`, 20, yPosition);
        yPosition += 10;
      }
      
      // Diagnóstico completo em nova página
      doc.addPage();
      yPosition = 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('🎯 Diagnóstico Completo', 20, yPosition);
      yPosition += 15;
      
      // Processar o texto do diagnóstico
      if (diagnosticData.generatedDiagnostic) {
        const sections = diagnosticData.generatedDiagnostic.split('##').filter(Boolean);
        
        sections.forEach((section) => {
          const lines = section.trim().split('\n');
          const title = lines[0].trim();
          
          if (yPosition > 260) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Título da seção
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(title, 20, yPosition);
          yPosition += 8;
          
          // Conteúdo da seção
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          const content = lines.slice(1).join('\n').trim();
          const wrappedText = doc.splitTextToSize(content, 170);
          
          wrappedText.forEach((line: string) => {
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 5;
          });
          
          yPosition += 5;
        });
      }
      
      // Footer em todas as páginas
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(139, 69, 244);
        doc.rect(0, 287, 210, 10, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 20, 293);
        doc.text(`Página ${i} de ${pageCount}`, 180, 293);
      }
      
      // Salvar PDF
      const fileName = `Diagnostico_Marketing_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Button
        onClick={generatePDF}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Download className="mr-2 h-5 w-5" />
        Baixar Relatório Completo (PDF)
      </Button>
    </motion.div>
  );
};

export default AuroraMarketingPDFGenerator;