export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_page: {
        Row: {
          brands: Json | null
          created_at: string | null
          id: string
          mission_description: string
          mission_image: string | null
          mission_title: string
          partner_brands_description: string | null
          partner_brands_title: string | null
          updated_at: string | null
          values: Json
          values_images: Json | null
        }
        Insert: {
          brands?: Json | null
          created_at?: string | null
          id: string
          mission_description: string
          mission_image?: string | null
          mission_title: string
          partner_brands_description?: string | null
          partner_brands_title?: string | null
          updated_at?: string | null
          values?: Json
          values_images?: Json | null
        }
        Update: {
          brands?: Json | null
          created_at?: string | null
          id?: string
          mission_description?: string
          mission_image?: string | null
          mission_title?: string
          partner_brands_description?: string | null
          partner_brands_title?: string | null
          updated_at?: string | null
          values?: Json
          values_images?: Json | null
        }
        Relationships: []
      }
      ad_creative_performance: {
        Row: {
          campanha_nome: string | null
          copy_usada: string | null
          creative_id: string | null
          data_referencia: string | null
          id: string
          link_midia: string | null
          metrica_chave: string | null
          objetivo: string | null
          resultado: string | null
          tipo_conteudo: string | null
          user_id: string | null
          valor_metrica: number | null
        }
        Insert: {
          campanha_nome?: string | null
          copy_usada?: string | null
          creative_id?: string | null
          data_referencia?: string | null
          id?: string
          link_midia?: string | null
          metrica_chave?: string | null
          objetivo?: string | null
          resultado?: string | null
          tipo_conteudo?: string | null
          user_id?: string | null
          valor_metrica?: number | null
        }
        Update: {
          campanha_nome?: string | null
          copy_usada?: string | null
          creative_id?: string | null
          data_referencia?: string | null
          id?: string
          link_midia?: string | null
          metrica_chave?: string | null
          objetivo?: string | null
          resultado?: string | null
          tipo_conteudo?: string | null
          user_id?: string | null
          valor_metrica?: number | null
        }
        Relationships: []
      }
      agenda: {
        Row: {
          data: string | null
          data_criacao: string | null
          descricao: string | null
          equipamento: string | null
          formato: string | null
          gancho: string | null
          id: string
          legenda: string | null
          objetivo: string | null
          roteiro_id: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          usuario_id: string | null
        }
        Insert: {
          data?: string | null
          data_criacao?: string | null
          descricao?: string | null
          equipamento?: string | null
          formato?: string | null
          gancho?: string | null
          id?: string
          legenda?: string | null
          objetivo?: string | null
          roteiro_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Update: {
          data?: string | null
          data_criacao?: string | null
          descricao?: string | null
          equipamento?: string | null
          formato?: string | null
          gancho?: string | null
          id?: string
          legenda?: string | null
          objetivo?: string | null
          roteiro_id?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_roteiro_id_fkey"
            columns: ["roteiro_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_email: {
        Row: {
          ativo: boolean | null
          data_criacao: string | null
          id: string
          tipo: string | null
          ultima_execucao: string | null
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          data_criacao?: string | null
          id?: string
          tipo?: string | null
          ultima_execucao?: string | null
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          data_criacao?: string | null
          id?: string
          tipo?: string | null
          ultima_execucao?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alertas_email_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          comentario: string | null
          data_avaliacao: string | null
          id: string
          nota: number | null
          usuario_id: string | null
          video_id: string | null
        }
        Insert: {
          comentario?: string | null
          data_avaliacao?: string | null
          id?: string
          nota?: number | null
          usuario_id?: string | null
          video_id?: string | null
        }
        Update: {
          comentario?: string | null
          data_avaliacao?: string | null
          id?: string
          nota?: number | null
          usuario_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          date: string
          equipment_benefits: string[] | null
          equipment_description: string | null
          equipment_detail_image: string | null
          equipment_name: string | null
          equipment_video: string | null
          gallery_images: string[] | null
          id: string
          image: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          date?: string
          equipment_benefits?: string[] | null
          equipment_description?: string | null
          equipment_detail_image?: string | null
          equipment_name?: string | null
          equipment_video?: string | null
          gallery_images?: string[] | null
          id?: string
          image?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          date?: string
          equipment_benefits?: string[] | null
          equipment_description?: string | null
          equipment_detail_image?: string | null
          equipment_name?: string | null
          equipment_video?: string | null
          gallery_images?: string[] | null
          id?: string
          image?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          banner_url: string | null
          content: string | null
          country: string | null
          created_at: string | null
          cta_text: string | null
          description: string | null
          id: string
          image_url: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          content?: string | null
          country?: string | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          content?: string | null
          country?: string | null
          created_at?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_settings: {
        Row: {
          address: string
          consumer_code: string | null
          created_at: string
          email: string
          external_form_code: string | null
          form_recipient: string
          id: string
          nif: string | null
          phone: string
          social_media: Json
          updated_at: string
        }
        Insert: {
          address?: string
          consumer_code?: string | null
          created_at?: string
          email?: string
          external_form_code?: string | null
          form_recipient?: string
          id?: string
          nif?: string | null
          phone?: string
          social_media?: Json
          updated_at?: string
        }
        Update: {
          address?: string
          consumer_code?: string | null
          created_at?: string
          email?: string
          external_form_code?: string | null
          form_recipient?: string
          id?: string
          nif?: string | null
          phone?: string
          social_media?: Json
          updated_at?: string
        }
        Relationships: []
      }
      content_feedback_history: {
        Row: {
          approved: boolean | null
          content_id: string | null
          content_type: string
          created_at: string
          features_disliked: string[] | null
          features_liked: string[] | null
          feedback_text: string | null
          id: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          content_id?: string | null
          content_type: string
          created_at?: string
          features_disliked?: string[] | null
          features_liked?: string[] | null
          feedback_text?: string | null
          id?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          content_id?: string | null
          content_type?: string
          created_at?: string
          features_disliked?: string[] | null
          features_liked?: string[] | null
          feedback_text?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      content_planner_items: {
        Row: {
          ai_generated: boolean | null
          author_id: string | null
          author_name: string | null
          calendar_event_id: string | null
          created_at: string
          description: string | null
          distribution: string
          equipment_id: string | null
          equipment_name: string | null
          format: string
          id: string
          objective: string
          responsible_id: string | null
          responsible_name: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          script_id: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          author_id?: string | null
          author_name?: string | null
          calendar_event_id?: string | null
          created_at?: string
          description?: string | null
          distribution?: string
          equipment_id?: string | null
          equipment_name?: string | null
          format?: string
          id?: string
          objective?: string
          responsible_id?: string | null
          responsible_name?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          script_id?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          author_id?: string | null
          author_name?: string | null
          calendar_event_id?: string | null
          created_at?: string
          description?: string | null
          distribution?: string
          equipment_id?: string | null
          equipment_name?: string | null
          format?: string
          id?: string
          objective?: string
          responsible_id?: string | null
          responsible_name?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          script_id?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_strategy_items: {
        Row: {
          categoria: string
          conteudo: string | null
          created_at: string
          created_by: string | null
          equipamento_id: string | null
          formato: string
          id: string
          impedimento: string | null
          linha: string | null
          objetivo: string
          previsao: string | null
          prioridade: string
          responsavel_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          categoria: string
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          equipamento_id?: string | null
          formato: string
          id?: string
          impedimento?: string | null
          linha?: string | null
          objetivo: string
          previsao?: string | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          conteudo?: string | null
          created_at?: string
          created_by?: string | null
          equipamento_id?: string | null
          formato?: string
          id?: string
          impedimento?: string | null
          linha?: string | null
          objetivo?: string
          previsao?: string | null
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_strategy_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_strategy_items_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_strategy_items_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_tecnicos: {
        Row: {
          conteudo_extraido: string | null
          criado_por: string | null
          data_criacao: string | null
          descricao: string | null
          equipamento_id: string | null
          id: string
          idioma_original: string | null
          keywords: string[] | null
          link_dropbox: string | null
          researchers: string[] | null
          status: string | null
          tipo: string
          titulo: string
          vetor_embeddings: string | null
        }
        Insert: {
          conteudo_extraido?: string | null
          criado_por?: string | null
          data_criacao?: string | null
          descricao?: string | null
          equipamento_id?: string | null
          id?: string
          idioma_original?: string | null
          keywords?: string[] | null
          link_dropbox?: string | null
          researchers?: string[] | null
          status?: string | null
          tipo: string
          titulo: string
          vetor_embeddings?: string | null
        }
        Update: {
          conteudo_extraido?: string | null
          criado_por?: string | null
          data_criacao?: string | null
          descricao?: string | null
          equipamento_id?: string | null
          id?: string
          idioma_original?: string | null
          keywords?: string[] | null
          link_dropbox?: string | null
          researchers?: string[] | null
          status?: string | null
          tipo?: string
          titulo?: string
          vetor_embeddings?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_tecnicos_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos: {
        Row: {
          akinator_enabled: boolean | null
          area_aplicacao: string[] | null
          ativo: boolean | null
          beneficios: string
          categoria: string | null
          contraindicacoes: string[] | null
          data_cadastro: string | null
          diferenciais: string
          efeito: string | null
          id: string
          image_url: string | null
          indicacoes: string
          linguagem: string
          nivel_investimento: string | null
          nome: string
          perfil_ideal_paciente: string[] | null
          possui_consumiveis: boolean | null
          tecnologia: string
          thumbnail_url: string | null
          tipo_acao: string | null
        }
        Insert: {
          akinator_enabled?: boolean | null
          area_aplicacao?: string[] | null
          ativo?: boolean | null
          beneficios: string
          categoria?: string | null
          contraindicacoes?: string[] | null
          data_cadastro?: string | null
          diferenciais: string
          efeito?: string | null
          id?: string
          image_url?: string | null
          indicacoes: string
          linguagem: string
          nivel_investimento?: string | null
          nome: string
          perfil_ideal_paciente?: string[] | null
          possui_consumiveis?: boolean | null
          tecnologia: string
          thumbnail_url?: string | null
          tipo_acao?: string | null
        }
        Update: {
          akinator_enabled?: boolean | null
          area_aplicacao?: string[] | null
          ativo?: boolean | null
          beneficios?: string
          categoria?: string | null
          contraindicacoes?: string[] | null
          data_cadastro?: string | null
          diferenciais?: string
          efeito?: string | null
          id?: string
          image_url?: string | null
          indicacoes?: string
          linguagem?: string
          nivel_investimento?: string | null
          nome?: string
          perfil_ideal_paciente?: string[] | null
          possui_consumiveis?: boolean | null
          tecnologia?: string
          thumbnail_url?: string | null
          tipo_acao?: string | null
        }
        Relationships: []
      }
      equipment_applicators: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          equipment_id: string
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          technology: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          equipment_id: string
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          technology?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          equipment_id?: string
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          technology?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_applicators_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          data_favorito: string | null
          id: string
          usuario_id: string | null
          video_id: string | null
        }
        Insert: {
          data_favorito?: string | null
          id?: string
          usuario_id?: string | null
          video_id?: string | null
        }
        Update: {
          data_favorito?: string | null
          id?: string
          usuario_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      gpt_config: {
        Row: {
          ativo: boolean | null
          chave_api: string | null
          data_configuracao: string | null
          id: string
          modelo: string | null
          nome: string | null
          prompt: string | null
          tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          chave_api?: string | null
          data_configuracao?: string | null
          id?: string
          modelo?: string | null
          nome?: string | null
          prompt?: string | null
          tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          chave_api?: string | null
          data_configuracao?: string | null
          id?: string
          modelo?: string | null
          nome?: string | null
          prompt?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      instagram_analytics: {
        Row: {
          analysis_result: string | null
          created_at: string
          data_snapshot: Json | null
          engagement_rate: number | null
          followers_count: number | null
          following_count: number | null
          id: string
          impressions: number | null
          instagram_user_id: string
          media_count: number | null
          post_frequency: number | null
          reach: number | null
          user_id: string
        }
        Insert: {
          analysis_result?: string | null
          created_at?: string
          data_snapshot?: Json | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions?: number | null
          instagram_user_id: string
          media_count?: number | null
          post_frequency?: number | null
          reach?: number | null
          user_id: string
        }
        Update: {
          analysis_result?: string | null
          created_at?: string
          data_snapshot?: Json | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          id?: string
          impressions?: number | null
          instagram_user_id?: string
          media_count?: number | null
          post_frequency?: number | null
          reach?: number | null
          user_id?: string
        }
        Relationships: []
      }
      instagram_configs: {
        Row: {
          access_token: string
          account_type: string | null
          created_at: string
          id: string
          instagram_user_id: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          account_type?: string | null
          created_at?: string
          id?: string
          instagram_user_id: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          account_type?: string | null
          created_at?: string
          id?: string
          instagram_user_id?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      integracao_configs: {
        Row: {
          atualizado_em: string
          config: Json
          criado_em: string
          id: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          config?: Json
          criado_em?: string
          id?: string
          tipo: string
        }
        Update: {
          atualizado_em?: string
          config?: Json
          criado_em?: string
          id?: string
          tipo?: string
        }
        Relationships: []
      }
      intent_history: {
        Row: {
          acao_executada: string | null
          data: string | null
          id: string
          intencao_detectada: string | null
          mensagem_usuario: string | null
          user_id: string | null
        }
        Insert: {
          acao_executada?: string | null
          data?: string | null
          id?: string
          intencao_detectada?: string | null
          mensagem_usuario?: string | null
          user_id?: string | null
        }
        Update: {
          acao_executada?: string | null
          data?: string | null
          id?: string
          intencao_detectada?: string | null
          mensagem_usuario?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      logs_uso: {
        Row: {
          acao: string | null
          data_log: string | null
          detalhe: string | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          acao?: string | null
          data_log?: string | null
          detalhe?: string | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string | null
          data_log?: string | null
          detalhe?: string | null
          id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_uso_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_diagnostics: {
        Row: {
          clinic_type: string
          created_at: string
          generated_diagnostic: string | null
          id: string
          is_completed: boolean
          session_id: string
          specialty: string
          state_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          clinic_type: string
          created_at?: string
          generated_diagnostic?: string | null
          id?: string
          is_completed?: boolean
          session_id: string
          specialty: string
          state_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          clinic_type?: string
          created_at?: string
          generated_diagnostic?: string | null
          id?: string
          is_completed?: boolean
          session_id?: string
          specialty?: string
          state_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      materiais: {
        Row: {
          arquivo_url: string | null
          categoria: string | null
          data_upload: string | null
          id: string
          nome: string | null
          preview_url: string | null
          tags: string[] | null
          tipo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          categoria?: string | null
          data_upload?: string | null
          id?: string
          nome?: string | null
          preview_url?: string | null
          tags?: string[] | null
          tipo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          categoria?: string | null
          data_upload?: string | null
          id?: string
          nome?: string | null
          preview_url?: string | null
          tags?: string[] | null
          tipo?: string | null
        }
        Relationships: []
      }
      mentores: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          estilo: string
          exemplos: string[]
          id: string
          nome: string
          tecnicas: Json | null
          tom: string
          updated_at: string
          uso_ideal: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          estilo: string
          exemplos?: string[]
          id?: string
          nome: string
          tecnicas?: Json | null
          tom: string
          updated_at?: string
          uso_ideal: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          estilo?: string
          exemplos?: string[]
          id?: string
          nome?: string
          tecnicas?: Json | null
          tom?: string
          updated_at?: string
          uso_ideal?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          cidade: string | null
          clinica: string | null
          data_criacao: string | null
          email: string
          equipamentos: string[] | null
          foto_url: string | null
          id: string
          idioma: string | null
          nome: string | null
          observacoes_conteudo: string | null
          role: string | null
          telefone: string | null
        }
        Insert: {
          cidade?: string | null
          clinica?: string | null
          data_criacao?: string | null
          email: string
          equipamentos?: string[] | null
          foto_url?: string | null
          id: string
          idioma?: string | null
          nome?: string | null
          observacoes_conteudo?: string | null
          role?: string | null
          telefone?: string | null
        }
        Update: {
          cidade?: string | null
          clinica?: string | null
          data_criacao?: string | null
          email?: string
          equipamentos?: string[] | null
          foto_url?: string | null
          id?: string
          idioma?: string | null
          nome?: string | null
          observacoes_conteudo?: string | null
          role?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          applicators: Json | null
          banner_image: string | null
          bannerimage: string | null
          before_after_images: string[] | null
          beforeafterimages: Json | null
          brand: string
          brand_id: string | null
          category: string
          created_at: string
          deadline: string
          featured: boolean | null
          features: Json | null
          features_benefits_icon: string | null
          full_description: string | null
          fulldescription: string | null
          id: string
          images: string[] | null
          indications: string[] | null
          investment: string | null
          medical_indications_icon: string | null
          medicalindications: Json | null
          name: string
          parallax_image: string | null
          pdf_url: string | null
          short_description: string | null
          shortdescription: string
          specifications: Json | null
          status: string
          strategic_differentials_icon: string | null
          strategicdifferentials: Json | null
          technologies: string[] | null
          thumb_image: string | null
          updated_at: string
          video_url: string | null
          videourl: string | null
          whatisequipment: Json | null
        }
        Insert: {
          active?: boolean | null
          applicators?: Json | null
          banner_image?: string | null
          bannerimage?: string | null
          before_after_images?: string[] | null
          beforeafterimages?: Json | null
          brand: string
          brand_id?: string | null
          category: string
          created_at?: string
          deadline: string
          featured?: boolean | null
          features?: Json | null
          features_benefits_icon?: string | null
          full_description?: string | null
          fulldescription?: string | null
          id?: string
          images?: string[] | null
          indications?: string[] | null
          investment?: string | null
          medical_indications_icon?: string | null
          medicalindications?: Json | null
          name: string
          parallax_image?: string | null
          pdf_url?: string | null
          short_description?: string | null
          shortdescription: string
          specifications?: Json | null
          status: string
          strategic_differentials_icon?: string | null
          strategicdifferentials?: Json | null
          technologies?: string[] | null
          thumb_image?: string | null
          updated_at?: string
          video_url?: string | null
          videourl?: string | null
          whatisequipment?: Json | null
        }
        Update: {
          active?: boolean | null
          applicators?: Json | null
          banner_image?: string | null
          bannerimage?: string | null
          before_after_images?: string[] | null
          beforeafterimages?: Json | null
          brand?: string
          brand_id?: string | null
          category?: string
          created_at?: string
          deadline?: string
          featured?: boolean | null
          features?: Json | null
          features_benefits_icon?: string | null
          full_description?: string | null
          fulldescription?: string | null
          id?: string
          images?: string[] | null
          indications?: string[] | null
          investment?: string | null
          medical_indications_icon?: string | null
          medicalindications?: Json | null
          name?: string
          parallax_image?: string | null
          pdf_url?: string | null
          short_description?: string | null
          shortdescription?: string
          specifications?: Json | null
          status?: string
          strategic_differentials_icon?: string | null
          strategicdifferentials?: Json | null
          technologies?: string[] | null
          thumb_image?: string | null
          updated_at?: string
          video_url?: string | null
          videourl?: string | null
          whatisequipment?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      roteiro_validacoes: {
        Row: {
          data_validacao: string | null
          id: string
          pontuacao_clareza: number | null
          pontuacao_cta: number | null
          pontuacao_emocao: number | null
          pontuacao_gancho: number | null
          pontuacao_total: number | null
          roteiro_id: string | null
          sugestoes: string | null
          validado_por: string | null
        }
        Insert: {
          data_validacao?: string | null
          id?: string
          pontuacao_clareza?: number | null
          pontuacao_cta?: number | null
          pontuacao_emocao?: number | null
          pontuacao_gancho?: number | null
          pontuacao_total?: number | null
          roteiro_id?: string | null
          sugestoes?: string | null
          validado_por?: string | null
        }
        Update: {
          data_validacao?: string | null
          id?: string
          pontuacao_clareza?: number | null
          pontuacao_cta?: number | null
          pontuacao_emocao?: number | null
          pontuacao_gancho?: number | null
          pontuacao_total?: number | null
          roteiro_id?: string | null
          sugestoes?: string | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteiro_validacoes_roteiro_id_fkey"
            columns: ["roteiro_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      roteiros: {
        Row: {
          conteudo: string | null
          data_criacao: string | null
          evento_agenda_id: string | null
          id: string
          observacoes: string | null
          pdf_url: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          usuario_id: string | null
        }
        Insert: {
          conteudo?: string | null
          data_criacao?: string | null
          evento_agenda_id?: string | null
          id?: string
          observacoes?: string | null
          pdf_url?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Update: {
          conteudo?: string | null
          data_criacao?: string | null
          evento_agenda_id?: string | null
          id?: string
          observacoes?: string | null
          pdf_url?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteiros_evento_agenda_id_fkey"
            columns: ["evento_agenda_id"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roteiros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      script_feedback: {
        Row: {
          criado_em: string | null
          estilo_detectado: string | null
          feedback_tipo: string | null
          formato: string | null
          id: string
          script_id: string | null
          tema_principal: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          estilo_detectado?: string | null
          feedback_tipo?: string | null
          formato?: string | null
          id?: string
          script_id?: string | null
          tema_principal?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          estilo_detectado?: string | null
          feedback_tipo?: string | null
          formato?: string | null
          id?: string
          script_id?: string | null
          tema_principal?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "script_feedback_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      script_validations: {
        Row: {
          created_at: string
          id: string
          score: number
          script_id: string
          validation_data: Json
        }
        Insert: {
          created_at?: string
          id?: string
          score?: number
          script_id: string
          validation_data: Json
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          script_id?: string
          validation_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_script_validations_scripts"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          ai_generation_limit: number | null
          billing_cycle: string
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          pdf_export_limit: number | null
          price: number
          updated_at: string
          validation_limit: number | null
        }
        Insert: {
          active?: boolean
          ai_generation_limit?: number | null
          billing_cycle?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          pdf_export_limit?: number | null
          price?: number
          updated_at?: string
          validation_limit?: number | null
        }
        Update: {
          active?: boolean
          ai_generation_limit?: number | null
          billing_cycle?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          pdf_export_limit?: number | null
          price?: number
          updated_at?: string
          validation_limit?: number | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          categoria: string | null
          data_criacao: string | null
          id: string
          nome: string
          usado_count: number | null
        }
        Insert: {
          categoria?: string | null
          data_criacao?: string | null
          id?: string
          nome: string
          usado_count?: number | null
        }
        Update: {
          categoria?: string | null
          data_criacao?: string | null
          id?: string
          nome?: string
          usado_count?: number | null
        }
        Relationships: []
      }
      user_content_profiles: {
        Row: {
          common_keywords: string[] | null
          created_at: string
          id: string
          personal_prompt_additions: string | null
          personalization_active: boolean | null
          tone_preference: string | null
          topics: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          common_keywords?: string[] | null
          created_at?: string
          id?: string
          personal_prompt_additions?: string | null
          personalization_active?: boolean | null
          tone_preference?: string | null
          topics?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          common_keywords?: string[] | null
          created_at?: string
          id?: string
          personal_prompt_additions?: string | null
          personalization_active?: boolean | null
          tone_preference?: string | null
          topics?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email_convidado: string
          id: string
          role_sugerido: string
          status: string
          workspace_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email_convidado: string
          id?: string
          role_sugerido: string
          status?: string
          workspace_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email_convidado?: string
          id?: string
          role_sugerido?: string
          status?: string
          workspace_id?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          atualizado_em: string | null
          estilo_preferido: string | null
          foco_comunicacao: string | null
          insights_performance: string[] | null
          perfil_comportamental: string[] | null
          tipos_conteudo_validados: string[] | null
          user_id: string
        }
        Insert: {
          atualizado_em?: string | null
          estilo_preferido?: string | null
          foco_comunicacao?: string | null
          insights_performance?: string[] | null
          perfil_comportamental?: string[] | null
          tipos_conteudo_validados?: string[] | null
          user_id: string
        }
        Update: {
          atualizado_em?: string | null
          estilo_preferido?: string | null
          foco_comunicacao?: string | null
          insights_performance?: string[] | null
          perfil_comportamental?: string[] | null
          tipos_conteudo_validados?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          ai_generations_used: number | null
          content_preferences: Json | null
          created_at: string
          id: string
          last_activity: string | null
          pdf_exports_used: number | null
          plan_id: string | null
          updated_at: string
          usage_reset_date: string | null
          user_id: string
          validations_used: number | null
        }
        Insert: {
          ai_generations_used?: number | null
          content_preferences?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          pdf_exports_used?: number | null
          plan_id?: string | null
          updated_at?: string
          usage_reset_date?: string | null
          user_id: string
          validations_used?: number | null
        }
        Update: {
          ai_generations_used?: number | null
          content_preferences?: Json | null
          created_at?: string
          id?: string
          last_activity?: string | null
          pdf_exports_used?: number | null
          plan_id?: string | null
          updated_at?: string
          usage_reset_date?: string | null
          user_id?: string
          validations_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_usage_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vimeo_tokens: {
        Row: {
          access_token: string
          account_name: string | null
          account_uri: string | null
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          account_name?: string | null
          account_uri?: string | null
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          scope?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          account_name?: string | null
          account_uri?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      validated_articles: {
        Row: {
          article_link: string | null
          foco: string | null
          id: string
          interagido_em: string | null
          tema: string | null
          tipo_interacao: string | null
          user_id: string | null
        }
        Insert: {
          article_link?: string | null
          foco?: string | null
          id?: string
          interagido_em?: string | null
          tema?: string | null
          tipo_interacao?: string | null
          user_id?: string | null
        }
        Update: {
          article_link?: string | null
          foco?: string | null
          id?: string
          interagido_em?: string | null
          tema?: string | null
          tipo_interacao?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      validated_ideas: {
        Row: {
          formato: string | null
          id: string
          origem_ideia: string | null
          tema: string | null
          tipo_validacao: string | null
          user_id: string | null
          validado_em: string | null
        }
        Insert: {
          formato?: string | null
          id?: string
          origem_ideia?: string | null
          tema?: string | null
          tipo_validacao?: string | null
          user_id?: string | null
          validado_em?: string | null
        }
        Update: {
          formato?: string | null
          id?: string
          origem_ideia?: string | null
          tema?: string | null
          tipo_validacao?: string | null
          user_id?: string | null
          validado_em?: string | null
        }
        Relationships: []
      }
      video_downloads: {
        Row: {
          downloaded_at: string | null
          id: string
          ip_address: string | null
          quality: string | null
          user_agent: string | null
          user_id: string
          video_id: string
        }
        Insert: {
          downloaded_at?: string | null
          id?: string
          ip_address?: string | null
          quality?: string | null
          user_agent?: string | null
          user_id: string
          video_id: string
        }
        Update: {
          downloaded_at?: string | null
          id?: string
          ip_address?: string | null
          quality?: string | null
          user_agent?: string | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_downloads_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos_storage"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          area_corpo: string | null
          categoria: string | null
          compartilhamentos: number | null
          curtidas: number | null
          data_upload: string | null
          descricao: string | null
          descricao_curta: string | null
          descricao_detalhada: string | null
          duracao: string | null
          equipamentos: string[] | null
          favoritos_count: number | null
          finalidade: string[] | null
          id: string
          preview_url: string | null
          tags: string[] | null
          tipo_video: string | null
          titulo: string | null
          url_video: string | null
          vimeo_id: string | null
        }
        Insert: {
          area_corpo?: string | null
          categoria?: string | null
          compartilhamentos?: number | null
          curtidas?: number | null
          data_upload?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          descricao_detalhada?: string | null
          duracao?: string | null
          equipamentos?: string[] | null
          favoritos_count?: number | null
          finalidade?: string[] | null
          id?: string
          preview_url?: string | null
          tags?: string[] | null
          tipo_video?: string | null
          titulo?: string | null
          url_video?: string | null
          vimeo_id?: string | null
        }
        Update: {
          area_corpo?: string | null
          categoria?: string | null
          compartilhamentos?: number | null
          curtidas?: number | null
          data_upload?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          descricao_detalhada?: string | null
          duracao?: string | null
          equipamentos?: string[] | null
          favoritos_count?: number | null
          finalidade?: string[] | null
          id?: string
          preview_url?: string | null
          tags?: string[] | null
          tipo_video?: string | null
          titulo?: string | null
          url_video?: string | null
          vimeo_id?: string | null
        }
        Relationships: []
      }
      videos_storage: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          file_urls: Json | null
          id: string
          metadata: Json | null
          owner_id: string
          public: boolean | null
          size: number
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_urls?: Json | null
          id?: string
          metadata?: Json | null
          owner_id: string
          public?: boolean | null
          size: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          file_urls?: Json | null
          id?: string
          metadata?: Json | null
          owner_id?: string
          public?: boolean | null
          size?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      database_documentation: {
        Row: {
          column_default: string | null
          column_name: unknown | null
          column_type: string | null
          data_type: string | null
          description: string | null
          is_nullable: string | null
          table_name: unknown | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      decrement_favorites_count: {
        Args: { video_id: string }
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_favorites_count: {
        Args: { video_id: string }
        Returns: undefined
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
