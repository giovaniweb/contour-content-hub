
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePerfilIdentificacao } from "@/hooks/usePerfilIdentificacao";

interface IdentificacaoDePerfilProps {
  onFinalizado: (dados: {
    perfilTipo: string,
    profissionalTipo?: string,
    especialidade?: string
  }) => void;
}

const ESPECIALIDADES = [
  "Dentista", "Fisioterapeuta", "Biomédico(a)", "Esteticista", "Outro"
];

export const IdentificacaoDePerfil: React.FC<IdentificacaoDePerfilProps> = ({ onFinalizado }) => {
  const perfil = usePerfilIdentificacao();
  const [especialidadeOutro, setEspecialidadeOutro] = React.useState("");

  if (perfil.etapa === "perfil") {
    return (
      <div className="space-y-4">
        <div className="text-xl font-semibold text-purple-100">Quem é você?</div>
        <Button className="w-full" variant="secondary" onClick={() => perfil.responderPerfil("cliente_final")}>
          Sou cliente final
        </Button>
        <Button className="w-full" variant="secondary" onClick={() => perfil.responderPerfil("profissional")}>
          Sou profissional de estética/saúde
        </Button>
      </div>
    );
  }
  if (perfil.etapa === "profissional_tipo") {
    return (
      <div className="space-y-4">
        <div className="text-xl font-semibold text-purple-100">Você é médico(a)?</div>
        <Button className="w-full" variant="secondary" onClick={() => perfil.responderProfissionalTipo("medico")}>
          Sim, sou médico(a)
        </Button>
        <Button className="w-full" variant="secondary" onClick={() => perfil.responderProfissionalTipo("nao_medico")}>
          Não, sou outro profissional
        </Button>
      </div>
    );
  }
  if (perfil.etapa === "especialidade") {
    return (
      <div className="space-y-4">
        <div className="text-xl font-semibold text-purple-100">Qual sua especialidade?</div>
        {ESPECIALIDADES.map(label => (
          <Button
            key={label}
            className="w-full"
            variant="secondary"
            onClick={() => {
              if (label === "Outro") return;
              perfil.responderEspecialidade(label);
              onFinalizado({perfilTipo: "profissional", profissionalTipo: perfil.profissionalTipo!, especialidade: label});
            }}
          >
            {label}
          </Button>
        ))}
        <Input
          placeholder="Outra especialidade"
          className="mt-2"
          value={especialidadeOutro}
          onChange={e => setEspecialidadeOutro(e.target.value)}
          onBlur={() => {
            if (especialidadeOutro.trim())
              perfil.responderEspecialidade(especialidadeOutro.trim());
              onFinalizado({perfilTipo: "profissional", profissionalTipo: perfil.profissionalTipo!, especialidade: especialidadeOutro.trim()});
          }}
        />
      </div>
    );
  }
  // Final: notifica o parent
  if (perfil.etapa === "final") {
    setTimeout(() => {
      onFinalizado({
        perfilTipo: perfil.perfilTipo!,
        profissionalTipo: perfil.profissionalTipo ?? undefined,
        especialidade: perfil.especialidade ?? undefined
      });
    }, 300);
    return <div className="text-purple-100">Analisando perfil...</div>;
  }
  return null;
};
