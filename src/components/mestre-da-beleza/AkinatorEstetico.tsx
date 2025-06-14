
import React from "react";
import { useAkinatorEstetico } from "@/hooks/useAkinatorEstetico";
import { useEquipments } from "@/hooks/useEquipments";
import { Sparkles, UserCircle2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const avatarUrl = "https://api.dicebear.com/7.x/fun-emoji/svg?seed=wizard"; // Troque por um avatar mais mágico se quiser

export const AkinatorEstetico: React.FC = () => {
  const { equipments } = useEquipments();
  const akinator = useAkinatorEstetico(equipments);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/15 rounded-2xl shadow-2xl border border-yellow-400/40 px-7 py-8 flex flex-col items-center animate-fade-in">
        {/* Personagem "Mestre da Beleza" */}
        <div className="flex flex-col items-center mb-8">
          <img src={avatarUrl} alt="Mestre da Beleza" className="w-24 h-24 rounded-full border-4 border-yellow-200 shadow-lg mb-3" />
          <div className="text-2xl font-bold text-yellow-300">Mestre da Beleza</div>
          <div className="text-purple-100/90 text-center mt-1">Responda e eu vou descobrir seu melhor caminho estético! ✨</div>
        </div>

        {!akinator.finalizou && akinator.perguntaAtual && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-yellow-400" />
              <span className="text-base text-purple-100 font-medium drop-shadow">{`Pergunta ${akinator.idxPergunta + 1}`}</span>
            </div>
            <div className="text-xl text-purple-50 font-semibold text-center mb-3">{akinator.perguntaAtual.texto}</div>
            <div className="flex flex-col gap-2 w-full">
              {akinator.perguntaAtual.opcoes.map(opc => (
                <Button
                  key={opc}
                  className="w-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white font-semibold shadow-md hover:scale-105 hover:bg-yellow-500 transition"
                  onClick={() => akinator.responder(opc)}
                >
                  {opc}
                </Button>
              ))}
            </div>
            <div className="mt-8 flex gap-2">
              <Button variant="outline" className="text-xs" onClick={akinator.reset}>
                Reiniciar
              </Button>
            </div>
          </div>
        )}

        {akinator.finalizou && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <Trophy className="w-10 h-10 text-yellow-300 mb-2 animate-bounce" />
            <div className="text-2xl font-bold text-yellow-200 mb-2">Descobri!</div>
            <div className="bg-yellow-100/90 text-purple-900 rounded-lg px-4 py-3 mb-5 text-center shadow-lg max-w-xs">
              {akinator.ranking[0] ? (
                <>
                  <div className="font-bold text-xl mb-2">{akinator.ranking[0].nome}</div>
                  <div className="text-xs text-gray-700 mb-1">{akinator.ranking[0].tecnologia}</div>
                  <div className="text-sm mb-2">{akinator.ranking[0].descricao?.slice(0,70) || ""}...</div>
                  {akinator.ranking[0].image_url && (
                    <img
                      src={akinator.ranking[0].image_url}
                      alt={akinator.ranking[0].nome}
                      className="w-full h-24 object-cover rounded border"
                    />
                  )}
                  <div className="text-sm mt-3">Score: <span className="font-semibold">{akinator.ranking[0]._score}</span></div>
                </>
              ) : (
                <div className="text-purple-800">Não consegui identificar um equipamento ideal 😢</div>
              )}
            </div>
            <Button variant="outline" onClick={akinator.reset}>Testar novamente</Button>
          </div>
        )}

        {/* Diagnóstico das perguntas/respostas para debug */}
        <div className="mt-8 w-full bg-white/10 rounded p-3 text-xs text-purple-200">
          <div className="font-bold text-yellow-200 mb-1">Respostas:</div>
          {Object.entries(akinator.respostas).map(([k,v]) => (
            <div key={k}><span className="font-semibold">{k}: </span>{v}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AkinatorEstetico;
