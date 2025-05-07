export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      videos_storage: {
        Row: {
          id: string
          title: string
          description: string | null
          owner_id: string
          status: string
          size: number
          duration: string | null
          created_at: string
          updated_at: string
          tags: string[] | null
          thumbnail_url: string | null
          file_urls: Json
          public: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          owner_id: string
          status?: string
          size: number
          duration?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          file_urls?: Json
          public?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          owner_id?: string
          status?: string
          size?: number
          duration?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          file_urls?: Json
          public?: boolean
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_storage_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      video_downloads: {
        Row: {
          id: string
          video_id: string
          user_id: string
          downloaded_at: string
          quality: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          downloaded_at?: string
          quality?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          downloaded_at?: string
          quality?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_downloads_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_downloads_video_id_fkey"
            columns: ["video_id"]
            referencedRelation: "videos_storage"
            referencedColumns: ["id"]
          }
        ]
      }
      roteiros: {
        Row: {
          conteudo: string | null
          createdAt: string | null
          id: string
          objetivo_marketing: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          usuario_id: string | null
        }
        Insert: {
          conteudo?: string | null
          createdAt?: string | null
          id?: string
          objetivo_marketing?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Update: {
          conteudo?: string | null
          createdAt?: string | null
          id?: string
          objetivo_marketing?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteiros_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      roteiro_validacoes: {
        Row: {
          data_validacao: string
          id: string
          pontuacao_clareza: number | null
          pontuacao_cta: number | null
          pontuacao_emocao: number | null
          pontuacao_gancho: number | null
          pontuacao_total: number | null
          roteiro_id: string | null
          sugestoes: string | null
        }
        Insert: {
          data_validacao?: string
          id?: string
          pontuacao_clareza?: number | null
          pontuacao_cta?: number | null
          pontuacao_emocao?: number | null
          pontuacao_gancho?: number | null
          pontuacao_total?: number | null
          roteiro_id?: string | null
          sugestoes?: string | null
        }
        Update: {
          data_validacao?: string
          id?: string
          pontuacao_clareza?: number | null
          pontuacao_cta?: number | null
          pontuacao_emocao?: number | null
          pontuacao_gancho?: number | null
          pontuacao_total?: number | null
          roteiro_id?: string | null
          sugestoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roteiro_validacoes_roteiro_id_fkey"
            columns: ["roteiro_id"]
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Buckets: {
      videos: {
        Row: {
          id: string
          name: string
          owner: string | null
          public: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
