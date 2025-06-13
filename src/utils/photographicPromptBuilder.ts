
// Sistema de construção de prompts fotográficos realistas
export interface EquipmentInfo {
  nome: string;
  tecnologia?: string;
  indicacoes?: string;
  beneficios?: string;
  diferenciais?: string;
  categoria?: string;
}

export interface SlideImagePrompt {
  slideTitle: string;
  prompt: string;
  equipmentUsed?: string[];
  imageStyle: 'hero' | 'problem' | 'solution' | 'results' | 'cta';
}

export class PhotographicPromptBuilder {
  private static readonly PHOTOGRAPHY_BASE = `
Professional stock photography, high-resolution 4K image, 
shot with Canon EOS R5, 85mm lens, natural lighting, 
commercial quality, suitable for medical marketing,
clean composition, professional atmosphere,
no text overlays, ready for social media use
`;

  private static readonly ANTI_HALLUCINATION_RULES = `
IMPORTANT: Only show real medical equipment that exists,
avoid creating fictional devices or logos,
use generic medical aesthetic equipment if specific device not mentioned,
focus on realistic clinical environment and real human interactions
`;

  // Mapeamento de equipamentos reais para descrições visuais precisas
  private static readonly EQUIPMENT_VISUAL_MAP: Record<string, string> = {
    'HIFU': 'real HIFU ultrasound device with probe and display screen',
    'Laser CO2': 'professional CO2 laser equipment with articulated arm',
    'Radiofrequência': 'radiofrequency device with handpiece and control panel',
    'Criolipólise': 'cryolipolysis machine with cooling applicators',
    'Microagulhamento': 'derma pen or microneedling device',
    'Peeling': 'chemical peel application materials and protective equipment',
    'Botox': 'medical injection setup with proper sterile technique',
    'Preenchimento': 'dermal filler syringes and injection materials',
    'Limpeza de Pele': 'facial cleansing equipment and extraction tools',
    'Hydrafacial': 'hydradermabrasion machine with multiple handpieces',
    'Sculptra': 'aesthetic injectable materials in clinical setting',
    'Harmonização': 'facial harmonization procedure equipment',
    // Equipamentos específicos reais
    'Unyque PRO': 'Unyque PRO radiofrequency device with modern design and digital display',
    'Ultraformer III': 'Ultraformer III HIFU machine with ultrasound transducers',
    'Venus Legacy': 'Venus Legacy multipolar radiofrequency system',
    'Accent Prime': 'Accent Prime ultrasound and radiofrequency platform',
    'Exolis Elite': 'Exolis Elite laser system with cooling technology'
  };

  // Templates de prompt por tipo de slide
  private static readonly SLIDE_TEMPLATES = {
    hero: {
      base: 'Elegant medical clinic reception or consultation room,',
      people: 'confident professional healthcare provider welcoming patient,',
      mood: 'warm, trustworthy, premium healthcare atmosphere,',
      lighting: 'soft natural lighting from large windows,'
    },
    problem: {
      base: 'Intimate consultation setting,',
      people: 'concerned patient consulting with empathetic doctor,',
      mood: 'professional, understanding, problem-focused discussion,',
      lighting: 'soft professional lighting, serious but hopeful mood,'
    },
    solution: {
      base: 'Modern medical treatment room,',
      people: 'skilled practitioner operating medical equipment on patient,',
      mood: 'high-tech, professional, solution-oriented environment,',
      lighting: 'bright clean lighting, medical equipment displays visible,'
    },
    results: {
      base: 'Beautiful clinical setting,',
      people: 'satisfied patient with visible positive results, practitioner showing outcome,',
      mood: 'happy, successful, transformation-focused,',
      lighting: 'bright optimistic lighting, celebratory atmosphere,'
    },
    cta: {
      base: 'Welcoming clinic entrance or reception,',
      people: 'friendly reception staff helping patient schedule appointment,',
      mood: 'inviting, accessible, call-to-action encouraging,',
      lighting: 'bright welcoming lighting, open and accessible feeling,'
    }
  };

  static extractEquipmentsFromScript(script: any): EquipmentInfo[] {
    const equipments: EquipmentInfo[] = [];
    
    // Extrair de equipamentos_utilizados se existir
    if (script.equipamentos_utilizados && Array.isArray(script.equipamentos_utilizados)) {
      equipments.push(...script.equipamentos_utilizados.map((eq: any) => ({
        nome: eq.nome || eq,
        tecnologia: eq.tecnologia,
        indicacoes: eq.indicacoes,
        beneficios: eq.beneficios,
        diferenciais: eq.diferenciais,
        categoria: eq.categoria
      })));
    }
    
    // Extrair do roteiro usando regex para equipamentos mencionados
    if (script.roteiro) {
      const roteiro = script.roteiro.toLowerCase();
      Object.keys(this.EQUIPMENT_VISUAL_MAP).forEach(equipmentName => {
        if (roteiro.includes(equipmentName.toLowerCase()) && 
            !equipments.find(eq => eq.nome.toLowerCase() === equipmentName.toLowerCase())) {
          equipments.push({
            nome: equipmentName,
            categoria: 'mencionado_no_roteiro'
          });
        }
      });
    }
    
    return equipments;
  }

  static buildSlidePrompts(script: any): SlideImagePrompt[] {
    const equipments = this.extractEquipmentsFromScript(script);
    const prompts: SlideImagePrompt[] = [];
    
    if (script.formato === 'carrossel') {
      // Extrair slides do roteiro
      const slides = script.roteiro.split(/(?=Slide:\s)/gi).filter(Boolean);
      
      slides.forEach((slide: string, index: number) => {
        const slideMatch = slide.match(/Slide:\s*([^\n]+)/i);
        const slideTitle = slideMatch ? slideMatch[1].trim() : `Slide ${index + 1}`;
        
        // Determinar tipo de slide baseado no título e posição
        let slideType: keyof typeof this.SLIDE_TEMPLATES = 'hero';
        if (index === 0) slideType = 'hero';
        else if (slideTitle.toLowerCase().includes('problema') || index === 1) slideType = 'problem';
        else if (slideTitle.toLowerCase().includes('solução') || slideTitle.toLowerCase().includes('tratamento') || index === 2) slideType = 'solution';
        else if (slideTitle.toLowerCase().includes('resultado') || slideTitle.toLowerCase().includes('benefício') || index === 3) slideType = 'results';
        else if (slideTitle.toLowerCase().includes('contato') || slideTitle.toLowerCase().includes('agende') || index === 4) slideType = 'cta';
        
        const prompt = this.buildPhotographicPrompt(slideTitle, slideType, equipments, script.tema);
        
        prompts.push({
          slideTitle,
          prompt,
          equipmentUsed: equipments.map(eq => eq.nome),
          imageStyle: slideType
        });
      });
      
      // Garantir exatamente 5 slides para carrossel
      while (prompts.length < 5) {
        const slideNum = prompts.length + 1;
        const defaultType: keyof typeof this.SLIDE_TEMPLATES = slideNum === 5 ? 'cta' : 'solution';
        prompts.push({
          slideTitle: `Slide ${slideNum}`,
          prompt: this.buildPhotographicPrompt(`Tratamento ${script.tema || 'estético'}`, defaultType, equipments, script.tema),
          equipmentUsed: equipments.map(eq => eq.nome),
          imageStyle: defaultType
        });
      }
      
      return prompts.slice(0, 5);
    } else {
      // Para posts únicos
      return [{
        slideTitle: 'Post Principal',
        prompt: this.buildPhotographicPrompt(script.tema || 'tratamento estético', 'hero', equipments, script.tema),
        equipmentUsed: equipments.map(eq => eq.nome),
        imageStyle: 'hero'
      }];
    }
  }

  private static buildPhotographicPrompt(
    slideTitle: string, 
    slideType: keyof typeof this.SLIDE_TEMPLATES, 
    equipments: EquipmentInfo[], 
    tema?: string
  ): string {
    const template = this.SLIDE_TEMPLATES[slideType];
    
    // Construir descrição de equipamentos reais
    let equipmentDescription = '';
    if (equipments.length > 0 && slideType === 'solution') {
      const mainEquipment = equipments[0];
      const visualDescription = this.EQUIPMENT_VISUAL_MAP[mainEquipment.nome] || 
                               `professional ${mainEquipment.nome} medical device`;
      equipmentDescription = `featuring ${visualDescription}, equipment clearly visible and properly positioned, `;
    }
    
    // Construir contexto específico do tema
    let themeContext = '';
    if (tema) {
      themeContext = `focusing on ${tema} treatment, `;
    }
    
    // Montar prompt final
    const photographicPrompt = `
${this.PHOTOGRAPHY_BASE}

${template.base}
${template.people}
${equipmentDescription}
${themeContext}
${template.mood}
${template.lighting}

Clinical environment details: modern white and light blue color scheme, 
professional medical furniture, clean sterile surfaces,
proper medical lighting, professional uniforms,
realistic human interactions, natural expressions,
no fictional or exaggerated elements,

${this.ANTI_HALLUCINATION_RULES}

Style: Professional medical stock photography, 
commercial healthcare marketing image,
clean composition, ready for social media use,
high-resolution, professional quality
    `.trim().replace(/\s+/g, ' ');
    
    return photographicPrompt;
  }

  static validatePrompt(prompt: string): boolean {
    // Validações básicas para evitar alucinações
    const hasPhotographyTerms = prompt.includes('photography') || prompt.includes('professional');
    const hasAntiHallucinationRules = prompt.includes('real medical equipment');
    const isReasonableLength = prompt.length > 100 && prompt.length < 2000;
    
    return hasPhotographyTerms && hasAntiHallucinationRules && isReasonableLength;
  }
}
