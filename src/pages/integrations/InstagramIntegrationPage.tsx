
import React from "react";
import InstagramIntegration from "@/components/instagram/InstagramIntegration";
import { PageHeader } from "@/components/ui/PageHeader";
import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";

// Mostra integração principal, breve histórico, link explicado
const InstagramIntegrationPage: React.FC = () => (
  <div className="container mx-auto max-w-3xl py-6">
    <PageHeader
      icon={Instagram}
      title="Integração com Instagram"
      subtitle="Conecte sua conta do Instagram para importar métricas reais e obter insights automáticos"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Integrações", href: "#" },
        { label: "Instagram", isCurrent: true },
      ]}
    />
    <InstagramIntegration showAnalyticsCard className="mb-8" />
    <div className="mt-6 bg-background/50 rounded-lg p-4 text-sm border border-slate-800 max-w-2xl mx-auto">
      <b>Como funciona?</b>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        <li>OAuth 2.0 seguro: você autentica com sua conta Instagram</li>
        <li>Métricas coletadas: seguidores, engajamento, alcance e mais</li>
        <li>Sua conexão vale para todo o sistema e relatórios</li>
        <li>Desconecte quando quiser</li>
      </ul>
      <div className="mt-3">
        Precisa revisar suas métricas? Veja seu <Link to="/diagnostic-history" className="text-primary underline">Histórico de Relatórios</Link>.
      </div>
    </div>
  </div>
);

export default InstagramIntegrationPage;
