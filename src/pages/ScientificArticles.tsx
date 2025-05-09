
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Filter, Eye, Upload } from "lucide-react";
import PDFViewerModal from "@/components/pdf/PDFViewerModal";
import { toast } from "sonner";
import { downloadPdf } from "@/utils/pdfUtils";

const articles = [
  {
    id: "1",
    title: "Eficácia do Tratamento X no Rejuvenescimento Facial: Um Estudo Clínico",
    authors: "Silva, M.; Pereira, J.; Santos, L.",
    journal: "Revista Brasileira de Dermatologia",
    year: 2025,
    abstract: "Este estudo analisa os efeitos do Tratamento X em pacientes com sinais de envelhecimento facial, demonstrando uma melhora significativa em 87% dos casos após 4 semanas de tratamento.",
    tags: ["rejuvenescimento", "estudo clínico", "dermatologia"],
    pdfUrl: "https://example.com/article1.pdf"
  },
  {
    id: "2",
    title: "Análise Comparativa entre Procedimentos não Invasivos para Flacidez Facial",
    authors: "Oliveira, A.; Costa, R.",
    journal: "Journal of Clinical Aesthetics",
    year: 2024,
    abstract: "Uma comparação abrangente entre cinco procedimentos não invasivos para tratamento de flacidez facial, evidenciando vantagens e desvantagens de cada método.",
    tags: ["flacidez", "não invasivo", "comparativo"],
    pdfUrl: "https://example.com/article2.pdf"
  },
  {
    id: "3",
    title: "Efeitos Colaterais em Procedimentos Estéticos com Ácido Hialurônico",
    authors: "Martins, P.; Rodrigues, T.; Alves, V.",
    journal: "Aesthetic Medicine Research",
    year: 2025,
    abstract: "Investigação sobre os efeitos colaterais mais comuns em procedimentos que utilizam ácido hialurônico e métodos para mitigar riscos.",
    tags: ["ácido hialurônico", "efeitos colaterais", "segurança"],
    pdfUrl: "https://example.com/article3.pdf"
  },
  {
    id: "4",
    title: "Protocolos de Tratamento para Hiperpigmentação Pós-Inflamatória",
    authors: "Carvalho, F.; Lima, S.",
    journal: "International Journal of Dermatology",
    year: 2024,
    abstract: "Este artigo propõe protocolos de tratamento para hiperpigmentação pós-inflamatória em diferentes fototipos de pele, com resultados documentados em 120 pacientes.",
    tags: ["hiperpigmentação", "protocolos", "pós-inflamatória"],
    pdfUrl: "https://example.com/article4.pdf"
  }
];

const ScientificArticles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleViewPdf = (article: typeof articles[0]) => {
    setSelectedArticle(article);
    setPdfModalOpen(true);
  };
  
  const handleDownloadPdf = async (article: typeof articles[0]) => {
    try {
      setIsDownloading({...isDownloading, [article.id]: true});
      await downloadPdf(
        article.pdfUrl, 
        `${article.title.replace(/\s+/g, '_')}.pdf`
      );
      toast.success("Download iniciado", {
        description: "O arquivo está sendo baixado"
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Erro ao baixar o arquivo", {
        description: "Não foi possível iniciar o download"
      });
    } finally {
      setIsDownloading({...isDownloading, [article.id]: false});
    }
  };
  
  return (
    <Layout title="Artigos Científicos">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Artigos Científicos</h1>
            <p className="text-muted-foreground">Base de conhecimento científico para embasar seus tratamentos</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar artigos..."
                className="pl-9 min-w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>
                  {article.authors} • {article.journal}, {article.year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {article.abstract}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleViewPdf(article)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadPdf(article)}
                  disabled={isDownloading[article.id]}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isDownloading[article.id] ? "Baixando..." : "Download"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium">Nenhum artigo encontrado</h2>
            <p className="text-muted-foreground">
              Tente alterar seus termos de busca ou filtros
            </p>
          </div>
        )}
        
        {selectedArticle && (
          <PDFViewerModal
            open={pdfModalOpen}
            onOpenChange={setPdfModalOpen}
            pdfUrl={selectedArticle.pdfUrl}
            title={selectedArticle.title}
            filename={`${selectedArticle.title.replace(/\s+/g, '_')}.pdf`}
          />
        )}
      </div>
    </Layout>
  );
};

export default ScientificArticles;
