import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LocalizacaoMoto } from "../../models/LocalizacaoMoto";

type RootStackParamList = {
  ListaLocalizacao: undefined;
  LocalizacaoMotoMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "ListaLocalizacao">;

export default function ListaLocalizacao({ navigation }: Props) {
  const [localizacoes, setLocalizacoes] = useState<LocalizacaoMoto[]>([]);

  useEffect(() => {
    carregarLocalizacoes();
    const unsubscribe = navigation.addListener('focus', () => {
      carregarLocalizacoes();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarLocalizacoes = async () => {
    try {
      const dados = await AsyncStorage.getItem("localizacoes");
      setLocalizacoes(dados ? JSON.parse(dados) : []);
    } catch (error) {
      console.error("Erro ao carregar localizações:", error);
      Alert.alert("Erro", "Não foi possível carregar as localizações salvas.");
    }
  };

  const excluirLocalizacao = async (id: number, motoNome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja remover a localização da moto "${motoNome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const novasLocalizacoes = localizacoes.filter((loc) => loc.id !== id);
              await AsyncStorage.setItem("localizacoes", JSON.stringify(novasLocalizacoes));
              setLocalizacoes(novasLocalizacoes);
              Alert.alert("Sucesso", "Localização removida com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir localização:", error);
              Alert.alert("Erro", "Não foi possível remover a localização.");
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
      <Text style={styles.titulo}>Localizações Registradas</Text>

      {localizacoes.length === 0 ? (
        <Text style={styles.aviso}>Nenhuma localização registrada ainda.</Text>
      ) : (
        <FlatList
          data={localizacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemTextoContainer}>
                <Text style={styles.itemTextoPrincipal}>
                  <Text style={{ fontWeight: 'bold' }}>Moto:</Text> {item.moto.nome} ({item.moto.placa})
                </Text>
                <Text style={styles.itemTextoSecundario}>
                  <Text style={{ fontWeight: 'bold' }}>Setor:</Text> {item.setor.nome} (Fileira: {item.setor.fileira}, Vaga: {item.setor.vaga})
                </Text>
                <Text style={styles.itemTextoData}>
                  <Text style={{ fontWeight: 'bold' }}>Atualizado em:</Text> {new Date(item.dataAtualizada).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirLocalizacao(item.id, item.moto.nome)}
              >
                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.listaLocalizacoes}
          contentContainerStyle={styles.listaConteudo}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listaLocalizacoes: {
    width: '100%',
    flex: 1,
    marginBottom: 20,
  },
  listaConteudo: {
    paddingBottom: 10,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
    width: '95%',
    alignSelf: 'center',
  },
  itemTextoContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemTextoPrincipal: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 5,
    lineHeight: 25,
  },
  itemTextoSecundario: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 5,
    lineHeight: 22,
  },
  itemTextoData: {
    fontSize: 14,
    color: "#777777",
    fontStyle: 'italic',
  },
  botaoExcluir: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  textoBotaoExcluir: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  aviso: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 30,
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