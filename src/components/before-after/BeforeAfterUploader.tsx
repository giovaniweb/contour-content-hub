
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image as ImageIcon, X, Camera, Sparkles, ClipboardList, Settings, Target, Check } from "lucide-react";
import { toast } from 'sonner';
import { beforeAfterService } from '@/services/beforeAfterService';
import { BeforeAfterUploadData } from '@/types/before-after';
import { useGamification } from '@/hooks/useGamification';
import GamificationDisplay from '@/components/gamification/GamificationDisplay';
import { supabase } from '@/integrations/supabase/client';

interface Equipment {
  id: string;
  nome: string;
}

interface BeforeAfterUploaderProps {
  onUploadSuccess?: () => void;
}

const BeforeAfterUploader: React.FC<BeforeAfterUploaderProps> = ({ onUploadSuccess }) => {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  
  const { userProgress, awardBeforeAfterUpload, isLoading: gamificationLoading } = useGamification();
  
  const [formData, setFormData] = useState<BeforeAfterUploadData>({
    title: '',
    description: '',
    equipment_used: [],
    procedure_date: '',
    is_public: false,
    equipment_parameters: {
      intensity: '',
      frequency: '',
      time: '',
      other: ''
    },
    treated_areas: [],
    treatment_objective: '',
    associated_therapies: [],
    session_interval: undefined,
    session_count: undefined,
    session_notes: ''
  });

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // Carregar equipamentos
  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const { data, error } = await supabase
          .from('equipamentos')
          .select('id, nome')
          .eq('ativo', true)
          .order('nome');

        if (error) throw error;
        setEquipments(data || []);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        toast.error('Erro ao carregar lista de equipamentos');
      }
    };

    loadEquipments();
  }, []);

  const handleImageSelect = (file: File, type: 'before' | 'after') => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'before') {
          setBeforeImage(file);
          setBeforePreview(e.target?.result as string);
        } else {
          setAfterImage(file);
          setAfterPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem');
    }
  };

  const removeImage = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeImage(null);
      setBeforePreview(null);
    } else {
      setAfterImage(null);
      setAfterPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 Iniciando submit do formulário...');
    e.preventDefault();
    
    if (!beforeImage || !afterImage) {
      toast.error('Por favor, selecione as imagens antes e depois');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Por favor, adicione um título');
      return;
    }

    setIsUploading(true);

    try {
      console.log('🚀 Iniciando upload das imagens...');
      
      // Upload das imagens
      const [beforeUrl, afterUrl] = await Promise.all([
        beforeAfterService.uploadImage(beforeImage, 'before'),
        beforeAfterService.uploadImage(afterImage, 'after')
      ]);

      if (!beforeUrl || !afterUrl) {
        throw new Error('Falha no upload das imagens');
      }

        // Atualizar equipment_used com os nomes dos equipamentos selecionados
        const equipmentNames = selectedEquipments.map(equipId => {
          const equipment = equipments.find(eq => eq.id === equipId);
          return equipment?.nome || '';
        }).filter(Boolean);

        const updatedFormData = {
          ...formData,
          equipment_used: equipmentNames
        };

        // Criar registro no banco
        const photo = await beforeAfterService.createBeforeAfterPhoto(
          beforeUrl,
          afterUrl,
          updatedFormData
        );

      if (!photo) {
        throw new Error('Falha ao criar registro');
      }

      // 🎯 GAMIFICAÇÃO: Recompensar upload
      try {
        await awardBeforeAfterUpload();
      } catch (gamificationError) {
        console.error('Erro na gamificação:', gamificationError);
        // Não bloquear o fluxo principal se a gamificação falhar
      }

      toast.success('📸 Fotos antes e depois salvas com sucesso!');
      
      // Reset form
      setBeforeImage(null);
      setAfterImage(null);
      setBeforePreview(null);
      setAfterPreview(null);
      setFormData({
        title: '',
        description: '',
        equipment_used: [],
        procedure_date: '',
        is_public: false,
        equipment_parameters: {
          intensity: '',
          frequency: '',
          time: '',
          other: ''
        },
        treated_areas: [],
        treatment_objective: '',
        associated_therapies: [],
        session_interval: undefined,
        session_count: undefined,
        session_notes: ''
      });
      setSelectedEquipments([]);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      toast.error('Erro ao salvar as fotos. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Gamification Display */}
      {!gamificationLoading && (
        <GamificationDisplay progress={userProgress} />
      )}

      <Card className="aurora-glass border-aurora-electric-purple/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Camera className="h-6 w-6 text-aurora-electric-purple" />
            📸 Upload Antes & Depois
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </CardTitle>
          <p className="text-sm text-gray-400">
            🎯 Ganhe +25 XP documentando seus resultados!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Imagens
                </TabsTrigger>
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Básico
                </TabsTrigger>
                <TabsTrigger value="protocol" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Protocolo
                </TabsTrigger>
                <TabsTrigger value="objectives" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objetivos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="images" className="space-y-6 mt-6">
                {/* Image Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before Image */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Foto ANTES</Label>
                    <div
                      className="border-2 border-dashed border-aurora-electric-purple/50 rounded-lg p-6 text-center hover:border-aurora-electric-purple/70 transition-colors cursor-pointer"
                      onClick={() => {
                        console.log('🖱️ Clicou para selecionar foto ANTES');
                        beforeInputRef.current?.click();
                      }}
                    >
                      {beforePreview ? (
                        <div className="relative">
                          <img
                            src={beforePreview}
                            alt="Antes"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage('before');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 text-aurora-electric-purple mx-auto" />
                          <p className="text-white">Clique para selecionar a foto ANTES</p>
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
                        if (file) handleImageSelect(file, 'before');
                      }}
                    />
                  </div>

                  {/* After Image */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Foto DEPOIS</Label>
                    <div
                      className="border-2 border-dashed border-aurora-electric-purple/50 rounded-lg p-6 text-center hover:border-aurora-electric-purple/70 transition-colors cursor-pointer"
                      onClick={() => {
                        console.log('🖱️ Clicou para selecionar foto DEPOIS');
                        afterInputRef.current?.click();
                      }}
                    >
                      {afterPreview ? (
                        <div className="relative">
                          <img
                            src={afterPreview}
                            alt="Depois"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage('after');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 text-aurora-electric-purple mx-auto" />
                          <p className="text-white">Clique para selecionar a foto DEPOIS</p>
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
                        if (file) handleImageSelect(file, 'after');
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="basic" className="space-y-4 mt-6">
                {/* Basic Information */}
                <div>
                  <Label htmlFor="title" className="text-white font-medium">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ex: Tratamento com Microagulhamento"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white font-medium">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o procedimento, resultados observados..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white font-medium">
                    Equipamentos Utilizados
                  </Label>
                  <div className="space-y-2">
                    {equipments.map((equipment) => (
                      <div key={equipment.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={equipment.id}
                          checked={selectedEquipments.includes(equipment.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEquipments([...selectedEquipments, equipment.id]);
                            } else {
                              setSelectedEquipments(selectedEquipments.filter(id => id !== equipment.id));
                            }
                          }}
                          className="rounded border-aurora-electric-purple/30 text-aurora-electric-purple"
                        />
                        <Label 
                          htmlFor={equipment.id} 
                          className="text-white text-sm cursor-pointer"
                        >
                          {equipment.nome}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedEquipments.length > 0 && (
                    <div className="mt-2 p-2 bg-slate-800/30 rounded border border-aurora-electric-purple/20">
                      <p className="text-sm text-gray-300">
                        Selecionados: {selectedEquipments.map(id => 
                          equipments.find(eq => eq.id === id)?.nome
                        ).join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="procedure_date" className="text-white font-medium">
                    Data do Procedimento
                  </Label>
                  <Input
                    id="procedure_date"
                    type="date"
                    value={formData.procedure_date}
                    onChange={(e) => setFormData({ ...formData, procedure_date: e.target.value })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                  <Label htmlFor="is_public" className="text-white">
                    Tornar público (outros usuários poderão ver)
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="protocol" className="space-y-4 mt-6">
                {/* Equipment Parameters */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium text-lg">Parâmetros do Equipamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white font-medium">Intensidade</Label>
                      <Input
                        placeholder="Ex: 70%, Nível 8, etc."
                        value={formData.equipment_parameters?.intensity || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          equipment_parameters: { 
                            ...formData.equipment_parameters, 
                            intensity: e.target.value 
                          }
                        })}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Frequência</Label>
                      <Input
                        placeholder="Ex: 2MHz, 40Hz, etc."
                        value={formData.equipment_parameters?.frequency || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          equipment_parameters: { 
                            ...formData.equipment_parameters, 
                            frequency: e.target.value 
                          }
                        })}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Tempo</Label>
                      <Input
                        placeholder="Ex: 20 minutos, 5 min por área"
                        value={formData.equipment_parameters?.time || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          equipment_parameters: { 
                            ...formData.equipment_parameters, 
                            time: e.target.value 
                          }
                        })}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-white font-medium">Outros Parâmetros</Label>
                      <Input
                        placeholder="Ex: Profundidade, Tipo de onda, etc."
                        value={formData.equipment_parameters?.other || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          equipment_parameters: { 
                            ...formData.equipment_parameters, 
                            other: e.target.value 
                          }
                        })}
                        className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-white font-medium">Áreas Tratadas</Label>
                  <Input
                    placeholder="Ex: Face, Pescoço, Colo (separar por vírgula)"
                    value={formData.treated_areas?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      treated_areas: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white font-medium">Número de Sessões</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 6"
                      value={formData.session_count || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        session_count: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                      className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white font-medium">Intervalo entre Sessões (dias)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 7, 15, 30"
                      value={formData.session_interval || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        session_interval: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                      className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="objectives" className="space-y-4 mt-6">
                <div>
                  <Label className="text-white font-medium">Objetivo do Tratamento</Label>
                  <Textarea
                    placeholder="Descreva o objetivo específico do tratamento..."
                    value={formData.treatment_objective || ''}
                    onChange={(e) => setFormData({ ...formData, treatment_objective: e.target.value })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white font-medium">Associações Feitas (outras terapias/cosmetologia)</Label>
                  <Input
                    placeholder="Ex: Radiofrequência, Peeling químico, Cosmecêuticos (separar por vírgula)"
                    value={formData.associated_therapies?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      associated_therapies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white font-medium">Observações das Sessões</Label>
                  <Textarea
                    placeholder="Anotações sobre evolução, reações, ajustes realizados..."
                    value={formData.session_notes || ''}
                    onChange={(e) => setFormData({ ...formData, session_notes: e.target.value })}
                    className="bg-slate-800/50 border-aurora-electric-purple/30 text-white"
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isUploading || !beforeImage || !afterImage || !formData.title.trim()}
              className="w-full bg-gradient-to-r from-aurora-electric-purple to-pink-600 hover:opacity-90 text-white h-12"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Salvando protocolo completo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Salvar Protocolo Completo (+25 XP)
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BeforeAfterUploader;
