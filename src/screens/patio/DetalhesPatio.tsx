import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Patio } from "../../models/Patio";
import { Setor } from "../../models/Setor";

type RootStackParamList = {
  DetalhesPatio: { patio?: Patio };
  PatioMenu: undefined;
  HomeMenu: undefined;
  CadastroPatio: { patio?: Patio };
};

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesPatio">;

export default function DetalhesPatio({ route, navigation }: Props) {
  const [patioBusca, setPatioBusca] = useState("");
  const [patioDetalhes, setPatioDetalhes] = useState<Patio | null>(route.params?.patio || null);

  useEffect(() => {
    if (route.params?.patio) {
      setPatioDetalhes(route.params.patio);
      setPatioBusca(route.params.patio.nome);
    }
  }, [route.params?.patio]);

  const buscarPatioPorNome = async () => {
    if (!patioBusca.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do pátio para buscar.");
      return;
    }
    try {
      const dados = await AsyncStorage.getItem("patios");
      const patios: Patio[] = dados ? JSON.parse(dados) : [];
      const patioEncontrado = patios.find((p) =>
        p.nome.toLowerCase() === patioBusca.toLowerCase()
      );

      if (patioEncontrado) {
        setPatioDetalhes(patioEncontrado);
      } else {
        Alert.alert("Não Encontrado", "Nenhum pátio com este nome foi encontrado.");
        setPatioDetalhes(null);
      }
    } catch (error) {
      console.error("Erro ao buscar pátio:", error);
      Alert.alert("Erro", "Não foi possível buscar o pátio.");
    }
  };

  const handleEditarPatio = () => {
    if (patioDetalhes) {
      navigation.navigate("CadastroPatio", { patio: patioDetalhes });
    } else {
      Alert.alert("Atenção", "Selecione um pátio para editar.");
    }
  };

  const handleRemoverPatio = async () => {
    if (!patioDetalhes) {
      Alert.alert("Atenção", "Selecione um pátio para remover.");
      return;
    }

    try {
      const dadosSetores = await AsyncStorage.getItem("setores");
      const todosOsSetores: Setor[] = dadosSetores ? JSON.parse(dadosSetores) : [];
      const setoresAssociados = todosOsSetores.filter(
        (setor) => setor.patio && setor.patio.id === patioDetalhes.id
      );

      if (setoresAssociados.length > 0) {
        Alert.alert(
          "Impossível Remover",
          `Este pátio não pode ser removido porque possui ${setoresAssociados.length} setor(es) associado(s). Remova os setores primeiro.`
        );
        return;
      }
    } catch (error) {
      console.error("Erro ao verificar setores associados:", error);
      Alert.alert(
        "Aviso",
        "Não foi possível verificar setores associados. Prossiga com cautela."
      );
    }

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja remover o pátio "${patioDetalhes.nome}"? Esta ação é irreversível.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const dados = await AsyncStorage.getItem("patios");
              let patios: Patio[] = dados ? JSON.parse(dados) : [];
              const novosPatios = patios.filter((p) => p.id !== patioDetalhes.id);

              await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));
              Alert.alert("Sucesso", "Pátio removido com sucesso!");
              setPatioDetalhes(null);
              setPatioBusca("");
              navigation.navigate("PatioMenu");
            } catch (error) {
              console.error("Erro ao remover pátio:", error);
              Alert.alert("Erro", "Não foi possível remover o pátio.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes do Pátio</Text>

      <View style={styles.buscaContainer}>
        <TextInput
          placeholder="Digite o nome do pátio para buscar"
          onChangeText={setPatioBusca}
          value={patioBusca}
          style={styles.inputBusca}
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.botaoBusca}
          onPress={buscarPatioPorNome}
        >
          <Text style={styles.textoBotaoBusca}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {patioDetalhes ? (
        <View style={styles.detalhesCard}>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Nome:</Text> {patioDetalhes.nome}</Text>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Localização:</Text> {patioDetalhes.localizacao}</Text>

          <View style={styles.botoesAcaoDetalhes}>
            <TouchableOpacity
              style={styles.botaoAcao}
              onPress={handleEditarPatio}
            >
              <Text style={styles.textoBotaoAcao}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoAcao, styles.botaoRemover]}
              onPress={handleRemoverPatio}
            >
              <Text style={styles.textoBotaoAcao}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.aviso}>Use a busca acima para encontrar um pátio ou selecione de uma lista.</Text>
      )}

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate("PatioMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Pátios</Text>
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
  aviso: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
    width: '88%',
  },
  detalhesCard: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  detalhesTexto: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 8,
    lineHeight: 25,
  },
  botoesAcaoDetalhes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  botaoAcao: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: 5,
  },
  botaoRemover: {
    backgroundColor: "#dc3545",
  },
  textoBotaoAcao: {
    color: "#ffffff",
    fontSize: 17,
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