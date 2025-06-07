
import { cadastrarMentorPorIndice } from './cadastrarMentores';

export const executarCadastroIndividual = async () => {
  try {
    // Cadastrar John Kotter (índice 7)
    const resultado = await cadastrarMentorPorIndice(7);
    console.log(resultado);
    return resultado;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
