
import { cadastrarMentorPorIndice } from './cadastrarMentores';

export const executarCadastroIndividual = async () => {
  try {
    // Cadastrar Leandro Ladeira (índice 0)
    const resultado = await cadastrarMentorPorIndice(0);
    console.log(resultado);
    return resultado;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
