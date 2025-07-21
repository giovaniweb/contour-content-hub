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
  const [logoImage, setLogoImage] = useState<string | null>(null);
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
  const [labelColor, setLabelColor] = useState('#333333');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [titleColor, setTitleColor] = useState('#1f2937'); // Cor do título
  const [descriptionColor, setDescriptionColor] = useState('#6b7280'); // Cor da descrição
  const [showLabels, setShowLabels] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [logoSize, setLogoSize] = useState([60]);
  const [logoPosition, setLogoPosition] = useState('center');
  
  // Controles de posicionamento das imagens
  const [beforeImageScale, setBeforeImageScale] = useState([100]);
  const [afterImageScale, setAfterImageScale] = useState([100]);
  const [beforeImageX, setBeforeImageX] = useState([0]);
  const [beforeImageY, setBeforeImageY] = useState([0]);
  const [afterImageX, setAfterImageX] = useState([0]);
  const [afterImageY, setAfterImageY] = useState([0]);
  const [beforeImageRotation, setBeforeImageRotation] = useState([0]);
  const [afterImageRotation, setAfterImageRotation] = useState([0]);
  
  // Estados para drag and drop
  const [isDragging, setIsDragging] = useState<'before' | 'after' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const templates: Template[] = [
    { id: 'side-by-side', name: 'Lado a Lado', layout: 'side-by-side', style: {} },
    { id: 'top-bottom', name: 'Cima/Baixo', layout: 'top-bottom', style: {} },
    { id: 'slider', name: 'Slider Interativo', layout: 'slider', style: {} },
    { id: 'overlay', name: 'Sobreposição', layout: 'overlay', style: {} }
  ];

  const handleImageUpload = useCallback((file: File, type: 'before' | 'after' | 'logo') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforeImage(result);
        } else if (type === 'after') {
          setAfterImage(result);
        } else if (type === 'logo') {
          setLogoImage(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem');
    }
  }, []);

  // Funções de drag and drop
  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'before' | 'after') => {
    e.preventDefault();
    setIsDragging(type);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({
      x: type === 'before' ? beforeImageX[0] : afterImageX[0],
      y: type === 'before' ? beforeImageY[0] : afterImageY[0]
    });
  }, [beforeImageX, beforeImageY, afterImageX, afterImageY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = initialPosition.x + deltaX / 2; // Divisor para tornar o movimento mais suave
    const newY = initialPosition.y + deltaY / 2;

    // Limitar os valores dentro dos limites
    const clampedX = Math.max(-100, Math.min(100, newX));
    const clampedY = Math.max(-100, Math.min(100, newY));

    if (isDragging === 'before') {
      setBeforeImageX([clampedX]);
      setBeforeImageY([clampedY]);
    } else if (isDragging === 'after') {
      setAfterImageX([clampedX]);
      setAfterImageY([clampedY]);
    }
  }, [isDragging, dragStart, initialPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Adicionar event listeners para mouse move e up
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
      // Aguardar um pouco para garantir que as imagens estão renderizadas
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null, // Usar a cor de fundo do elemento
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        width: 400,
        height: 600,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: true
      });
      
      // Criar link para download
      const link = document.createElement('a');
      link.download = `antes-depois-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Imagem de comparação gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderComparison = () => {
    if (!beforeImage || !afterImage) return null;

    const getImageStyle = (type: 'before' | 'after') => {
      const scale = type === 'before' ? beforeImageScale[0] : afterImageScale[0];
      const x = type === 'before' ? beforeImageX[0] : afterImageX[0];
      const y = type === 'before' ? beforeImageY[0] : afterImageY[0];
      const rotation = type === 'before' ? beforeImageRotation[0] : afterImageRotation[0];
      
      return {
        width: '100%',
        height: '400px',
        objectFit: 'contain' as const,
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        transform: `scale(${scale / 100}) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      };
    };

    switch (template.layout) {
      case 'side-by-side':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <img src={beforeImage} alt="Antes" style={getImageStyle('before')} />
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
              <img src={afterImage} alt="Depois" style={getImageStyle('after')} />
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
              <img src={beforeImage} alt="Antes" style={getImageStyle('before')} />
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
              <img src={afterImage} alt="Depois" style={getImageStyle('after')} />
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
      className="max-w-6xl mx-auto p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>Resultado Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={canvasRef}
                className="bg-white p-8 rounded-lg shadow-lg"
                style={{ 
                  width: '400px', 
                  height: '600px',
                  backgroundColor: backgroundColor 
                }}
              >
                {/* Título e Descrição */}
                {showTitle && (
                  <div className="text-center mb-8">
                    <h1 
                      className="text-2xl font-bold mb-2"
                      style={{ color: titleColor }}
                    >
                      {title || 'TITULO'}
                    </h1>
                    <p 
                      style={{ color: descriptionColor }}
                    >
                      {description || 'DESCRICAO'}
                    </p>
                  </div>
                )}

                {/* Imagens Antes e Depois */}
                <div className="flex gap-4 mb-8">
                  {/* Imagem Antes */}
                  <div className="flex-1">
                    <div 
                      className="relative w-full h-64 bg-gray-100 rounded-2xl overflow-hidden"
                      style={{ aspectRatio: '3/4' }}
                    >
                      {beforeImage && (
                        <img
                          src={beforeImage}
                          alt="Antes"
                          className="w-full h-full object-contain cursor-move select-none"
                          style={{
                            transform: `scale(${beforeImageScale[0] / 100}) translate(${beforeImageX[0]}px, ${beforeImageY[0]}px) rotate(${beforeImageRotation[0]}deg)`,
                            transition: isDragging === 'before' ? 'none' : 'transform 0.2s ease'
                          }}
                          onMouseDown={(e) => handleMouseDown(e, 'before')}
                          draggable={false}
                        />
                      )}
                    </div>
                    {showLabels && (
                      <p className="text-center text-gray-700 font-semibold mt-2" style={{ fontSize: `${fontSize[0]}px`, color: labelColor }}>
                        {beforeLabel}
                      </p>
                    )}
                  </div>

                  {/* Imagem Depois */}
                  <div className="flex-1">
                    <div 
                      className="relative w-full h-64 bg-gray-100 rounded-2xl overflow-hidden"
                      style={{ aspectRatio: '3/4' }}
                    >
                      {afterImage && (
                        <img
                          src={afterImage}
                          alt="Depois"
                          className="w-full h-full object-contain cursor-move select-none"
                          style={{
                            transform: `scale(${afterImageScale[0] / 100}) translate(${afterImageX[0]}px, ${afterImageY[0]}px) rotate(${afterImageRotation[0]}deg)`,
                            transition: isDragging === 'after' ? 'none' : 'transform 0.2s ease'
                          }}
                          onMouseDown={(e) => handleMouseDown(e, 'after')}
                          draggable={false}
                        />
                      )}
                    </div>
                    {showLabels && (
                      <p className="text-center text-gray-700 font-semibold mt-2" style={{ fontSize: `${fontSize[0]}px`, color: labelColor }}>
                        {afterLabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Logo */}
                {showLogo && (
                  <div className="text-center">
                    {logoImage ? (
                      <img
                        src={logoImage}
                        alt="Logo"
                        className="mx-auto"
                        style={{
                          width: `${logoSize[0]}px`,
                          transform: logoPosition === 'bottom-right' ? 'translate(50px, 0)' : 
                                   logoPosition === 'bottom-left' ? 'translate(-50px, 0)' :
                                   logoPosition === 'top-right' ? 'translate(50px, -200px)' :
                                   logoPosition === 'top-left' ? 'translate(-50px, -200px)' : 'none'
                        }}
                      />
                    ) : (
                      <div className="text-xl font-bold text-gray-400 border-2 border-dashed border-gray-300 p-4 rounded">
                        [LOGO]
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Area */}
        <div className="order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="images">Imagens</TabsTrigger>
                  <TabsTrigger value="position">Posição</TabsTrigger>
                  <TabsTrigger value="export">Exportar</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-title"
                      checked={showTitle}
                      onCheckedChange={setShowTitle}
                    />
                    <Label htmlFor="show-title">Mostrar título</Label>
                  </div>
                  
                  {showTitle && (
                    <>
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Digite o título"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Digite a descrição"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title-color">Cor do título</Label>
                          <Input
                            id="title-color"
                            type="color"
                            value={titleColor}
                            onChange={(e) => setTitleColor(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description-color">Cor da descrição</Label>
                          <Input
                            id="description-color"
                            type="color"
                            value={descriptionColor}
                            onChange={(e) => setDescriptionColor(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-labels"
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                    />
                    <Label htmlFor="show-labels">Mostrar labels</Label>
                  </div>

                  {showLabels && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="before-label">Label Antes</Label>
                          <Input
                            id="before-label"
                            value={beforeLabel}
                            onChange={(e) => setBeforeLabel(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="after-label">Label Depois</Label>
                          <Input
                            id="after-label"
                            value={afterLabel}
                            onChange={(e) => setAfterLabel(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Tamanho da fonte: {fontSize[0]}px</Label>
                        <Slider
                          value={fontSize}
                          onValueChange={setFontSize}
                          min={12}
                          max={32}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor="label-color">Cor das labels</Label>
                        <Input
                          id="label-color"
                          type="color"
                          value={labelColor}
                          onChange={(e) => setLabelColor(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="bg-color">Cor de fundo</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  {/* Upload Antes */}
                  <div className="space-y-2">
                    <Label>Imagem "Antes"</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400"
                      onClick={() => beforeInputRef.current?.click()}
                    >
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
                      {beforeImage ? (
                        <div className="space-y-2">
                          <img src={beforeImage} alt="Before" className="w-20 h-20 object-cover mx-auto rounded" />
                          <p className="text-sm text-gray-600">Imagem carregada</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Clique para fazer upload</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Depois */}
                  <div className="space-y-2">
                    <Label>Imagem "Depois"</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400"
                      onClick={() => afterInputRef.current?.click()}
                    >
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
                      {afterImage ? (
                        <div className="space-y-2">
                          <img src={afterImage} alt="After" className="w-20 h-20 object-cover mx-auto rounded" />
                          <p className="text-sm text-gray-600">Imagem carregada</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Clique para fazer upload</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Logo */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-logo"
                        checked={showLogo}
                        onCheckedChange={setShowLogo}
                      />
                      <Label htmlFor="show-logo">Mostrar logo</Label>
                    </div>

                    {showLogo && (
                      <>
                        <Label>Logo da Clínica</Label>
                        <div
                          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'logo');
                            }}
                          />
                          {logoImage ? (
                            <div className="space-y-2">
                              <img src={logoImage} alt="Logo" className="w-20 h-20 object-contain mx-auto" />
                              <p className="text-sm text-gray-600">Logo carregado</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Tamanho do logo: {logoSize[0]}px</Label>
                            <Slider
                              value={logoSize}
                              onValueChange={setLogoSize}
                              min={40}
                              max={120}
                              step={5}
                            />
                          </div>
                          <div>
                            <Label>Posição do logo</Label>
                            <Select value={logoPosition} onValueChange={setLogoPosition}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="center">Centro</SelectItem>
                                <SelectItem value="bottom-left">Inferior Esquerda</SelectItem>
                                <SelectItem value="bottom-right">Inferior Direita</SelectItem>
                                <SelectItem value="top-left">Superior Esquerda</SelectItem>
                                <SelectItem value="top-right">Superior Direita</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="position" className="space-y-6">
                  {beforeImage && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Ajustar Posição - Antes</h4>
                      <div className="space-y-2">
                        <Label>Escala: {beforeImageScale[0]}%</Label>
                        <Slider
                          value={beforeImageScale}
                          onValueChange={setBeforeImageScale}
                          min={50}
                          max={200}
                          step={5}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Posição X: {beforeImageX[0]}</Label>
                          <Slider
                            value={beforeImageX}
                            onValueChange={setBeforeImageX}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Posição Y: {beforeImageY[0]}</Label>
                          <Slider
                            value={beforeImageY}
                            onValueChange={setBeforeImageY}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Rotação: {beforeImageRotation[0]}°</Label>
                        <Slider
                          value={beforeImageRotation}
                          onValueChange={setBeforeImageRotation}
                          min={-45}
                          max={45}
                          step={1}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBeforeImageScale([100]);
                          setBeforeImageX([0]);
                          setBeforeImageY([0]);
                          setBeforeImageRotation([0]);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Resetar Posição
                      </Button>
                    </div>
                  )}

                  {afterImage && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Ajustar Posição - Depois</h4>
                      <div className="space-y-2">
                        <Label>Escala: {afterImageScale[0]}%</Label>
                        <Slider
                          value={afterImageScale}
                          onValueChange={setAfterImageScale}
                          min={50}
                          max={200}
                          step={5}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Posição X: {afterImageX[0]}</Label>
                          <Slider
                            value={afterImageX}
                            onValueChange={setAfterImageX}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Posição Y: {afterImageY[0]}</Label>
                          <Slider
                            value={afterImageY}
                            onValueChange={setAfterImageY}
                            min={-100}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Rotação: {afterImageRotation[0]}°</Label>
                        <Slider
                          value={afterImageRotation}
                          onValueChange={setAfterImageRotation}
                          min={-45}
                          max={45}
                          step={1}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAfterImageScale([100]);
                          setAfterImageX([0]);
                          setAfterImageY([0]);
                          setAfterImageRotation([0]);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Resetar Posição
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Faça o download da sua comparação antes e depois em alta qualidade.
                    </p>
                    <Button 
                      onClick={generateComparison} 
                      className="w-full" 
                      disabled={!beforeImage || !afterImage || isGenerating}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Gerando...' : 'Baixar Imagem'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterBuilder;