
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BuscarClinicasParams {
  equipamentoOuEspecialidade?: string;
  cidade?: string;
  lat?: number;
  lng?: number;
  raioKm?: number;
}

export function useBuscarClinicas() {
  const [clinicas, setClinicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function buscar(params: BuscarClinicasParams) {
    setLoading(true);
    setErro(null);
    setClinicas([]);
    try {
      let query = supabase.from("perfis").select("*").eq("perfil_tipo", "profissional");
      if (params.equipamentoOuEspecialidade) {
        query = query.ilike("especialidade", `%${params.equipamentoOuEspecialidade}%`);
      }
      if (params.cidade) query = query.ilike("cidade", `%${params.cidade}%`);
      // Geolocalização: busca básica, expanda conforme demanda
      if (params.lat && params.lng && params.raioKm) {
        // Busca aproximada de latitude/longitude
        const delta = params.raioKm / 111; // ~111 km por grau
        query = query.gte("lat", params.lat - delta).lte("lat", params.lat + delta)
                     .gte("lng", params.lng - delta).lte("lng", params.lng + delta);
      }
      const { data, error } = await query.limit(10);
      if (error) throw error;
      setClinicas(data || []);
    } catch (e:any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { clinicas, loading, erro, buscar };
}
