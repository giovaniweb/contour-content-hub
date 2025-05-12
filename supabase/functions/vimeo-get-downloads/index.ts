
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Função para mapear a qualidade do vídeo do Vimeo para nosso formato VideoDownloadFile[]
const mapVimeoQualityToDownloadFiles = (downloadItems: any[]) => {
  const downloadFiles: Array<{ quality: string, link: string }> = [];

  if (!downloadItems || !Array.isArray(downloadItems) || downloadItems.length === 0) {
    console.log("Sem itens de download disponíveis");
    return downloadFiles;
  }

  // Ordenamos por tamanho para garantir que pegamos o maior arquivo para cada qualidade
  const sortedItems = [...downloadItems].sort((a, b) => 
    (b.size || 0) - (a.size || 0)
  );

  // Log para debug
  console.log(`Processando ${downloadItems.length} opções de download`);
  
  // Processa a qualidade original
  const original = sortedItems.find(item => item.quality === "source");
  if (original) {
    downloadFiles.push({
      quality: "Original",
      link: original.link
    });
    console.log("Definido link original");
  }
  
  // Processa HD (720p ou maior)
  const hdItem = sortedItems.find(item => 
    item.quality === "hd" || 
    item.rendition === "1080p" || 
    item.rendition === "720p" ||
    (item.width && item.width >= 1280)
  );
  
  if (hdItem) {
    downloadFiles.push({
      quality: "HD (720p)",
      link: hdItem.link
    });
    console.log(`Definido link HD: ${hdItem.rendition || hdItem.quality}`);
  }
  
  // Processa SD (540p ou 480p)
  const sdItem = sortedItems.find(item => 
    item.quality === "sd" || 
    item.rendition === "540p" || 
    item.rendition === "480p" ||
    (item.width && item.width >= 640 && item.width < 1280)
  );
  
  if (sdItem) {
    downloadFiles.push({
      quality: "SD (480p)",
      link: sdItem.link
    });
    console.log(`Definido link SD: ${sdItem.rendition || sdItem.quality}`);
  }
  
  // Processa web otimizado (360p ou menor)
  const webItem = sortedItems.find(item => 
    item.quality === "mobile" || 
    item.rendition === "360p" || 
    item.rendition === "240p" ||
    (item.width && item.width < 640)
  );
  
  if (webItem) {
    downloadFiles.push({
      quality: "Web (Otimizado)",
      link: webItem.link
    });
    console.log(`Definido link web_optimized: ${webItem.rendition || webItem.quality}`);
  }

  // Garantir que temos pelo menos algum link
  if (downloadFiles.length === 0 && sortedItems.length > 0) {
    downloadFiles.push({
      quality: "Original",
      link: sortedItems[0].link
    });
    console.log("Usando primeiro item como original por falta de opções melhores");
  }

  return downloadFiles;
};

// Para compatibilidade com o formato antigo
const mapVimeoQualityToVideoFile = (downloadItems: any[]) => {
  const videoFile: {
    original?: string;
    hd?: string;
    sd?: string;
    web_optimized?: string;
  } = {};

  if (!downloadItems || !Array.isArray(downloadItems) || downloadItems.length === 0) {
    return videoFile;
  }

  // Ordenamos por tamanho para garantir que pegamos o maior arquivo para cada qualidade
  const sortedItems = [...downloadItems].sort((a, b) => 
    (b.size || 0) - (a.size || 0)
  );
  
  for (const item of sortedItems) {
    const { quality, link, rendition, width } = item;
    
    // Original (maior qualidade)
    if (!videoFile.original && quality === "source") {
      videoFile.original = link;
      continue;
    }
    
    // HD (720p ou maior)
    if (!videoFile.hd && (
      quality === "hd" || 
      rendition === "1080p" || 
      rendition === "720p" ||
      (width && width >= 1280)
    )) {
      videoFile.hd = link;
      continue;
    }
    
    // SD (qualidade padrão, normalmente 540p ou 480p)
    if (!videoFile.sd && (
      quality === "sd" || 
      rendition === "540p" || 
      rendition === "480p" ||
      (width && width >= 640 && width < 1280)
    )) {
      videoFile.sd = link;
      continue;
    }
    
    // Web otimizado (qualidades mais baixas)
    if (!videoFile.web_optimized && (
      quality === "mobile" || 
      rendition === "360p" || 
      rendition === "240p" ||
      (width && width < 640)
    )) {
      videoFile.web_optimized = link;
      continue;
    }
  }

  // Garantir que temos pelo menos algum link
  if (!videoFile.original && !videoFile.hd && !videoFile.sd && !videoFile.web_optimized) {
    // Se não encontramos nenhuma qualidade específica, use o primeiro item
    if (sortedItems.length > 0) {
      videoFile.original = sortedItems[0].link;
    }
  }

  return videoFile;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vimeoId } = await req.json();

    if (!vimeoId) {
      throw new Error('ID do vídeo do Vimeo é obrigatório');
    }

    console.log(`Buscando downloads para vídeo do Vimeo: ${vimeoId}`);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Configuração do Supabase incompleta');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar o token do Vimeo do usuário atual
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_vimeo_tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData) {
      console.error('Erro ao obter token do Vimeo:', tokenError);
      throw new Error('Token de acesso do Vimeo não encontrado. Você precisa conectar sua conta do Vimeo primeiro.');
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Token do Vimeo expirado. Por favor, reconecte sua conta.');
    }

    // Chamar a API do Vimeo para obter os links de download
    const vimeoResponse = await fetch(`https://api.vimeo.com/videos/${vimeoId}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    });

    if (!vimeoResponse.ok) {
      const errorText = await vimeoResponse.text();
      console.error(`Erro na API do Vimeo: ${vimeoResponse.status}`, errorText);
      throw new Error(`Falha ao buscar dados do vídeo do Vimeo: ${vimeoResponse.status}`);
    }

    const vimeoData = await vimeoResponse.json();
    
    console.log("Dados do Vimeo obtidos com sucesso");
    
    // Verificar se temos permissões para downloads
    if (!vimeoData.download || !Array.isArray(vimeoData.download)) {
      console.log("Sem permissões de download ou downloads não disponíveis");
      return new Response(JSON.stringify({
        success: false,
        error: "Este vídeo não tem opções de download disponíveis ou você não tem permissões para baixá-lo",
        data: {
          title: vimeoData.name,
          description: vimeoData.description,
          thumbnail_url: vimeoData.pictures?.sizes?.[0]?.link,
          video_url: `https://vimeo.com/${vimeoId}`,
          file_urls: {},
          download_files: []
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Extrair metadados básicos e links de download em diferentes qualidades
    const videoFile = mapVimeoQualityToVideoFile(vimeoData.download);
    const downloadFiles = mapVimeoQualityToDownloadFiles(vimeoData.download);
    
    // Construir resposta com todas as informações
    const response = {
      success: true,
      data: {
        id: vimeoId,
        title: vimeoData.name,
        description: vimeoData.description,
        url: `https://vimeo.com/${vimeoId}`,
        thumbnail_url: vimeoData.pictures?.sizes?.[vimeoData.pictures?.sizes?.length - 1]?.link,
        file_urls: videoFile, // Formato antigo
        download_files: downloadFiles, // Novo formato
        duration_seconds: vimeoData.duration,
        duration: (() => {
          const minutes = Math.floor(vimeoData.duration / 60);
          const seconds = vimeoData.duration % 60;
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        })(),
        metadata: {
          dimensions: {
            width: vimeoData.width,
            height: vimeoData.height
          },
          fileSize: vimeoData.size,
          original_filename: vimeoData.name
        }
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Erro na função vimeo-get-downloads:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Falha ao obter links de download do vídeo do Vimeo'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
