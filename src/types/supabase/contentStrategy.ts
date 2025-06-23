
import { Database } from "@/integrations/supabase/types";

// Type aliases from generated Supabase types
export type ContentStrategyTable = Database["public"]["Tables"]["content_strategy_items"];
export type ContentStrategyRow = ContentStrategyTable["Row"] & {
  distribuicao?: string; // Making this optional to match current database state
};
export type ContentStrategyInsert = ContentStrategyTable["Insert"] & {
  distribuicao?: string;
};
export type ContentStrategyUpdate = ContentStrategyTable["Update"] & {
  distribuicao?: string;
};

// Type for joined content strategy item with related data
export interface ContentStrategyRowWithRelations extends ContentStrategyRow {
  distribuicao: string; // Make this required for the interface
  equipamento?: { nome: string } | null;
  responsavel?: { nome: string } | null;
}

// Error response type
export interface ContentStrategyError {
  message: string;
  code?: string;
  details?: unknown;
}
