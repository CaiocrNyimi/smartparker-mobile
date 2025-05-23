import AsyncStorage from "@react-native-async-storage/async-storage";

export const salvarItem = async (chave: string, item: any) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    const lista = dados ? JSON.parse(dados) : [];
    lista.push(item);
    await AsyncStorage.setItem(chave, JSON.stringify(lista));
  } catch (error) {
    console.error(`Erro ao salvar ${chave}:`, error);
  }
};

export const carregarLista = async (chave: string) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error(`Erro ao carregar ${chave}:`, error);
    return [];
  }
};

export const excluirItem = async (chave: string, id: number) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    const lista = dados ? JSON.parse(dados) : [];
    const novaLista = lista.filter((item: any) => item.id !== id);
    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
  } catch (error) {
    console.error(`Erro ao excluir ${chave}:`, error);
  }
};
