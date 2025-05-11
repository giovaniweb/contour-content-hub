
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";
import { WorkspaceUser } from "@/lib/supabase/schema-types";

// Get mock data for workspaces instead of trying to fetch from non-existent table
export async function fetchWorkspaces() {
  // Mocking the response instead of querying a non-existent table
  return [{ 
    id: 'ws_default', 
    nome: 'Default Workspace', 
    plano: 'free', 
    criado_em: new Date().toISOString() 
  }];
}

export async function fetchWorkspaceUsers(workspaceId: string): Promise<WorkspaceUser[]> {
  if (!workspaceId) return [];
  
  const { data, error } = await supabase
    .from('perfis')
    .select('id, nome, email, role');
  
  if (error) throw error;
  
  // Since we don't have workspace_id in perfis, we'll mock data
  // Add a placeholder for last_sign_in_at since it doesn't exist in the database
  const enhancedData = (data || []).map(user => ({
    ...user,
    last_sign_in_at: null // Add a placeholder value
  }));
  
  return enhancedData as WorkspaceUser[];
}
