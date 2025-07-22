
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, Users, Send, MapPin, Phone, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuroraPageLayout from '@/components/layout/AuroraPageLayout';
import StandardPageHeader from '@/components/layout/StandardPageHeader';

const Contato = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    clinica: '',
    assunto: '',
    mensagem: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do formulário
    toast({
      title: "Mensagem enviada com sucesso!",
      description: "Entraremos em contato em até 2 horas úteis.",
    });
    
    // Limpar formulário
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      clinica: '',
      assunto: '',
      mensagem: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const statusBadges = [
    {
      icon: MessageSquare,
      label: 'Suporte',
      variant: 'secondary' as const,
      color: 'bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30'
    },
    {
      icon: Sparkles,
      label: 'Revolucione',
      variant: 'secondary' as const,
      color: 'bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30'
    }
  ];

  return (
    <AuroraPageLayout>
      <StandardPageHeader
        icon={Mail}
        title="Transforme o Marketing da Sua Clínica"
        subtitle="Entre em contato e descubra como a Fluida pode impulsionar seus resultados"
        statusBadges={statusBadges}
      />
      
      <div className="container mx-auto px-6 py-8">

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Formulário de Contato */}
        <Card className="bg-aurora-dark-purple/20 border-aurora-electric-purple/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <Send className="h-6 w-6 text-aurora-electric-purple" />
              Fale Conosco
            </CardTitle>
            <CardDescription className="text-white/70">
              Preencha o formulário e nossa equipe especializada entrará em contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white">Nome Completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-white">Telefone</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinica" className="text-white">Nome da Clínica</Label>
                  <Input
                    id="clinica"
                    type="text"
                    value={formData.clinica}
                    onChange={(e) => handleChange('clinica', e.target.value)}
                    className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white"
                    placeholder="Sua clínica"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto" className="text-white">Assunto</Label>
                <Select value={formData.assunto} onValueChange={(value) => handleChange('assunto', value)}>
                  <SelectTrigger className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white">
                    <SelectValue placeholder="Selecione o assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercial">Informações Comerciais</SelectItem>
                    <SelectItem value="demonstracao">Solicitar Demonstração</SelectItem>
                    <SelectItem value="suporte">Suporte Técnico</SelectItem>
                    <SelectItem value="parceria">Parcerias</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem" className="text-white">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={(e) => handleChange('mensagem', e.target.value)}
                  className="bg-aurora-space-black/30 border-aurora-electric-purple/20 text-white min-h-[120px]"
                  placeholder="Conte-nos como podemos ajudar sua clínica a alcançar melhores resultados..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue hover:opacity-90 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Mail className="h-6 w-6 text-aurora-electric-purple" />
                Nossos Canais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-white/90">
                <Mail className="h-5 w-5 text-aurora-electric-purple" />
                <div>
                  <p className="font-medium">E-mail Principal</p>
                  <a href="mailto:contato@fluida.com" className="text-aurora-electric-purple hover:underline">
                    contato@fluida.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white/90">
                <Phone className="h-5 w-5 text-aurora-electric-purple" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-white/70">(11) 3000-0000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white/90">
                <MapPin className="h-5 w-5 text-aurora-electric-purple" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-white/70">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-aurora-dark-purple/20 border-aurora-electric-purple/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Clock className="h-6 w-6 text-aurora-electric-purple" />
                Horário de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white/90">
                <div className="flex justify-between">
                  <span>Segunda a Sexta</span>
                  <span className="text-aurora-electric-purple font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="text-aurora-electric-purple font-medium">9h às 13h</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos e Feriados</span>
                  <span className="text-white/60">Atendimento por e-mail</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-aurora-emerald/20 to-aurora-electric-purple/20 border-aurora-emerald/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Users className="h-6 w-6 text-aurora-emerald" />
                Nosso Compromisso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aurora-emerald rounded-full"></div>
                  Resposta em até 2 horas úteis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aurora-emerald rounded-full"></div>
                  Atendimento personalizado
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aurora-emerald rounded-full"></div>
                  Equipe especializada em marketing médico
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-aurora-emerald rounded-full"></div>
                  Suporte contínuo durante toda jornada
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-aurora-electric-purple/10 to-aurora-neon-blue/10 rounded-lg p-8 border border-aurora-electric-purple/20">
        <h3 className="text-2xl font-bold text-white mb-4">
          Pronto para Revolucionar Sua Clínica?
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Junte-se a centenas de clínicas que já transformaram seus resultados com a Fluida. 
          Nossa equipe está pronta para mostrar como nossa plataforma pode impulsionar seu crescimento.
        </p>
      </div>
      </div>
    </AuroraPageLayout>
  );
};

export default Contato;
