
export const processPdfUrl = (url: string) => {
  if (!url) return { processedUrl: null };

  // Se for um link do Dropbox, converter para visualização direta
  if (url.includes('dropbox.com')) {
    // Remove qualquer parâmetro query da URL original do Dropbox
    const baseUrl = url.split('?')[0];
    const directUrl = baseUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    return { processedUrl: `${directUrl}#view=FitH` };
  }

  // Se for um link do Google Drive, tentar converter
  if (url.includes('drive.google.com')) {
    // Tenta extrair o ID do arquivo de forma mais segura
    const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([-\w]{25,})/);
    if (match && match[1]) {
      return { processedUrl: `https://drive.google.com/file/d/${match[1]}/preview` };
    }
  }

  // Para outras URLs, apenas adiciona o parâmetro de visualização se não for quebrar a URL
  // Verifica se a URL já possui um fragmento (#)
  if (url.includes('#')) {
    // Se já tem um fragmento, não adiciona outro para evitar quebrar a URL.
    // Idealmente, poderíamos analisar e adicionar/modificar `view=FitH` de forma mais inteligente,
    // mas por agora, vamos apenas retornar a URL como está para evitar quebras.
    // Ou, se preferir garantir o FitH, precisaria de uma lógica mais complexa para manipular o fragmento existente.
    return { processedUrl: url }; // Ou lógica mais complexa aqui
  } else {
    return { processedUrl: `${url}#view=FitH` };
  }
};

export const openPdfInNewTab = (url: string) => {
  const { processedUrl } = processPdfUrl(url);
  if (processedUrl) {
    window.open(processedUrl, '_blank');
  }
};

export const isPdfUrlValid = (url: string): boolean => {
  if (!url || url.trim() === '') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const downloadPdf = async (url: string, filename: string = 'documento.pdf') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw new Error('Não foi possível baixar o arquivo');
  }
};
