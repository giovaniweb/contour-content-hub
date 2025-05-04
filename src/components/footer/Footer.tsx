
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 bg-white border-t border-contourline-lightBlue/10 text-center text-sm text-contourline-darkBlue">
      <p>© {new Date().getFullYear()} Fluida | Seu estúdio criativo, em um clique.</p>
    </footer>
  );
};
