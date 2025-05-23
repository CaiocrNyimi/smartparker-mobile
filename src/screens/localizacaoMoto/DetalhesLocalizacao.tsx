import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LocalizacaoMoto } from "../../models/LocalizacaoMoto";

type RootStackParamList = {
  DetalhesLocalizacao: { localizacao?: LocalizacaoMoto };
  LocalizacaoMotoMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesLocalizacao">;

export default function DetalhesLocalizacao({ route, navigation }: Props) {
  const [placaBusca, setPlacaBusca] = useState("");
  const [localizacaoDetalhes, setLocalizacaoDetalhes] = useState<LocalizacaoMoto | null>(route.params?.localizacao || null);

  useEffect(() => {
    if (route.params?.localizacao) {
      setLocalizacaoDetalhes(route.params.localizacao);
      setPlacaBusca(route.params.localizacao.moto.placa);
    }
  }, [route.params?.localizacao]);

  const buscarLocalizacaoPorPlaca = async () => {
    if (!placaBusca.trim()) {
      Alert.alert("Atenção", "Por favor, digite a placa da moto para buscar a localização.");
      return;
    }
    try {
      const dadosLocalizacoes = await AsyncStorage.getItem("localizacoes");
      const todasAsLocalizacoes: LocalizacaoMoto[] = dadosLocalizacoes ? JSON.parse(dadosLocalizacoes) : [];

      const localizacaoEncontrada = todasAsLocalizacoes.find(loc =>
        loc.moto && loc.moto.placa.toLowerCase() === placaBusca.toLowerCase()
      );

      if (localizacaoEncontrada) {
        setLocalizacaoDetalhes(localizacaoEncontrada);
      } else {
        Alert.alert("Não Encontrado", "Nenhuma localização encontrada para esta placa.");
        setLocalizacaoDetalhes(null);
      }
    } catch (error) {
      console.error("Erro ao buscar localização por placa:", error);
      Alert.alert("Erro", "Não foi possível buscar a localização.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes da Localização</Text>

      <View style={styles.buscaContainer}>
        <TextInput
          placeholder="Digite a placa da moto para buscar"
          onChangeText={setPlacaBusca}
          value={placaBusca}
          style={styles.inputBusca}
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={styles.botaoBusca}
          onPress={buscarLocalizacaoPorPlaca}
        >
          <Text style={styles.textoBotaoBusca}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {localizacaoDetalhes ? (
        <View style={styles.cardDetalhes}>
          <Text style={styles.textoPrincipal}>
            Moto: <Text style={styles.valorDestaque}>{localizacaoDetalhes.moto.nome} ({localizacaoDetalhes.moto.placa})</Text>
          </Text>
          <Text style={styles.textoPrincipal}>
            Setor: <Text style={styles.valorDestaque}>{localizacaoDetalhes.setor.nome}</Text>
          </Text>
          <Text style={styles.textoSecundario}>
            Fileira: <Text style={styles.valorDetalhe}>{localizacaoDetalhes.setor.fileira}</Text> | Vaga: <Text style={styles.valorDetalhe}>{localizacaoDetalhes.setor.vaga}</Text>
          </Text>
          <Text style={styles.textoData}>
            Última atualização: <Text style={styles.valorDetalhe}>{new Date(localizacaoDetalhes.dataAtualizada).toLocaleString()}</Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.aviso}>Use a busca acima para encontrar uma localização ou selecione de uma lista.</Text>
      )}

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity
          style={styles.botaoVoltarLocalizacao}
          onPress={() => navigation.navigate("LocalizacaoMotoMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate("HomeMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu Principal</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
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
  cardDetalhes: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 40,
  },
  textoPrincipal: {
    fontSize: 20,
    color: "#333333",
    marginBottom: 10,
    lineHeight: 28,
  },
  valorDestaque: {
    fontWeight: "bold",
    color: "#6e8cd6",
  },
  textoSecundario: {
    fontSize: 17,
    color: "#555555",
    marginBottom: 10,
    lineHeight: 24,
  },
  valorDetalhe: {
    fontWeight: "bold",
    color: "#777777",
  },
  textoData: {
    fontSize: 15,
    color: "#777777",
    fontStyle: 'italic',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  botoesNavegacaoContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
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
  botaoVoltarLocalizacao: {
    backgroundColor: "#42b883",
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
  textoBotaoVoltar: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});