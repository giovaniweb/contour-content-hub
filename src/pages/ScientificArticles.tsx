
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Download, ExternalLink, Calendar, FilePdf, Star, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import PDFViewerModal from "@/components/pdf/PDFViewerModal";
import { openPdfInNewTab, downloadPdf } from "@/utils/pdfUtils";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Sample data for articles
const articleData = [
  {
    id: 1,
    title: "Eficácia do Tratamento X no Rejuvenescimento Facial: Um Estudo Clínico",
    authors: ["Dr. Maria Silva", "Dr. João Santos"],
    journal: "Journal of Modern Aesthetics",
    date: "2025-04-15",
    abstract: "Este estudo avalia a eficácia do inovador Tratamento X no rejuvenescimento facial, comparando resultados em 120 pacientes ao longo de 6 meses. Os resultados mostram melhora significativa na qualidade da pele e redução de rugas.",
    keywords: ["rejuvenescimento facial", "tratamento X", "estudo clínico", "dermatologia"],
    pdfUrl: "https://firebasestorage.googleapis.com/v0/b/myprivateapp-123456.appspot.com/o/article1.pdf?alt=media&token=abc123",
    favorite: true
  },
  {
    id: 2,
    title: "Análise Comparativa entre os Métodos Y e Z para Tratamento de Flacidez: Revisão Sistemática",
    authors: ["Dra. Ana Ferreira", "Dr. Carlos Mendes"],
    journal: "International Journal of Aesthetic Research",
    date: "2025-03-22",
    abstract: "Esta revisão sistemática compara os métodos Y e Z para o tratamento de flacidez cutânea, analisando 15 estudos clínicos com um total de 800 pacientes. As evidências apontam para uma superioridade do Método Y em termos de durabilidade dos resultados.",
    keywords: ["flacidez cutânea", "método Y", "método Z", "revisão sistemática"],
    pdfUrl: "https://firebasestorage.googleapis.com/v0/b/myprivateapp-123456.appspot.com/o/article2.pdf?alt=media&token=def456",
    favorite: false
  },
  {
    id: 3,
    title: "Impacto do Equipamento W na Redução do Tempo de Recuperação após Procedimentos Estéticos",
    authors: ["Dr. Paulo Oliveira", "Dra. Juliana Costa"],
    journal: "Clinical Aesthetics & Procedures",
    date: "2025-02-10",
    abstract: "Este estudo avalia como o uso do Equipamento W impacta no tempo de recuperação de pacientes submetidos a procedimentos estéticos minimamente invasivos. Os dados demonstram redução de até 40% no tempo de recuperação em comparação com técnicas tradicionais.",
    keywords: ["tempo de recuperação", "equipamento W", "procedimentos estéticos", "minimamente invasivo"],
    pdfUrl: "https://firebasestorage.googleapis.com/v0/b/myprivateapp-123456.appspot.com/o/article3.pdf?alt=media&token=ghi789",
    favorite: true
  }
];

const ScientificArticles: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<{ url: string, title: string, filename?: string } | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter articles based on search query
  const filteredArticles = articleData.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleOpenPdf = (article: any) => {
    setSelectedPdf({
      url: article.pdfUrl,
      title: article.title,
      filename: `${article.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    });
    setIsPdfModalOpen(true);
  };
  
  const handleDownloadPdf = async (article: any) => {
    try {
      await downloadPdf(
        article.pdfUrl, 
        `${article.title.replace(/\s+/g, '-').toLowerCase()}.pdf`
      );
      
      toast({
        title: "Download iniciado",
        description: "O artigo científico está sendo baixado."
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao baixar",
        description: "Não foi possível baixar o documento. Tente novamente."
      });
    }
  };
  
  const handleRegisterArticle = () => {
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setIsUploading(false);
      setIsRegisterModalOpen(false);
      
      toast({
        title: "Artigo registrado com sucesso",
        description: "O novo artigo científico foi adicionado à biblioteca."
      });
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-contourline-darkBlue">Artigos Científicos</h1>
            <p className="text-muted-foreground">Biblioteca de artigos científicos e estudos relevantes</p>
          </div>
          
          <div className="flex sm:space-x-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar artigos..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
              <DialogTrigger asChild>
                <Button className="hidden sm:flex">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Artigo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Novo Artigo Científico</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Artigo</Label>
                    <Input id="title" placeholder="Insira o título completo do artigo" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="authors">Autores</Label>
                    <Input id="authors" placeholder="Separe os nomes dos autores por vírgulas" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="journal">Periódico</Label>
                      <Input id="journal" placeholder="Nome do periódico" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Data de Publicação</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input id="keywords" placeholder="Separe as palavras-chave por vírgulas" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="abstract">Resumo</Label>
                    <Textarea id="abstract" placeholder="Insira o resumo do artigo" rows={4} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo PDF</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-8">
                      <label 
                        htmlFor="file-upload" 
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <FilePdf className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="font-medium">Clique para fazer upload</span>
                        <span className="text-sm text-muted-foreground mt-1">
                          ou arraste e solte o arquivo PDF aqui
                        </span>
                        <input 
                          id="file-upload" 
                          type="file" 
                          accept=".pdf" 
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parse" />
                    <Label htmlFor="parse">
                      Extrair metadados automaticamente do PDF
                    </Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRegisterModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleRegisterArticle} disabled={isUploading}>
                    {isUploading ? 'Processando...' : 'Registrar Artigo'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Button className="sm:hidden w-full">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Artigo
        </Button>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-6">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum artigo encontrado para: "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery("")} className="mt-4">Limpar busca</Button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren(0.1)}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {filteredArticles.map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                            <CardDescription>
                              {article.authors.join(", ")}
                            </CardDescription>
                          </div>
                          {article.favorite && (
                            <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                          <FileText className="h-4 w-4" />
                          <span>{article.journal}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {article.abstract}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {article.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1.5"
                          onClick={() => handleOpenPdf(article)}
                        >
                          <FileText className="h-4 w-4" />
                          Visualizar PDF
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="flex items-center gap-1.5"
                          onClick={() => handleDownloadPdf(article)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="sm:ml-auto flex items-center gap-1.5"
                          onClick={() => {
                            /* Toggle favorite */
                            toast({
                              title: article.favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
                              description: article.title
                            });
                          }}
                        >
                          <Star className={`h-4 w-4 ${article.favorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          {article.favorite ? "Desfavoritar" : "Favoritar"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="pt-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren(0.1)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {articleData
                .filter(article => article.favorite)
                .map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <Card className="h-full">
                      {/* Same card content as above for favorites */}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                            <CardDescription>
                              {article.authors.join(", ")}
                            </CardDescription>
                          </div>
                          {article.favorite && (
                            <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Same content as above */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                          <FileText className="h-4 w-4" />
                          <span>{article.journal}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {article.abstract}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {article.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1.5"
                          onClick={() => handleOpenPdf(article)}
                        >
                          <FileText className="h-4 w-4" />
                          Visualizar PDF
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="flex items-center gap-1.5"
                          onClick={() => handleDownloadPdf(article)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="sm:ml-auto flex items-center gap-1.5"
                          onClick={() => {
                            /* Toggle favorite */
                            toast({
                              title: "Removido dos favoritos",
                              description: article.title
                            });
                          }}
                        >
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          Desfavoritar
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recent" className="pt-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren(0.1)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Show articles sorted by date, newest first */}
              {articleData
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <Card className="h-full">
                      {/* Same card content as above */}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                            <CardDescription>
                              {article.authors.join(", ")}
                            </CardDescription>
                          </div>
                          {article.favorite && (
                            <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Same content as above */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                          <FileText className="h-4 w-4" />
                          <span>{article.journal}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {article.abstract}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {article.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-1.5"
                          onClick={() => handleOpenPdf(article)}
                        >
                          <FileText className="h-4 w-4" />
                          Visualizar PDF
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="flex items-center gap-1.5"
                          onClick={() => handleDownloadPdf(article)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="sm:ml-auto flex items-center gap-1.5"
                          onClick={() => {
                            /* Toggle favorite */
                            toast({
                              title: article.favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
                              description: article.title
                            });
                          }}
                        >
                          <Star className={`h-4 w-4 ${article.favorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          {article.favorite ? "Desfavoritar" : "Favoritar"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewerModal
          open={isPdfModalOpen}
          onOpenChange={setIsPdfModalOpen}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
          filename={selectedPdf.filename}
        />
      )}
    </Layout>
  );
};

export default ScientificArticles;
