export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      agent_coordination: {
        Row: {
          completed_at: string | null
          coordination_strategy: Json | null
          created_at: string | null
          execution_order: number[] | null
          id: string
          primary_agent_id: string | null
          result: Json | null
          secondary_agents: string[] | null
          session_id: string
          status: string | null
          task_type: string
        }
        Insert: {
          completed_at?: string | null
          coordination_strategy?: Json | null
          created_at?: string | null
          execution_order?: number[] | null
          id?: string
          primary_agent_id?: string | null
          result?: Json | null
          secondary_agents?: string[] | null
          session_id: string
          status?: string | null
          task_type: string
        }
        Update: {
          completed_at?: string | null
          coordination_strategy?: Json | null
          created_at?: string | null
          execution_order?: number[] | null
          id?: string
          primary_agent_id?: string | null
          result?: Json | null
          secondary_agents?: string[] | null
          session_id?: string
          status?: string | null
          task_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_coordination_primary_agent_id_fkey"
            columns: ["primary_agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          active: boolean | null
          capabilities: Json | null
          created_at: string | null
          id: string
          name: string
          performance_metrics: Json | null
          specialization: string
          system_prompt: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          name: string
          performance_metrics?: Json | null
          specialization: string
          system_prompt: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          performance_metrics?: Json | null
          specialization?: string
          system_prompt?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          ai_response: string
          ai_service: string
          context_data: Json | null
          created_at: string
          feedback_type: string
          id: string
          improvement_applied: boolean | null
          processed_at: string | null
          prompt_used: string
          response_time_ms: number | null
          session_id: string
          tokens_used: number | null
          user_feedback: Json
          user_id: string
        }
        Insert: {
          ai_response: string
          ai_service: string
          context_data?: Json | null
          created_at?: string
          feedback_type?: string
          id?: string
          improvement_applied?: boolean | null
          processed_at?: string | null
          prompt_used: string
          response_time_ms?: number | null
          session_id: string
          tokens_used?: number | null
          user_feedback: Json
          user_id: string
        }
        Update: {
          ai_response?: string
          ai_service?: string
          context_data?: Json | null
          created_at?: string
          feedback_type?: string
          id?: string
          improvement_applied?: boolean | null
          processed_at?: string | null
          prompt_used?: string
          response_time_ms?: number | null
          session_id?: string
          tokens_used?: number | null
          user_feedback?: Json
          user_id?: string
        }
        Relationships: []
      }
      ai_learning_log: {
        Row: {
          after_state: Json
          applied_at: string
          before_state: Json
          confidence_score: number | null
          id: string
          improvement_metrics: Json | null
          learning_type: string
          rollback_at: string | null
          service_name: string
          success_validated: boolean | null
          trigger_event: string
          validation_metrics: Json | null
        }
        Insert: {
          after_state: Json
          applied_at?: string
          before_state: Json
          confidence_score?: number | null
          id?: string
          improvement_metrics?: Json | null
          learning_type: string
          rollback_at?: string | null
          service_name: string
          success_validated?: boolean | null
          trigger_event: string
          validation_metrics?: Json | null
        }
        Update: {
          after_state?: Json
          applied_at?: string
          before_state?: Json
          confidence_score?: number | null
          id?: string
          improvement_metrics?: Json | null
          learning_type?: string
          rollback_at?: string | null
          service_name?: string
          success_validated?: boolean | null
          trigger_event?: string
          validation_metrics?: Json | null
        }
        Relationships: []
      }
      ai_performance_metrics: {
        Row: {
          auto_adjustments_made: number | null
          avg_rating: number | null
          avg_response_time_ms: number | null
          created_at: string
          error_rate: number | null
          estimated_cost: number | null
          id: string
          improvement_opportunities: Json | null
          metric_date: string
          service_name: string
          successful_requests: number | null
          total_requests: number | null
          total_tokens_used: number | null
          updated_at: string
          user_satisfaction: number | null
        }
        Insert: {
          auto_adjustments_made?: number | null
          avg_rating?: number | null
          avg_response_time_ms?: number | null
          created_at?: string
          error_rate?: number | null
          estimated_cost?: number | null
          id?: string
          improvement_opportunities?: Json | null
          metric_date?: string
          service_name: string
          successful_requests?: number | null
          total_requests?: number | null
          total_tokens_used?: number | null
          updated_at?: string
          user_satisfaction?: number | null
        }
        Update: {
          auto_adjustments_made?: number | null
          avg_rating?: number | null
          avg_response_time_ms?: number | null
          created_at?: string
          error_rate?: number | null
          estimated_cost?: number | null
          id?: string
          improvement_opportunities?: Json | null
          metric_date?: string
          service_name?: string
          successful_requests?: number | null
          total_requests?: number | null
          total_tokens_used?: number | null
          updated_at?: string
          user_satisfaction?: number | null
        }
        Relationships: []
      }
      ai_prompt_templates: {
        Row: {
          auto_generated: boolean | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          parameters: Json | null
          performance_metrics: Json | null
          prompt_template: string
          prompt_version: string
          service_name: string
          system_instructions: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          parameters?: Json | null
          performance_metrics?: Json | null
          prompt_template: string
          prompt_version: string
          service_name: string
          system_instructions?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          parameters?: Json | null
          performance_metrics?: Json | null
          prompt_template?: string
          prompt_version?: string
          service_name?: string
          system_instructions?: string | null
        }
        Relationships: []
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
      approved_scripts: {
        Row: {
          approval_notes: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          equipment_used: string[] | null
          format: string
          id: string
          script_content: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          equipment_used?: string[] | null
          format?: string
          id?: string
          script_content: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          equipment_used?: string[] | null
          format?: string
          id?: string
          script_content?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      before_after_photos: {
        Row: {
          after_image_url: string
          approved_script_id: string | null
          associated_therapies: string[] | null
          before_image_url: string
          created_at: string
          description: string | null
          equipment_parameters: Json | null
          equipment_used: string[] | null
          id: string
          is_public: boolean | null
          procedure_date: string | null
          session_count: number | null
          session_interval: number | null
          session_notes: string | null
          title: string
          treated_areas: string[] | null
          treatment_objective: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          after_image_url: string
          approved_script_id?: string | null
          associated_therapies?: string[] | null
          before_image_url: string
          created_at?: string
          description?: string | null
          equipment_parameters?: Json | null
          equipment_used?: string[] | null
          id?: string
          is_public?: boolean | null
          procedure_date?: string | null
          session_count?: number | null
          session_interval?: number | null
          session_notes?: string | null
          title: string
          treated_areas?: string[] | null
          treatment_objective?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          after_image_url?: string
          approved_script_id?: string | null
          associated_therapies?: string[] | null
          before_image_url?: string
          created_at?: string
          description?: string | null
          equipment_parameters?: Json | null
          equipment_used?: string[] | null
          id?: string
          is_public?: boolean | null
          procedure_date?: string | null
          session_count?: number | null
          session_interval?: number | null
          session_notes?: string | null
          title?: string
          treated_areas?: string[] | null
          treatment_objective?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "before_after_photos_approved_script_id_fkey"
            columns: ["approved_script_id"]
            isOneToOne: false
            referencedRelation: "approved_scripts"
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
          approved_script_id: string | null
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
          performance_metrics: Json | null
          performance_rating: string | null
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
          approved_script_id?: string | null
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
          performance_metrics?: Json | null
          performance_rating?: string | null
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
          approved_script_id?: string | null
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
          performance_metrics?: Json | null
          performance_rating?: string | null
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
        Relationships: [
          {
            foreignKeyName: "content_planner_items_approved_script_id_fkey"
            columns: ["approved_script_id"]
            isOneToOne: false
            referencedRelation: "approved_scripts"
            referencedColumns: ["id"]
          },
        ]
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
          arquivo_url: string | null
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
          arquivo_url?: string | null
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
          arquivo_url?: string | null
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
      downloads_storage: {
        Row: {
          carousel_images: string[] | null
          category: string | null
          created_at: string | null
          description: string | null
          equipment_ids: string[] | null
          file_type: string
          file_url: string
          id: string
          is_carousel: boolean | null
          metadata: Json | null
          owner_id: string
          size: number | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          carousel_images?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          equipment_ids?: string[] | null
          file_type: string
          file_url: string
          id?: string
          is_carousel?: boolean | null
          metadata?: Json | null
          owner_id: string
          size?: number | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          carousel_images?: string[] | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          equipment_ids?: string[] | null
          file_type?: string
          file_url?: string
          id?: string
          is_carousel?: boolean | null
          metadata?: Json | null
          owner_id?: string
          size?: number | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      equipment_photo_downloads: {
        Row: {
          created_at: string
          download_type: string | null
          id: string
          photo_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          download_type?: string | null
          id?: string
          photo_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          download_type?: string | null
          id?: string
          photo_id?: string
          user_id?: string
        }
        Relationships: []
      }
      equipment_photo_likes: {
        Row: {
          created_at: string
          id: string
          photo_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_id?: string
          user_id?: string
        }
        Relationships: []
      }
      equipment_photos: {
        Row: {
          created_at: string
          description: string | null
          downloads_count: number | null
          equipment_id: string
          file_size: number | null
          id: string
          image_url: string
          is_public: boolean | null
          likes_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          equipment_id: string
          file_size?: number | null
          id?: string
          image_url: string
          is_public?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          equipment_id?: string
          file_size?: number | null
          id?: string
          image_url?: string
          is_public?: boolean | null
          likes_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          data_favorito: string | null
          foto_id: string | null
          id: string
          tipo: string | null
          usuario_id: string | null
          video_id: string | null
        }
        Insert: {
          data_favorito?: string | null
          foto_id?: string | null
          id?: string
          tipo?: string | null
          usuario_id?: string | null
          video_id?: string | null
        }
        Update: {
          data_favorito?: string | null
          foto_id?: string | null
          id?: string
          tipo?: string | null
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
      fotos: {
        Row: {
          categoria: string | null
          created_at: string
          data_upload: string
          descricao_curta: string | null
          downloads_count: number | null
          favoritos_count: number | null
          id: string
          tags: string[] | null
          thumbnail_url: string | null
          titulo: string
          updated_at: string
          url_imagem: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_upload?: string
          descricao_curta?: string | null
          downloads_count?: number | null
          favoritos_count?: number | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          titulo: string
          updated_at?: string
          url_imagem: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_upload?: string
          descricao_curta?: string | null
          downloads_count?: number | null
          favoritos_count?: number | null
          id?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          titulo?: string
          updated_at?: string
          url_imagem?: string
          user_id?: string
        }
        Relationships: []
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
      instagram_accounts: {
        Row: {
          access_token: string
          connected_at: string
          id: string
          instagram_id: string
          page_id: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          id?: string
          instagram_id: string
          page_id: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          id?: string
          instagram_id?: string
          page_id?: string
          updated_at?: string
          user_id?: string
          username?: string
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
      multi_agent_sessions: {
        Row: {
          agents_involved: string[]
          completed_at: string | null
          coordination_pattern: string | null
          created_at: string | null
          current_phase: string | null
          id: string
          performance_score: number | null
          primary_objective: string
          results: Json | null
          session_context: Json | null
          session_name: string | null
          user_id: string
        }
        Insert: {
          agents_involved: string[]
          completed_at?: string | null
          coordination_pattern?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          performance_score?: number | null
          primary_objective: string
          results?: Json | null
          session_context?: Json | null
          session_name?: string | null
          user_id: string
        }
        Update: {
          agents_involved?: string[]
          completed_at?: string | null
          coordination_pattern?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          performance_score?: number | null
          primary_objective?: string
          results?: Json | null
          session_context?: Json | null
          session_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      perfis: {
        Row: {
          cidade: string | null
          clinica: string | null
          data_criacao: string | null
          email: string
          endereco_completo: string | null
          equipamentos: string[] | null
          especialidade: string | null
          estado: string | null
          foto_url: string | null
          id: string
          idioma: string | null
          lat: number | null
          lng: number | null
          nome: string | null
          observacoes_conteudo: string | null
          perfil_tipo: string | null
          role: string | null
          telefone: string | null
        }
        Insert: {
          cidade?: string | null
          clinica?: string | null
          data_criacao?: string | null
          email: string
          endereco_completo?: string | null
          equipamentos?: string[] | null
          especialidade?: string | null
          estado?: string | null
          foto_url?: string | null
          id: string
          idioma?: string | null
          lat?: number | null
          lng?: number | null
          nome?: string | null
          observacoes_conteudo?: string | null
          perfil_tipo?: string | null
          role?: string | null
          telefone?: string | null
        }
        Update: {
          cidade?: string | null
          clinica?: string | null
          data_criacao?: string | null
          email?: string
          endereco_completo?: string | null
          equipamentos?: string[] | null
          especialidade?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          idioma?: string | null
          lat?: number | null
          lng?: number | null
          nome?: string | null
          observacoes_conteudo?: string | null
          perfil_tipo?: string | null
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
      prompt_ab_tests: {
        Row: {
          agent_id: string | null
          completed_at: string | null
          confidence_level: number | null
          created_at: string | null
          id: string
          prompt_a: string
          prompt_b: string
          results: Json | null
          status: string | null
          success_metric: string
          test_name: string
          traffic_split: number | null
          winner: string | null
        }
        Insert: {
          agent_id?: string | null
          completed_at?: string | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          prompt_a: string
          prompt_b: string
          results?: Json | null
          status?: string | null
          success_metric: string
          test_name: string
          traffic_split?: number | null
          winner?: string | null
        }
        Update: {
          agent_id?: string | null
          completed_at?: string | null
          confidence_level?: number | null
          created_at?: string | null
          id?: string
          prompt_a?: string
          prompt_b?: string
          results?: Json | null
          status?: string | null
          success_metric?: string
          test_name?: string
          traffic_split?: number | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_ab_tests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
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
      script_performance: {
        Row: {
          approved_script_id: string
          created_at: string
          evaluated_at: string | null
          evaluated_by: string | null
          feedback_notes: string | null
          id: string
          metrics: Json | null
          performance_rating: string
        }
        Insert: {
          approved_script_id: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          feedback_notes?: string | null
          id?: string
          metrics?: Json | null
          performance_rating: string
        }
        Update: {
          approved_script_id?: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          feedback_notes?: string | null
          id?: string
          metrics?: Json | null
          performance_rating?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_performance_approved_script_id_fkey"
            columns: ["approved_script_id"]
            isOneToOne: false
            referencedRelation: "approved_scripts"
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
      self_improvement_log: {
        Row: {
          after_state: Json
          agent_id: string | null
          applied_at: string | null
          before_state: Json
          id: string
          improvement_reason: string | null
          improvement_type: string
          rollback_possible: boolean | null
          success_metrics: Json | null
          validated_at: string | null
          validation_result: Json | null
        }
        Insert: {
          after_state: Json
          agent_id?: string | null
          applied_at?: string | null
          before_state: Json
          id?: string
          improvement_reason?: string | null
          improvement_type: string
          rollback_possible?: boolean | null
          success_metrics?: Json | null
          validated_at?: string | null
          validation_result?: Json | null
        }
        Update: {
          after_state?: Json
          agent_id?: string | null
          applied_at?: string | null
          before_state?: Json
          id?: string
          improvement_reason?: string | null
          improvement_type?: string
          rollback_possible?: boolean | null
          success_metrics?: Json | null
          validated_at?: string | null
          validation_result?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "self_improvement_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
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
      system_services_status: {
        Row: {
          endpoint: string | null
          id: string
          last_checked_at: string
          latency_ms: number | null
          message: string | null
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          endpoint?: string | null
          id?: string
          last_checked_at?: string
          latency_ms?: number | null
          message?: string | null
          name: string
          slug: string
          status: string
          updated_at?: string
        }
        Update: {
          endpoint?: string | null
          id?: string
          last_checked_at?: string
          latency_ms?: number | null
          message?: string | null
          name?: string
          slug?: string
          status?: string
          updated_at?: string
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
      unified_documents: {
        Row: {
          autores: string[] | null
          created_at: string
          data_upload: string
          detalhes_erro: string | null
          equipamento_id: string | null
          file_path: string | null
          id: string
          palavras_chave: string[] | null
          raw_text: string | null
          status_processamento: string
          texto_completo: string | null
          thumbnail_url: string | null
          tipo_documento: string
          titulo_extraido: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          autores?: string[] | null
          created_at?: string
          data_upload?: string
          detalhes_erro?: string | null
          equipamento_id?: string | null
          file_path?: string | null
          id?: string
          palavras_chave?: string[] | null
          raw_text?: string | null
          status_processamento?: string
          texto_completo?: string | null
          thumbnail_url?: string | null
          tipo_documento: string
          titulo_extraido?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          autores?: string[] | null
          created_at?: string
          data_upload?: string
          detalhes_erro?: string | null
          equipamento_id?: string | null
          file_path?: string | null
          id?: string
          palavras_chave?: string[] | null
          raw_text?: string | null
          status_processamento?: string
          texto_completo?: string | null
          thumbnail_url?: string | null
          tipo_documento?: string
          titulo_extraido?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unified_documents_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string
          xp_awarded?: number | null
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
      user_gamification: {
        Row: {
          badges: string[] | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          xp_total: number
        }
        Insert: {
          badges?: string[] | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          xp_total?: number
        }
        Update: {
          badges?: string[] | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          xp_total?: number
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
      user_memory: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          importance_score: number | null
          key: string
          last_accessed: string | null
          memory_type: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          key: string
          last_accessed?: string | null
          memory_type: string
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          key?: string
          last_accessed?: string | null
          memory_type?: string
          user_id?: string
          value?: Json
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
      user_purchase_scores: {
        Row: {
          behavior_score: number | null
          created_at: string
          engagement_score: number | null
          final_score: number | null
          hot_lead_alert: boolean | null
          id: string
          interest_score: number | null
          last_equipment_interest: string | null
          probability_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          behavior_score?: number | null
          created_at?: string
          engagement_score?: number | null
          final_score?: number | null
          hot_lead_alert?: boolean | null
          id?: string
          interest_score?: number | null
          last_equipment_interest?: string | null
          probability_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          behavior_score?: number | null
          created_at?: string
          engagement_score?: number | null
          final_score?: number | null
          hot_lead_alert?: boolean | null
          id?: string
          interest_score?: number | null
          last_equipment_interest?: string | null
          probability_tier?: string | null
          updated_at?: string
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
      video_upload_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          progress: number | null
          status: string
          updated_at: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          progress?: number | null
          status?: string
          updated_at?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          progress?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: []
      }
      videomaker_avaliacoes: {
        Row: {
          avaliador_id: string
          comentario: string | null
          created_at: string
          id: string
          nota: number
          updated_at: string
          videomaker_id: string
        }
        Insert: {
          avaliador_id: string
          comentario?: string | null
          created_at?: string
          id?: string
          nota: number
          updated_at?: string
          videomaker_id: string
        }
        Update: {
          avaliador_id?: string
          comentario?: string | null
          created_at?: string
          id?: string
          nota?: number
          updated_at?: string
          videomaker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videomaker_avaliacoes_videomaker_id_fkey"
            columns: ["videomaker_id"]
            isOneToOne: false
            referencedRelation: "videomakers"
            referencedColumns: ["id"]
          },
        ]
      }
      videomakers: {
        Row: {
          ativo: boolean
          camera_celular: string
          cidade: string
          created_at: string
          emite_nota_fiscal: boolean
          foto_url: string | null
          id: string
          instagram: string | null
          media_avaliacao: number | null
          modelo_microfone: string | null
          nome_completo: string
          possui_iluminacao: boolean
          telefone: string
          tipo_profissional: Database["public"]["Enums"]["professional_type"]
          total_avaliacoes: number | null
          updated_at: string
          user_id: string
          valor_diaria: Database["public"]["Enums"]["investment_range"]
          video_referencia_url: string | null
        }
        Insert: {
          ativo?: boolean
          camera_celular: string
          cidade: string
          created_at?: string
          emite_nota_fiscal?: boolean
          foto_url?: string | null
          id?: string
          instagram?: string | null
          media_avaliacao?: number | null
          modelo_microfone?: string | null
          nome_completo: string
          possui_iluminacao?: boolean
          telefone: string
          tipo_profissional?: Database["public"]["Enums"]["professional_type"]
          total_avaliacoes?: number | null
          updated_at?: string
          user_id: string
          valor_diaria: Database["public"]["Enums"]["investment_range"]
          video_referencia_url?: string | null
        }
        Update: {
          ativo?: boolean
          camera_celular?: string
          cidade?: string
          created_at?: string
          emite_nota_fiscal?: boolean
          foto_url?: string | null
          id?: string
          instagram?: string | null
          media_avaliacao?: number | null
          modelo_microfone?: string | null
          nome_completo?: string
          possui_iluminacao?: boolean
          telefone?: string
          tipo_profissional?: Database["public"]["Enums"]["professional_type"]
          total_avaliacoes?: number | null
          updated_at?: string
          user_id?: string
          valor_diaria?: Database["public"]["Enums"]["investment_range"]
          video_referencia_url?: string | null
        }
        Relationships: []
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
          downloads_count: number | null
          duracao: string | null
          equipamentos: string[] | null
          favoritos_count: number | null
          finalidade: string[] | null
          id: string
          preview_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          tipo_video: string | null
          titulo: string | null
          url_video: string | null
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
          downloads_count?: number | null
          duracao?: string | null
          equipamentos?: string[] | null
          favoritos_count?: number | null
          finalidade?: string[] | null
          id?: string
          preview_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          tipo_video?: string | null
          titulo?: string | null
          url_video?: string | null
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
          downloads_count?: number | null
          duracao?: string | null
          equipamentos?: string[] | null
          favoritos_count?: number | null
          finalidade?: string[] | null
          id?: string
          preview_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          tipo_video?: string | null
          titulo?: string | null
          url_video?: string | null
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
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_final_purchase_score: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      cleanup_completed_uploads: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      coordinate_agents: {
        Args: {
          p_session_id: string
          p_task_type: string
          p_agent_ids: string[]
          p_strategy?: Json
        }
        Returns: string
      }
      create_unified_document: {
        Args: {
          p_title: string
          p_content: string
          p_conclusion: string
          p_keywords: string[]
          p_authors: string[]
          p_raw_text: string
          p_file_path: string
          p_user_id: string
          p_equipamento_id?: string
        }
        Returns: string
      }
      decrement_favorites_count: {
        Args: { video_id: string }
        Returns: undefined
      }
      delete_before_after_cascade: {
        Args: { photo_id_param: string }
        Returns: Json
      }
      delete_document_cascade: {
        Args: { document_id_param: string }
        Returns: Json
      }
      delete_download_storage_cascade: {
        Args: { download_id_param: string }
        Returns: Json
      }
      delete_material_cascade: {
        Args: { material_id_param: string }
        Returns: Json
      }
      delete_video_cascade: {
        Args: { video_id_param: string }
        Returns: Json
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
      register_ai_feedback: {
        Args: {
          p_user_id: string
          p_session_id: string
          p_ai_service: string
          p_prompt_used: string
          p_ai_response: string
          p_user_feedback: Json
          p_feedback_type?: string
          p_context_data?: Json
          p_response_time_ms?: number
          p_tokens_used?: number
        }
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
      store_user_memory: {
        Args: {
          p_user_id: string
          p_memory_type: string
          p_key: string
          p_value: Json
          p_importance?: number
          p_expires_hours?: number
        }
        Returns: string
      }
      update_ai_performance_metrics: {
        Args: {
          p_service_name: string
          p_success?: boolean
          p_response_time_ms?: number
          p_rating?: number
          p_tokens_used?: number
          p_estimated_cost?: number
        }
        Returns: undefined
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
      investment_range:
        | "300-500"
        | "500-800"
        | "800-1000"
        | "1000-1200"
        | "acima-1200"
      professional_type: "videomaker" | "storymaker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      investment_range: [
        "300-500",
        "500-800",
        "800-1000",
        "1000-1200",
        "acima-1200",
      ],
      professional_type: ["videomaker", "storymaker"],
    },
  },
} as const
