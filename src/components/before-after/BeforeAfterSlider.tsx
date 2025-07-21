import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
  fontSize?: number;
  labelColor?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Antes",
  afterLabel = "Depois",
  showLabels = true,
  fontSize = 14,
  labelColor = "#374151"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Event listeners para mouse
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className="relative w-full bg-gray-100 rounded-2xl overflow-hidden cursor-ew-resize"
        style={{ aspectRatio: '16/9', minHeight: '300px' }}
        onMouseDown={handleMouseDown}
      >
        {/* Imagem Depois (fundo) */}
        <div className="absolute inset-0">
          <img
            src={afterImage}
            alt="Depois"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {showLabels && (
            <div 
              className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold"
              style={{ fontSize: `${fontSize}px`, color: 'white' }}
            >
              {afterLabel}
            </div>
          )}
        </div>

        {/* Imagem Antes (sobreposição com clip) */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <img
            src={beforeImage}
            alt="Antes"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {showLabels && (
            <div 
              className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold"
              style={{ fontSize: `${fontSize}px`, color: 'white' }}
            >
              {beforeLabel}
            </div>
          )}
        </div>

        {/* Linha divisória */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle do slider */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
              <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Overlay para capturar eventos de mouse */}
        <div className="absolute inset-0 bg-transparent"></div>
      </div>

      {/* Instruções */}
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>Arraste o slider para comparar as imagens</p>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;