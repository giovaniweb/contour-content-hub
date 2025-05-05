
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeroSectionProps {
  userName: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}"`,
      });
      // Aqui implementaríamos a lógica real de busca
    }
  };

  return (
    <section className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-6 shadow-sm">
      <div className="max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 animate-fade-in">
          Olá, {userName}! O que você quer fazer hoje?
        </h1>
        
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <Input
            type="text"
            placeholder="Pesquisar roteiros, equipamentos, conteúdos..."
            className="bg-white border-gray-200 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
