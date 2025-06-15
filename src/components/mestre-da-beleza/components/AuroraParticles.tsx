
import React from "react";

/**
 * AuroraParticles - partículas animadas mágicas de fundo para efeitos aurora
 * Mais performático e reutilizável.
 */
const AuroraParticles: React.FC = () => {
  // Menos partículas em mobile, mais no desktop
  const count = typeof window !== "undefined" && window.innerWidth < 600 ? 12 : 32;
  return (
    <div className="aurora-particles pointer-events-none fixed inset-0 z-0">
      {Array.from({ length: count }).map((_, idx) => (
        <span
          key={idx}
          className="aurora-particle absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0.5 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default AuroraParticles;
