

import { useEffect, useState } from "react";

export function useAkinatorMystic(progress: number) {
  const [phrase, setPhrase] = useState('Preparando a consulta mágica...');

  useEffect(() => {
    const phrases = [
      'Consultando os astros da beleza...',
      'Analisando sua essência estética...',
      'Descobrindo seus desejos secretos...',
      'Conectando com energias transformadoras...',
      'Revelando o equipamento perfeito...',
      'Finalizando o diagnóstico mágico...'
    ];
    const phraseIndex = Math.floor((progress / 100) * (phrases.length - 1));
    setPhrase(phrases[phraseIndex] || phrases[0]);
  }, [progress]);

  return phrase;
}
