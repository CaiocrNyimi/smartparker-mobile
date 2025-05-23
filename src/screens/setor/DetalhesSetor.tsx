import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Setor } from "../../models/Setor";

type RootStackParamList = {
  BuscaSetorPorPatio: undefined;
  DetalhesSetor: { setor: Setor };
  CadastroSetor: { setor?: Setor };
  SetorMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "BuscaSetorPorPatio">;

export default function BuscaSetorPorPatio({ navigation }: Props) {
  const [nomePatioBusca, setNomePatioBusca] = useState("");
  const [setoresEncontrados, setSetoresEncontrados] = useState<Setor[]>([]);
  const [mensagemStatus, setMensagemStatus] = useState("Digite o nome de um pátio para buscar setores.");

  const buscarSetoresPorPatio = async () => {
    if (!nomePatioBusca.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do pátio para buscar setores.");
      return;
    }

    try {
      const dadosSetores = await AsyncStorage.getItem("setores");
      const todosOsSetores: Setor[] = dadosSetores ? JSON.parse(dadosSetores) : [];

      const setoresFiltrados = todosOsSetores.filter(setor =>
        setor.patio && setor.patio.nome.toLowerCase() === nomePatioBusca.toLowerCase()
      );

      if (setoresFiltrados.length > 0) {
        setSetoresEncontrados(setoresFiltrados);
        setMensagemStatus(`Setores encontrados para "${nomePatioBusca}"`);
      } else {
        setSetoresEncontrados([]);
        setMensagemStatus(`Nenhum setor encontrado para o pátio "${nomePatioBusca}".`);
      }
    } catch (error) {
      console.error("Erro ao buscar setores por pátio:", error);
      Alert.alert("Erro", "Não foi possível buscar os setores.");
      setSetoresEncontrados([]);
      setMensagemStatus("Erro ao buscar setores.");
    }
  };

  const excluirSetor = async (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover este setor? Esta ação é irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const dados = await AsyncStorage.getItem("setores");
              const setores = dados ? JSON.parse(dados) : [];
              const novosSetores = setores.filter((setor: Setor) => setor.id !== id);

              await AsyncStorage.setItem("setores", JSON.stringify(novosSetores));
              setSetoresEncontrados(prevSetores => prevSetores.filter(setor => setor.id !== id));
              Alert.alert("Sucesso", "Setor removido com sucesso!");
              if (novosSetores.filter((setor: { patio: { nome: string; }; }) => setor.patio && setor.patio.nome.toLowerCase() === nomePatioBusca.toLowerCase()).length === 0) {
                setMensagemStatus(`Nenhum setor encontrado para o pátio "${nomePatioBusca}".`);
              }
            } catch (error) {
              console.error("Erro ao excluir setor:", error);
              Alert.alert("Erro", "Não foi possível remover o setor.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Setor }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Setor:</Text> {item.nome}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Fileira:</Text> {item.fileira}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Vaga:</Text> {item.vaga}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Pátio:</Text> {item.patio?.nome || 'N/A'}</Text>
      </View>
      <View style={styles.itemBotoesContainer}>
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => navigation.navigate("CadastroSetor", { setor: item })}
        >
          <Text style={styles.textoBotaoAcao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoRemover]}
          onPress={() => excluirSetor(item.id)}
        >
          <Text style={styles.textoBotaoAcao}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscar Setor por Pátio</Text>

      <View style={styles.buscaContainer}>
        <TextInput
          placeholder="Nome do Pátio"
          onChangeText={setNomePatioBusca}
          value={nomePatioBusca}
          style={styles.inputBusca}
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.botaoBusca}
          onPress={buscarSetoresPorPatio}
        >
          <Text style={styles.textoBotaoBusca}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.mensagemStatus}>{mensagemStatus}</Text>

      {setoresEncontrados.length > 0 && (
        <FlatList
          data={setoresEncontrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listaConteudo}
          style={styles.flatListStyle}
        />
      )}

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate("SetorMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Setores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltarPrincipal}
          onPress={() => navigation.navigate("HomeMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Ir para Menu Principal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 70,
    backgroundColor: "#fcfbf7",
    alignItems: 'center',
  },
  titulo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '88%',
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputBusca: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 17,
    color: "#333333",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  botaoBusca: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
  },
  textoBotaoBusca: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  mensagemStatus: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
    width: '88%',
  },
  flatListStyle: {
    width: '100%',
  },
  listaConteudo: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: 'column',
  },
  infoContainer: {
    marginBottom: 10,
  },
  itemTexto: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
    lineHeight: 22,
  },
  itemBotoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  botaoAcao: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: 4,
  },
  botaoRemover: {
    backgroundColor: "#dc3545",
  },
  textoBotaoAcao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  botoesNavegacaoContainer: {
    marginTop: 20,
    paddingBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  botaoVoltar: {
    backgroundColor: "#95a5a6",
    paddingVertical: 15,
    width: "88%",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  botaoVoltarPrincipal: {
    backgroundColor: "#42b883",
    paddingVertical: 15,
    width: "88%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  textoBotaoVoltar: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});