
import React from "react";

// Define type for slides
interface SlidePreview {
  title: string;
}

interface CarouselSequencePreviewProps {
  slides: SlidePreview[];
}

const colorDots = [
  "bg-aurora-electric-purple",
  "bg-red-400",
  "bg-aurora-emerald",
  "bg-aurora-lavender",
  "bg-aurora-neon-blue",
];

// Carousel: sequence dots with slide titles as tooltip
const CarouselSequencePreview: React.FC<CarouselSequencePreviewProps> = ({
  slides,
}) => {
  return (
    <div className="flex gap-2 items-center">
      {slides.map((slide, i) => (
        <div key={i} className="flex flex-col items-center group relative">
          <div
            className={`w-3 h-3 rounded-full ${colorDots[i % colorDots.length]} border-2 border-white shadow-md`}
          />
          {/* Tooltip with slide title */}
          <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-[11px] px-2 py-1 rounded bg-black/80 text-white whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-10">
            {slide.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CarouselSequencePreview;

