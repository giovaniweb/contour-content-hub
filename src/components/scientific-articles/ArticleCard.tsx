
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Tag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechnicalDocument } from "@/types/document";
import { format } from "date-fns";

interface ArticleCardProps {
  article: TechnicalDocument;
  viewMode: "grid" | "list";
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, viewMode, onClick }) => {
  const formattedDate = article.data_criacao 
    ? format(new Date(article.data_criacao), "MMM d, yyyy")
    : "No date";

  // For list view
  if (viewMode === "list") {
    return (
      <Card 
        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-fluida-blue/20 group"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex items-center p-4">
            <div className="p-2 bg-fluida-blue/10 rounded-lg mr-4">
              <FileText className="h-8 w-8 text-fluida-blue" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-fluida-blue transition-colors">
                {article.titulo}
              </h3>
              
              {article.descricao && (
                <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                  {article.descricao}
                </p>
              )}
              
              <div className="flex items-center gap-3 mt-2">
                {article.data_criacao && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formattedDate}
                  </div>
                )}
                
                {article.researchers && article.researchers.length > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {article.researchers.length === 1 
                      ? article.researchers[0] 
                      : `${article.researchers[0]} +${article.researchers.length - 1}`
                    }
                  </div>
                )}
              </div>
            </div>
            
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-fluida-blue/20 group h-full flex flex-col"
      onClick={onClick}
    >
      <div className="h-2 bg-gradient-to-r from-fluida-blue to-fluida-pink"></div>
      <CardContent className="p-5 pb-3 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-fluida-blue/10 rounded-lg mr-2">
            <FileText className="h-5 w-5 text-fluida-blue" />
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            PDF
          </Badge>
        </div>
        
        <h3 className="font-semibold line-clamp-2 group-hover:text-fluida-blue transition-colors">
          {article.titulo}
        </h3>
        
        {article.descricao && (
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
            {article.descricao}
          </p>
        )}
        
        {article.keywords && article.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.keywords.slice(0, 3).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs font-normal truncate max-w-[100px]">
                {keyword}
              </Badge>
            ))}
            {article.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{article.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-5 py-3 bg-muted/30 border-t flex justify-between">
        {article.data_criacao && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        )}
        
        {article.researchers && article.researchers.length > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            {article.researchers.length === 1 
              ? article.researchers[0].split(' ')[0] 
              : `${article.researchers.length} authors`
            }
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
