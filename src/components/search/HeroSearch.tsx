
import React, { useState, useRef } from 'react';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import SearchStyles from './SearchStyles';
import { useTypingEffect } from './useTypingEffect';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  suggestions = [
    "Crie roteiro para vídeo sobre rejuvenescimento facial",
    "Estratégias para Instagram sobre estética avançada",
    "Conteúdo para profissionais da medicina estética",
    "Ideias para promover tratamento de criolipólise",
    "Como criar conteúdo para atrair clientes de procedimentos estéticos",
  ],
  placeholder = "Digite sua consulta ou comando..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { typingText } = useTypingEffect({
    suggestions,
    isFocused,
    query
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <SearchStyles />
      
      <SearchInput 
        query={query}
        onQueryChange={(e) => setQuery(e.target.value)}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        inputRef={inputRef}
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        typingText={typingText}
      />
      
      <SearchSuggestions 
        suggestions={suggestions}
        isFocused={isFocused}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};

export default HeroSearch;
