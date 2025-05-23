import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Moto } from "../../models/Moto";

type RootStackParamList = {
  Lista: undefined;
  Detalhes: { moto: Moto };
  Cadastro: { moto?: Moto };
  MotoMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export default function Lista({ navigation }: Props) {
  const [motos, setMotos] = useState<Moto[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarMotos();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarMotos = async () => {
    try {
      const dados = await AsyncStorage.getItem("motos");
      setMotos(dados ? JSON.parse(dados) : []);
    } catch (error) {
      console.error("Erro ao carregar motos:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de motos.");
    }
  };

  const excluirMoto = async (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover esta moto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const dados = await AsyncStorage.getItem("motos");
              const motos = dados ? JSON.parse(dados) : [];
              const novasMotos = motos.filter((moto: Moto) => moto.id !== id);

              await AsyncStorage.setItem("motos", JSON.stringify(novasMotos));
              setMotos(novasMotos);
              Alert.alert("Sucesso", "Moto removida com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir moto:", error);
              Alert.alert("Erro", "Não foi possível remover a moto.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Moto }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Nome:</Text> {item.nome} ({item.fabricante})</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Placa:</Text> {item.placa}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Cilindrada:</Text> {item.cilindrada} cc</Text>
        <Text style={styles.itemTexto}>
          <Text style={{ fontWeight: 'bold' }}>Status:</Text> <Text style={{ fontWeight: 'bold', color: getStatusColor(item.status) }}>{item.status}</Text>
        </Text>
        <Text style={styles.itemTexto}>
          <Text style={{ fontWeight: 'bold' }}>QR Code:</Text> {item.qrCode ? item.qrCode : 'não registrado'}
        </Text>
      </View>
      <View style={styles.itemBotoesContainer}>
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => navigation.navigate("Cadastro", { moto: item })}
        >
          <Text style={styles.textoBotaoAcao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoRemover]}
          onPress={() => excluirMoto(item.id)}
        >
          <Text style={styles.textoBotaoAcao}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status: "Disponível" | "Em uso" | "Reparo") => {
    switch (status) {
      case "Disponível": return "#28a745";
      case "Em uso": return "#007bff";
      case "Reparo": return "#dc3545";
      default: return "#6c757d";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Motos</Text>
      {motos.length === 0 ? (
        <Text style={styles.aviso}>Nenhuma moto cadastrada.</Text>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listaConteudo}
        />
      )}

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate("MotoMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Motos</Text>
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
  aviso: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  listaConteudo: {
    paddingBottom: 20,
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
    marginTop: 10,
  },
  botaoAcao: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
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