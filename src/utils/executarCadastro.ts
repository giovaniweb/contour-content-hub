
import { cadastrarMentorPorIndice } from './cadastrarMentores';

export const executarCadastroIndividual = async () => {
  try {
    // Cadastrar Ícaro de Carvalho (índice 1)
    const resultado = await cadastrarMentorPorIndice(1);
    console.log(resultado);
    return resultado;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
