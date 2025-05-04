
import { Database } from "@/integrations/supabase/types";

// Type aliases from generated Supabase types
export type ContentStrategyTable = Database["public"]["Tables"]["content_strategy_items"];
export type ContentStrategyRow = ContentStrategyTable["Row"];
export type ContentStrategyInsert = ContentStrategyTable["Insert"];
export type ContentStrategyUpdate = ContentStrategyTable["Update"];

// Type for joined content strategy item with related data
export interface ContentStrategyRowWithRelations extends ContentStrategyRow {
  equipamento?: { nome: string } | null;
  responsavel?: { nome: string } | null;
  distribuicao: string; // Adicionado o campo distribuicao que estava faltando
}

// Error response type
export interface ContentStrategyError {
  message: string;
  code?: string;
  details?: unknown;
}
