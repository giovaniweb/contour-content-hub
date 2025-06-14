
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceStatus {
  id: string;
  name: string;
  slug: string;
  endpoint?: string;
  status: string;
  last_checked_at: string;
  message?: string;
  latency_ms?: number | null;
  updated_at: string;
}

export function useSystemServicesStatus() {
  return useQuery<ServiceStatus[]>({
    queryKey: ["system-services-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_services_status")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as ServiceStatus[];
    },
    refetchOnWindowFocus: false,
  });
}
