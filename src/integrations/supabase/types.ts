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
      agenda: {
        Row: {
          data: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
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
          id?: string
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
          id?: string
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
      materiais: {
        Row: {
          arquivo_url: string | null
          data_upload: string | null
          id: string
          nome: string | null
          preview_url: string | null
          tipo: string | null
        }
        Insert: {
          arquivo_url?: string | null
          data_upload?: string | null
          id?: string
          nome?: string | null
          preview_url?: string | null
          tipo?: string | null
        }
        Update: {
          arquivo_url?: string | null
          data_upload?: string | null
          id?: string
          nome?: string | null
          preview_url?: string | null
          tipo?: string | null
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
          role?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      roteiros: {
        Row: {
          conteudo: string | null
          data_criacao: string | null
          id: string
          observacoes: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          usuario_id: string | null
        }
        Insert: {
          conteudo?: string | null
          data_criacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Update: {
          conteudo?: string | null
          data_criacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteiros_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          area_corpo: string | null
          data_upload: string | null
          descricao: string | null
          duracao: string | null
          equipamento: string | null
          finalidade: string | null
          id: string
          preview_url: string | null
          tipo: string | null
          titulo: string | null
          url_video: string | null
        }
        Insert: {
          area_corpo?: string | null
          data_upload?: string | null
          descricao?: string | null
          duracao?: string | null
          equipamento?: string | null
          finalidade?: string | null
          id?: string
          preview_url?: string | null
          tipo?: string | null
          titulo?: string | null
          url_video?: string | null
        }
        Update: {
          area_corpo?: string | null
          data_upload?: string | null
          descricao?: string | null
          duracao?: string | null
          equipamento?: string | null
          finalidade?: string | null
          id?: string
          preview_url?: string | null
          tipo?: string | null
          titulo?: string | null
          url_video?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
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
