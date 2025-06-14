
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuscarClinicas } from "@/hooks/useBuscarClinicas";

interface SugestaoClinicasProximasProps {
  equipamentoNome: string;
}

export const SugestaoClinicasProximas: React.FC<SugestaoClinicasProximasProps> = ({ equipamentoNome }) => {
  const [cidade, setCidade] = useState("");
  const [buscou, setBuscou] = useState(false);
  const clinicasHook = useBuscarClinicas();

  function handleBuscar() {
    clinicasHook.buscar({ equipamentoOuEspecialidade: equipamentoNome, cidade });
    setBuscou(true);
  }

  return (
    <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-6 max-w-2xl mx-auto text-purple-900">
      <div className="font-semibold text-lg mb-3">Quer ver clínicas que atendem esse caso perto de você?</div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Digite sua cidade"
          value={cidade}
          onChange={e => setCidade(e.target.value)}
          className="w-60"
        />
        <Button disabled={!cidade || clinicasHook.loading} onClick={handleBuscar}>Buscar</Button>
      </div>
      {clinicasHook.loading && <div className="mt-3 text-purple-700 animate-pulse">Buscando clínicas...</div>}
      {clinicasHook.erro && <div className="mt-3 text-red-500">{clinicasHook.erro}</div>}
      {clinicasHook.clinicas.length > 0 && (
        <div className="mt-4">
          <div className="font-medium">Encontramos profissionais:</div>
          <ul className="mt-2">
            {clinicasHook.clinicas.map(clinica => (
              <li key={clinica.id} className="border-b border-purple-100 py-2">
                <span className="font-semibold">{clinica.nome || "Profissional"} </span>
                {clinica.especialidade && <span>· {clinica.especialidade}</span>}
                {clinica.cidade && <span> · {clinica.cidade}</span>}
                {clinica.clinica && <span> · {clinica.clinica}</span>}
                {clinica.telefone && <span> · <a href={`tel:${clinica.telefone}`}>{clinica.telefone}</a></span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {buscou && !clinicasHook.loading && clinicasHook.clinicas.length === 0 &&
        <div className="mt-3 text-purple-800">Não encontramos clínicas com este equipamento nesta cidade.</div>
      }
    </div>
  );
};
