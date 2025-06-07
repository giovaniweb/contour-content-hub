
import { cadastrarMentorPorIndice } from './cadastrarMentores';

export const executarCadastroIndividual = async () => {
  try {
    // Cadastrar Camila Porto (índice 4)
    const resultado = await cadastrarMentorPorIndice(4);
    console.log(resultado);
    return resultado;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
