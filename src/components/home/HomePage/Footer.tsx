
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fluida</h3>
            <p className="text-gray-400">
              Seu estúdio criativo em um clique.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white">Gerador de Roteiros</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Biblioteca de Vídeos</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Estratégia de Conteúdo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white">Sobre nós</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Contato</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white">Termos de Uso</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Fluida | Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
