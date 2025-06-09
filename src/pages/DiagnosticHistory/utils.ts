
export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('pt-BR'),
    time: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

export const generateDownloadContent = (session: any) => {
  return `
RELATÓRIO DE DIAGNÓSTICO - CONSULTOR FLUIDA
============================================

Data: ${new Date(session.timestamp).toLocaleString('pt-BR')}
Tipo: ${session.clinicTypeLabel}
Especialidade: ${session.specialty}

RESPOSTAS COLETADAS
-------------------
${Object.entries(session.state).filter(([key, value]) => value && key !== 'generatedDiagnostic').map(([key, value]) => `${key}: ${value}`).join('\n')}

${session.state.generatedDiagnostic ? `

DIAGNÓSTICO IA
--------------
${session.state.generatedDiagnostic}
` : ''}

---
Relatório gerado pelo Consultor Fluida
  `;
};
