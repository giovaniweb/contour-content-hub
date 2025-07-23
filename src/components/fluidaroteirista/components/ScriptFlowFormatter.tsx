import React from 'react';
import ImprovedScriptFormatter from './ImprovedScriptFormatter';

interface ScriptFlowFormatterProps {
  script: {
    roteiro: string;
    formato: string;
    emocao_central: string;
    intencao: string;
    objetivo: string;
    mentor: string;
  };
}

const ScriptFlowFormatter: React.FC<ScriptFlowFormatterProps> = ({ script }) => {
  // Agora usa o componente melhorado
  return <ImprovedScriptFormatter script={script} />;
};

export default ScriptFlowFormatter;