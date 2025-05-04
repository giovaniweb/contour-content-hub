import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Search, Edit, Download, Calendar } from "lucide-react";
import { getScriptHistory, ScriptHistoryItem, generatePDF } from "@/utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const ScriptHistory: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewingScript, setViewingScript] = useState<ScriptHistoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: scripts, isLoading, isError, refetch } = useQuery({
    queryKey: ["scriptHistory"],
    queryFn: () => getScriptHistory(),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewScript = (script: ScriptHistoryItem) => {
    setViewingScript(script);
    setIsDialogOpen(true);
  };

  const handleDownloadPDF = async (scriptId: string) => {
    try {
      setIsDownloading(true);
      
      const pdfUrl = await generatePDF(scriptId);
      
      // Simulação de download do PDF
      toast({
        title: "PDF Gerado",
        description: "O PDF do roteiro foi gerado com sucesso!",
      });
      
      // Em uma implementação real, você redirecionaria para o URL ou abriria em nova aba
      handleOpenPDF(pdfUrl);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente novamente.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenPDF = (pdfUrl: string) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast({
        variant: "destructive",
        title: "PDF não disponível",
        description: "Não há PDF disponível para este roteiro"
      });
    }
  };

  // Aplicar filtros na lista de roteiros
  const filteredScripts = scripts
    ? scripts.filter((script) => {
        const matchesSearch =
          searchQuery === "" ||
          script.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
          !typeFilter || typeFilter === "all" || script.type === typeFilter;

        const matchesStatus =
          !statusFilter || statusFilter === "all" || script.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

  // Função para renderizar o tipo de roteiro
  const renderScriptType = (type: string) => {
    switch (type) {
      case "videoScript":
        return <Badge variant="default">Vídeo</Badge>;
      case "bigIdea":
        return <Badge variant="secondary">Campanha</Badge>;
      case "dailySales":
        return <Badge variant="outline">Vendas</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Função para renderizar o status do roteiro
  const renderScriptStatus = (status: string) => {
    switch (status) {
      case "gerado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Gerado</Badge>;
      case "aprovado":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case "editado":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Editado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout title="Histórico de Roteiros">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Roteiros</CardTitle>
          <CardDescription>
            Visualize, edite e exporte roteiros gerados anteriormente
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Filtros e busca */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                className="pl-10"
                placeholder="Buscar roteiro..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={typeFilter || "all"} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tipo de Roteiro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo</SelectLabel>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="videoScript">Vídeo</SelectItem>
                    <SelectItem value="bigIdea">Campanha</SelectItem>
                    <SelectItem value="dailySales">Vendas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="gerado">Gerado</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="editado">Editado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Ocorreu um erro ao carregar os roteiros. Por favor, tente novamente.
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : filteredScripts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || typeFilter || statusFilter ? (
                <>
                  Nenhum roteiro encontrado com os filtros aplicados.
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("");
                      setTypeFilter(null);
                      setStatusFilter(null);
                    }}
                    className="mt-2"
                  >
                    Limpar filtros
                  </Button>
                </>
              ) : (
                "Nenhum roteiro foi gerado ainda. Acesse o Gerador de Roteiros para criar seu primeiro roteiro."
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScripts.map((script) => (
                    <TableRow key={script.id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        {script.title}
                      </TableCell>
                      <TableCell>{renderScriptType(script.type)}</TableCell>
                      <TableCell>
                        {format(new Date(script.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{renderScriptStatus(script.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewScript(script)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              /* Adicionar funcionalidade de edição */
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPDF(script.id)}
                            disabled={isDownloading}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              /* Adicionar funcionalidade de agendar */
                            }}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar roteiro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingScript?.title}</DialogTitle>
          </DialogHeader>
          
          {viewingScript && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {renderScriptType(viewingScript.type)}
                  {renderScriptStatus(viewingScript.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(viewingScript.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: viewingScript.contentHtml }} />
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    /* Adicionar funcionalidade de edição */
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Roteiro
                </Button>
                
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF(viewingScript.id)}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={() => {
                      /* Adicionar funcionalidade de agendar */
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ScriptHistory;
