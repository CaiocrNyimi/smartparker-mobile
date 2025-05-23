import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LocalizacaoMoto } from "../../models/LocalizacaoMoto";
import { Moto } from "../../models/Moto";
import { Setor } from "../../models/Setor";

type RootStackParamList = {
  CadastroLocalizacao: undefined;
  HomeMenu: undefined;
  LocalizacaoMotoMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CadastroLocalizacao">;

export default function CadastroLocalizacao({ navigation }: Props) {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null);
  const [setorSelecionado, setSetorSelecionado] = useState<Setor | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dadosMotos = await AsyncStorage.getItem("motos");
      const dadosSetores = await AsyncStorage.getItem("setores");

      setMotos(dadosMotos ? JSON.parse(dadosMotos) : []);
      setSetores(dadosSetores ? JSON.parse(dadosSetores) : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados de motos ou setores.");
    }
  };

  const salvarLocalizacao = async () => {
    if (!motoSelecionada || !setorSelecionado) {
      Alert.alert("Erro", "Você deve selecionar uma moto e um setor para registrar a localização.");
      return;
    }

    try {
      const novaLocalizacao: LocalizacaoMoto = {
        id: new Date().getTime(),
        dataAtualizada: new Date().toISOString(),
        moto: motoSelecionada,
        setor: setorSelecionado,
      };

      const dados = await AsyncStorage.getItem("localizacoes");
      const localizacoes: LocalizacaoMoto[] = dados ? JSON.parse(dados) : [];

      const novasLocalizacoes = [...localizacoes, novaLocalizacao];
      await AsyncStorage.setItem("localizacoes", JSON.stringify(novasLocalizacoes));

      Alert.alert("Sucesso", `Localização da moto '${motoSelecionada.nome}' registrada no setor '${setorSelecionado.nome}'!`);
      setMotoSelecionada(null);
      setSetorSelecionado(null);
    } catch (error) {
      console.error("Erro ao salvar localização:", error);
      Alert.alert("Erro", "Não foi possível salvar a localização da moto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Localização da Moto</Text>

      <Text style={styles.subTitulo}>Selecione uma Moto:</Text>
      {motos.length === 0 ? (
        <Text style={styles.aviso}>Nenhuma moto cadastrada. Cadastre motos primeiro.</Text>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemSelecao,
                motoSelecionada?.id === item.id && styles.itemSelecionado,
              ]}
              onPress={() => setMotoSelecionada(item)}
            >
              <Text style={styles.textoItem}>{item.nome} ({item.placa})</Text>
            </TouchableOpacity>
          )}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
        />
      )}

      <Text style={styles.subTitulo}>Selecione um Setor:</Text>
      {setores.length === 0 ? (
        <Text style={styles.aviso}>Nenhum setor cadastrado. Cadastre setores primeiro.</Text>
      ) : (
        <FlatList
          data={setores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemSelecao,
                setorSelecionado?.id === item.id && styles.itemSelecionado,
              ]}
              onPress={() => setSetorSelecionado(item)}
            >
              <Text style={styles.textoItem}>Setor: {item.nome} | Fileira: {item.fileira} | Vaga: {item.vaga}</Text>
            </TouchableOpacity>
          )}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
        />
      )}

      {motoSelecionada && setorSelecionado && (
        <View style={styles.selecaoAtualContainer}>
          <Text style={styles.selecaoAtualTexto}>
            <Text style={{ fontWeight: 'bold' }}>{motoSelecionada.nome}</Text> será registrada no setor <Text style={{ fontWeight: 'bold' }}>{setorSelecionado.nome}</Text>.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarLocalizacao}
      >
        <Text style={styles.textoBotaoSalvar}>Salvar Localização</Text>
      </TouchableOpacity>

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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555555",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '88%',
  },
  lista: {
    width: '88%',
    maxHeight: 180,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listaConteudo: {
    paddingVertical: 5,
  },
  itemSelecao: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  itemSelecionado: {
    backgroundColor: "#e6f0ff",
    borderColor: "#6e8cd6",
    borderLeftWidth: 4,
  },
  textoItem: {
    fontSize: 16,
    color: "#333333",
  },
  selecaoAtualContainer: {
    backgroundColor: "#e6ffe6",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginTop: 20,
    marginBottom: 30,
    width: '88%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selecaoAtualTexto: {
    fontSize: 17,
    color: "#333333",
    textAlign: 'center',
    lineHeight: 25,
  },
  botaoSalvar: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 18,
    width: "88%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 8,
  },
  textoBotaoSalvar: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },
  aviso: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    fontStyle: "italic",
    width: '88%',
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