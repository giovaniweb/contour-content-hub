
import { cadastrarMentorPorIndice } from './cadastrarMentores';

export const executarCadastroIndividual = async () => {
  try {
    // Cadastrar Paulo Cuenca (índice 2)
    const resultado = await cadastrarMentorPorIndice(2);
    console.log(resultado);
    return resultado;
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
