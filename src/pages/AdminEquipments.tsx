
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import EquipmentManager from "@/components/admin/EquipmentManager";
import { Equipment } from "@/types/equipment";
import { importEquipments } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const AdminEquipments: React.FC = () => {
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleImportEquipments = async () => {
    try {
      // Lista de equipamentos padrão para importação
      const defaultEquipments: Equipment[] = [
        {
          nome: "Adélla Laser",
          tecnologia: "Plataforma laser multifuncional (Nd:YAG 1064nm e Alexandrita 755nm)",
          indicacoes: "Depilação a laser definitiva; Lesões vasculares e pigmentares; Rejuvenescimento facial",
          beneficios: "Remove pelos indesejados de forma permanente; Trata vasos e manchas sem downtime; Pele rejuvenescida",
          diferenciais: "Combina duas fontes de laser para tratar diversos problemas; Rápido e praticamente indolor; Seguro para múltiplos fototipos",
          linguagem: "Explicativa e atraente, passando confiança tecnológica ao cliente leigo",
          ativo: true
        },
        {
          nome: "Enygma X-Orbital",
          tecnologia: "Radiofrequência íntima X-Orbital de última geração",
          indicacoes: "Rejuvenescimento vaginal; Tratamento de flacidez e secura íntima; Melhora da incontinência urinária leve",
          beneficios: "Melhora o conforto e a satisfação da mulher; Procedimento não invasivo, sem dor; Aumenta a firmeza dos tecidos íntimos",
          diferenciais: "Tecnologia exclusiva orbital (360°) que aquece de forma homogênea; Sensor de temperatura para segurança; Solução inovadora para saúde íntima feminina",
          linguagem: "Delicada e profissional, respeitando a sensibilidade do tema",
          ativo: true
        },
        {
          nome: "Focuskin",
          tecnologia: "Sistema de análise digital de pele com câmera de alta resolução e luzes polarizadas",
          indicacoes: "Avaliação aprofundada da pele facial; Detecção de manchas, poros, rugas e oleosidade; Acompanhamento de tratamentos estéticos",
          beneficios: "Permite diagnóstico preciso das necessidades da pele; Antes e depois visual para o cliente; Personaliza tratamentos aumentando eficácia",
          diferenciais: "Combina diferentes espectros de luz para revelar camadas da pele; Gera relatórios e imagens comparativas; Fácil de usar em consultório com resultados em segundos",
          linguagem: "Educativa e confiável, reforçando tecnologia avançada de análise",
          ativo: true
        },
        {
          nome: "Laser Crystal 3D Plus",
          tecnologia: "Laser fracionado 3D (Er:YAG fracionado + Laser Q-Switched)",
          indicacoes: "Rejuvenescimento facial profundo; Tratamento de rugas e cicatrizes de acne; Remoção de tatuagens e manchas resistentes",
          beneficios: "Estimula colágeno para pele mais firme e lisa; Suaviza cicatrizes antigas; Remove pigmentos indesejados com precisão",
          diferenciais: "Dois modos de laser em um só aparelho (ablativo e não-ablativo); Ajuste 3D da profundidade de tratamento; Resultados visíveis já na primeira sessão em muitos casos",
          linguagem: "Sofisticada porém acessível, destacando resultados estéticos elevados",
          ativo: true
        },
        {
          nome: "MultShape",
          tecnologia: "Equipamento 3 em 1: Ultracavitação, Radiofrequência multipolar e Endermologia (sucção a vácuo)",
          indicacoes: "Redução de gordura localizada; Tratamento de celulite e flacidez cutânea; Remodelação corporal (abdomen, glúteos, coxas)",
          beneficios: "Diminui medidas onde dieta e exercícios não alcançam; Pele mais lisa e uniforme (menos furinhos da celulite); Melhora contorno corporal e firmeza da pele",
          diferenciais: "Combina técnicas em uma única sessão para maior eficácia; Tratamento confortável e personalizado por área; Aprovação dos clientes pelos resultados rápidos (4-6 semanas)",
          linguagem: "Motivacional e empolgante, inspirando o cliente a conquistar o corpo desejado",
          ativo: true
        },
        {
          nome: "Reverso",
          tecnologia: "Radiofrequência microagulhada fracionada",
          indicacoes: "Rejuvenescimento facial e corporal; Redução de rugas e linhas finas; Tratamento de estrias e cicatrizes (acne, cirúrgicas)",
          beneficios: "Combina microagulhas e calor para regenerar a pele; Textura da pele mais homogênea e jovem; Estrias e marcas menos visíveis já nas primeiras aplicações",
          diferenciais: "Profundidade de microagulhamento ajustável por região; Entrega de energia fracionada minimiza downtime; Tecnologia 'Reverso' foca em reverter danos profundos da pele com segurança",
          linguagem: "Encorajadora e esclarecedora, passando ideia de transformação positiva da pele",
          ativo: true
        },
        {
          nome: "Endolaser",
          tecnologia: "Laser de diodo 1470nm para endolifting (laser interno subdérmico)",
          indicacoes: "Lifting facial minimamente invasivo (sem cirurgia); Tratamento de flacidez em mandíbula, pescoço e braços; Estímulo de colágeno de dentro para fora",
          beneficios: "Efeito lifting sem necessidade de facelift cirúrgico; Pele mais esticada e contornada no rosto e pescoço; Procedimento ambulatorial com recuperação rápida",
          diferenciais: "Fibra óptica fina introduzida sob a pele para aquecimento controlado; Técnica Endolift® consagrada com resultados naturais; Exclusivo para quem busca alternativa ao bisturi",
          linguagem: "Informativa e confiante, enfatizando a inovação e segurança do método",
          ativo: true
        },
        {
          nome: "Unyque PRO",
          tecnologia: "Plataforma corporal multifuncional (ReFreeze criolipólise avançada + Cryo RF Max + HImFU – ultrassom de alta intensidade focado)",
          indicacoes: "Tratamentos corporais completos: congelamento de gordura (criolipólise); Flacidez cutânea avançada; Definição muscular não-invasiva",
          beneficios: "Elimina gorduras localizadas resistentes; Rejuvenesce a pele do corpo, deixando-a mais firme; Único aparelho que também estimula músculos sem exercícios",
          diferenciais: "Três tecnologias em um aparelho único no mercado; Aparelho flagship da Body Health presente em 45+ países; Resultados integrados – trata gordura, pele e músculo simultaneamente",
          linguagem: "Enfática e comercial, destacando ser a solução mais completa e moderna em tratamentos estéticos",
          ativo: true
        },
        {
          nome: "X-Tonus",
          tecnologia: "Sistema de estímulo eletromagnético muscular (FMS – Functional Magnetic Stimulation)",
          indicacoes: "Fortalecimento e tonificação muscular (abdômen, glúteos, coxas); Auxílio no tratamento de flacidez muscular pós-parto; Complemento para atletas melhorarem desempenho muscular",
          beneficios: "Contrações musculares intensas equivalentes a 20 mil exercícios, sem esforço; Ganho de definição e força muscular em poucas sessões; Ajuda na postura e saúde muscular geral",
          diferenciais: "Tecnologia inspirada no famoso 'EMSculpt', com campo magnético focalizado de alta potência; Programa regimes personalizados (hipertrofia, resistência, reabilitação); Sessões rápidas de 30 min, resultados perceptíveis em 1 mês",
          linguagem: "Estimulante e direta, incentivando a conquista de força e definição de forma prática",
          ativo: true
        },
        {
          nome: "Hipro",
          tecnologia: "HIFU – Ultrassom Focalizado de Alta Intensidade (High Intensity Focused Ultrasound)",
          indicacoes: "Lifting facial não-cirúrgico (papada, sobrancelhas, bochechas); Redução de rugas profundas e sulcos; Definição do contorno facial e linha mandibular",
          beneficios: "Efeito lifting visível sem cortes ou agulhas; Estimula fortemente o colágeno, melhorando a firmeza da pele; Resultados que continuam a melhorar por meses após o tratamento",
          diferenciais: "Focaliza energia ultrassônica em pontos profundos precisos (SMAS) como um lifting interno; Procedimento rápido (cerca de 1 hora) e praticamente indolor com anestésico tópico; Alternativa comprovada ao facelift para pacientes que não podem ou não querem cirurgia",
          linguagem: "Convincente e elegante, passando segurança sobre obter rejuvenescimento sem cirurgia",
          ativo: true
        },
        {
          nome: "Hive Pro",
          tecnologia: "Análise capilar computadorizada (câmera tricoscópica com múltiplas iluminações)",
          indicacoes: "Avaliação do couro cabeludo e fios; Detecção de calvície incipiente, caspa, oleosidade excessiva; Acompanhamento de tratamentos capilares (ex: pós-transplante, laser capilar)",
          beneficios: "Visualiza o couro cabeludo em detalhe ampliado 200x; Identifica causas de queda de cabelo com precisão; Gera confiança no paciente ao mostrar evolução do tratamento com imagens",
          diferenciais: "Modo de observação com quatro fontes de luz (normal, polarizada, UV etc) para diagnósticos completos; Captura e compara imagens ao longo do tempo; Ferramenta indispensável para clínicas de tricologia moderna",
          linguagem: "Clara e informativa, realçando cuidado com a saúde capilar do paciente de forma profissional",
          ativo: true
        },
        {
          nome: "Supreme PRO",
          tecnologia: "Estimulação Eletromagnética + Infravermelho terapêutico (aplicação corporal de alta intensidade)",
          indicacoes: "Hipertrofia e fortalecimento muscular (glúteos, abdômen, coxas); Redução de gordura localizada simultânea; Reabilitação e prevenção de sarcopenia (perda muscular por idade)",
          beneficios: "Aumenta massa muscular enquanto diminui a gordura na área tratada; Melhora a definição corporal e a força funcional; Contribui para saúde metabólica e qualidade de vida (músculos mais fortes consomem mais calorias e protegem articulações)",
          diferenciais: "Combina campos magnéticos focados com aquecimento infravermelho, potencializando a queima de gordura durante contrações musculares; Permite tratar dois objetivos (músculo e gordura) em uma só sessão; Já adotado em clínicas de ponta, considerado uma revolução em estética 4.0",
          linguagem: "Promocional e inspirador, destacando inovação e resultados de alta performance para corpo e saúde",
          ativo: true
        },
        {
          nome: "Ultralift",
          tecnologia: "Laser de baixo calibre para Endolift (fibras ópticas subdérmicas 200-300 micra)",
          indicacoes: "Lifting facial e cervical minimamente invasivo; Redução de papada e bolsas sob os olhos; Estímulo de retração da pele flácida em rosto e corpo (Ex: braços, joelhos)",
          beneficios: "Contorno facial redefinido sem necessidade de pontos ou cortes visíveis; Pele firma gradualmente nas semanas pós-procedimento; Procedimento realizado apenas com anestesia local, retorno quase imediato às atividades",
          diferenciais: "Utiliza microfibras laser importadas para atingir a camada subdérmica; Técnica aprovada na Europa (Endolift®) agora disponível localmente; Os resultados são comparados a um lifting leve, porém sem cirurgia tradicional",
          linguagem: "Informal porém convincente, enfatizando que é possível 'dar um up' no visual sem passar por cirurgia",
          ativo: true
        }
      ];

      await importEquipments(defaultEquipments);
      
      toast({
        title: "Importação concluída",
        description: "Os equipamentos foram importados com sucesso!",
      });
      
      setImportDialogOpen(false);
      window.location.reload(); // Recarregar para mostrar os equipamentos importados
    } catch (error) {
      console.error("Erro ao importar equipamentos:", error);
      toast({
        variant: "destructive",
        title: "Erro na importação",
        description: "Não foi possível importar os equipamentos.",
      });
    }
  };

  return (
    <Layout title="Gerenciamento de Equipamentos">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Equipamentos</h2>
        <Button onClick={handleImportEquipments}>
          Importar Equipamentos Padrão
        </Button>
      </div>

      <Tabs defaultValue="equipment-list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="equipment-list">Lista de Equipamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="equipment-list">
          <EquipmentManager />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AdminEquipments;
