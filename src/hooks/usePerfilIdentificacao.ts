
import { useState } from "react";

type PerfilTipo = "cliente_final" | "profissional" | null;
type ProfissionalTipo = "medico" | "nao_medico" | null;

export function usePerfilIdentificacao() {
  const [etapa, setEtapa] = useState<"perfil"|"profissional_tipo"|"especialidade"|"final">("perfil");
  const [perfilTipo, setPerfilTipo] = useState<PerfilTipo>(null);
  const [profissionalTipo, setProfissionalTipo] = useState<ProfissionalTipo>(null);
  const [especialidade, setEspecialidade] = useState<string>("");

  function responderPerfil(tipo: PerfilTipo) {
    setPerfilTipo(tipo);
    if (tipo === "profissional") setEtapa("profissional_tipo");
    else setEtapa("final");
  }

  function responderProfissionalTipo(tipo: ProfissionalTipo) {
    setProfissionalTipo(tipo);
    setEtapa("especialidade");
  }

  function responderEspecialidade(especialidadeStr: string) {
    setEspecialidade(especialidadeStr);
    setEtapa("final");
  }

  function reset() {
    setEtapa("perfil");
    setPerfilTipo(null);
    setProfissionalTipo(null);
    setEspecialidade("");
  }

  return {
    etapa,
    perfilTipo,
    profissionalTipo,
    especialidade,
    responderPerfil,
    responderProfissionalTipo,
    responderEspecialidade,
    reset,
  };
}
