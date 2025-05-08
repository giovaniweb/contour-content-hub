
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, 
  Filter, 
  Grid3x3, 
  List, 
  Upload, 
  Paperclip,
  FileText,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TechnicalDocument } from "@/types/document";
import ArticleUploadDialog from "@/components/scientific-articles/ArticleUploadDialog";
import ArticleCard from "@/components/scientific-articles/ArticleCard";
import ArticleViewModal from "@/components/scientific-articles/ArticleViewModal";

const ScientificArticles: React.FC = () => {
  const [articles, setArticles] = useState<TechnicalDocument[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<TechnicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TechnicalDocument | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles whenever search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = articles.filter(article => 
        article.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.researchers?.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documentos_tecnicos')
        .select('*')
        .eq('tipo', 'artigo_cientifico')
        .order('data_criacao', { ascending: false });
        
      if (error) throw error;
      
      // Add type assertion to fix the type incompatibility
      setArticles((data || []) as TechnicalDocument[]);
      setFilteredArticles((data || []) as TechnicalDocument[]);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Failed to load articles",
        description: "Could not retrieve scientific articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: TechnicalDocument) => {
    setSelectedArticle(article);
  };

  const handleUploadSuccess = () => {
    fetchArticles();
    setShowUploadDialog(false);
    toast({
      title: "Article uploaded",
      description: "Your scientific article has been successfully uploaded.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fluida-blue to-fluida-pink">
              Scientific Articles
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload, read and interact with scientific articles
            </p>
          </div>
          
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Article
          </Button>
        </div>

        {/* Filters and search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={viewMode === "list" ? "bg-muted" : ""}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Articles Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="h-64 animate-pulse bg-muted">
                <CardContent className="p-0 h-full"></CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                viewMode={viewMode}
                onClick={() => handleArticleClick(article)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-background">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No scientific articles found</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              {searchQuery ? "Try a different search term or " : ""}
              Upload your first scientific article to get started
            </p>
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="bg-gradient-to-r from-fluida-blue to-fluida-pink hover:opacity-90 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Article
            </Button>
          </div>
        )}

        {/* Upload Dialog */}
        <ArticleUploadDialog
          open={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          onSuccess={handleUploadSuccess}
        />

        {/* Article View Modal */}
        {selectedArticle && (
          <ArticleViewModal
            article={selectedArticle}
            open={!!selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default ScientificArticles;
