import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Download, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut,
  Move,
  Crop,
  Palette,
  Type,
  Layers,
  Save,
  Share2,
  Eye,
  Split,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface Template {
  id: string;
  name: string;
  layout: 'side-by-side' | 'top-bottom' | 'slider' | 'overlay';
  style: any;
}

const BeforeAfterBuilder: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [template, setTemplate] = useState<Template>({
    id: 'side-by-side',
    name: 'Lado a Lado',
    layout: 'side-by-side',
    style: {}
  });
  const [sliderPosition, setSliderPosition] = useState([50]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [beforeLabel, setBeforeLabel] = useState('ANTES');
  const [afterLabel, setAfterLabel] = useState('DEPOIS');
  const [fontSize, setFontSize] = useState([24]);
  const [labelColor, setLabelColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [showLabels, setShowLabels] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const templates: Template[] = [
    { id: 'side-by-side', name: 'Lado a Lado', layout: 'side-by-side', style: {} },
    { id: 'top-bottom', name: 'Cima/Baixo', layout: 'top-bottom', style: {} },
    { id: 'slider', name: 'Slider Interativo', layout: 'slider', style: {} },
    { id: 'overlay', name: 'Sobreposição', layout: 'overlay', style: {} }
  ];

  const handleImageUpload = useCallback((file: File, type: 'before' | 'after') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforeImage(result);
        } else {
          setAfterImage(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem');
    }
  }, []);

  const generateComparison = async () => {
    if (!beforeImage || !afterImage) {
      toast.error('Por favor, adicione as duas imagens');
      return;
    }

    if (!canvasRef.current) {
      toast.error('Erro ao gerar imagem');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // Criar link para download
      const link = document.createElement('a');
      link.download = `antes-depois-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Imagem de comparação gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderComparison = () => {
    if (!beforeImage || !afterImage) return null;

    const commonImageStyle = {
      width: '100%',
      height: '400px',
      objectFit: 'cover' as const,
      borderRadius: '8px'
    };

    switch (template.layout) {
      case 'side-by-side':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <img src={beforeImage} alt="Antes" style={commonImageStyle} />
              {showLabels && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {beforeLabel}
                </div>
              )}
            </div>
            <div className="relative">
              <img src={afterImage} alt="Depois" style={commonImageStyle} />
              {showLabels && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {afterLabel}
                </div>
              )}
            </div>
          </div>
        );

      case 'top-bottom':
        return (
          <div className="space-y-4">
            <div className="relative">
              <img src={beforeImage} alt="Antes" style={commonImageStyle} />
              {showLabels && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {beforeLabel}
                </div>
              )}
            </div>
            <div className="relative">
              <img src={afterImage} alt="Depois" style={commonImageStyle} />
              {showLabels && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {afterLabel}
                </div>
              )}
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="relative overflow-hidden rounded-lg" style={{ height: '400px' }}>
            <img 
              src={afterImage} 
              alt="Depois" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition[0]}%` }}
            >
              <img 
                src={beforeImage} 
                alt="Antes" 
                className="w-full h-full object-cover"
                style={{ width: '100vw' }}
              />
            </div>
            
            {/* Slider line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition[0]}%` }}
            >
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Split className="h-4 w-4 text-gray-800" />
              </div>
            </div>

            {/* Labels */}
            {showLabels && (
              <>
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {beforeLabel}
                </div>
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {afterLabel}
                </div>
              </>
            )}
          </div>
        );

      case 'overlay':
        return (
          <div className="relative" style={{ height: '400px' }}>
            <img 
              src={afterImage} 
              alt="Depois" 
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <img 
              src={beforeImage} 
              alt="Antes" 
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              style={{ opacity: sliderPosition[0] / 100 }}
            />
            
            {showLabels && (
              <>
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {beforeLabel}
                </div>
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full font-bold"
                  style={{ 
                    fontSize: `${fontSize[0]}px`, 
                    color: labelColor,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                >
                  {afterLabel}
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Layers className="h-6 w-6 text-aurora-electric-purple" />
            🎨 Montador Antes & Depois
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                  <TabsTrigger value="images">Imagens</TabsTrigger>
                  <TabsTrigger value="style">Estilo</TabsTrigger>
                  <TabsTrigger value="export">Exportar</TabsTrigger>
                </TabsList>

                <TabsContent value="images" className="space-y-4">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white mb-2">Imagem ANTES</Label>
                      <div
                        className="border-2 border-dashed border-aurora-electric-purple/50 rounded-lg p-4 text-center hover:border-aurora-electric-purple/70 transition-colors cursor-pointer"
                        onClick={() => beforeInputRef.current?.click()}
                      >
                        {beforeImage ? (
                          <img src={beforeImage} alt="Antes" className="w-full h-24 object-cover rounded" />
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 text-aurora-electric-purple mx-auto" />
                            <p className="text-white text-sm">Clique para adicionar</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={beforeInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'before');
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2">Imagem DEPOIS</Label>
                      <div
                        className="border-2 border-dashed border-aurora-electric-purple/50 rounded-lg p-4 text-center hover:border-aurora-electric-purple/70 transition-colors cursor-pointer"
                        onClick={() => afterInputRef.current?.click()}
                      >
                        {afterImage ? (
                          <img src={afterImage} alt="Depois" className="w-full h-24 object-cover rounded" />
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 text-aurora-electric-purple mx-auto" />
                            <p className="text-white text-sm">Clique para adicionar</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={afterInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, 'after');
                        }}
                      />
                    </div>
                  </div>

                  {/* Template Selection */}
                  <div>
                    <Label className="text-white mb-2">Template</Label>
                    <Select 
                      value={template.id} 
                      onValueChange={(value) => {
                        const newTemplate = templates.find(t => t.id === value) || templates[0];
                        setTemplate(newTemplate);
                      }}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-aurora-electric-purple/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((tmpl) => (
                          <SelectItem key={tmpl.id} value={tmpl.id}>
                            {tmpl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Slider Controls */}
                  {(template.layout === 'slider' || template.layout === 'overlay') && (
                    <div>
                      <Label className="text-white mb-2">
                        {template.layout === 'slider' ? 'Posição do Slider' : 'Opacidade'}
                      </Label>
                      <Slider
                        value={sliderPosition}
                        onValueChange={setSliderPosition}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-400 mt-1">{sliderPosition[0]}%</div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  {/* Title and Description */}
                  <div>
                    <Label className="text-white mb-2">Título</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Resultado do tratamento"
                      className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2">Descrição</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descrição do procedimento..."
                      className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      rows={3}
                    />
                  </div>

                  {/* Labels */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-white mb-2">Label ANTES</Label>
                      <Input
                        value={beforeLabel}
                        onChange={(e) => setBeforeLabel(e.target.value)}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2">Label DEPOIS</Label>
                      <Input
                        value={afterLabel}
                        onChange={(e) => setAfterLabel(e.target.value)}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>
                  </div>

                  {/* Style Options */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                    />
                    <Label className="text-white">Mostrar labels</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showTitle}
                      onCheckedChange={setShowTitle}
                    />
                    <Label className="text-white">Mostrar título</Label>
                  </div>

                  <div>
                    <Label className="text-white mb-2">Tamanho da Fonte</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={48}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 mt-1">{fontSize[0]}px</div>
                  </div>

                  <div>
                    <Label className="text-white mb-2">Cor das Labels</Label>
                    <Input
                      type="color"
                      value={labelColor}
                      onChange={(e) => setLabelColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-2">Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                  <Button
                    onClick={generateComparison}
                    disabled={!beforeImage || !afterImage || isGenerating}
                    className="w-full bg-gradient-to-r from-aurora-electric-purple to-pink-600 hover:opacity-90 text-white"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Gerando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Baixar Imagem
                      </div>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: title || 'Comparação Antes e Depois',
                          text: description || 'Veja os resultados incríveis!'
                        });
                      } else {
                        toast.info('Compartilhamento não disponível neste navegador');
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div 
                ref={canvasRef}
                className="p-6 rounded-lg"
                style={{ backgroundColor }}
              >
                {showTitle && title && (
                  <div className="text-center mb-6">
                    <h2 
                      className="font-bold"
                      style={{ 
                        fontSize: `${fontSize[0] + 8}px`, 
                        color: labelColor 
                      }}
                    >
                      {title}
                    </h2>
                    {description && (
                      <p 
                        className="mt-2"
                        style={{ 
                          fontSize: `${fontSize[0] - 4}px`, 
                          color: labelColor,
                          opacity: 0.8
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                )}
                
                {renderComparison()}
                
                {!beforeImage || !afterImage ? (
                  <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-400 rounded-lg">
                    <p className="text-gray-400">Adicione as duas imagens para ver a comparação</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BeforeAfterBuilder;