import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Moto } from "../../models/Moto";

type RootStackParamList = {
  Detalhes: { moto?: Moto };
  Cadastro: { moto?: Moto };
  MotoMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Detalhes">;

export default function Detalhes({ route, navigation }: Props) {
  const [placaBusca, setPlacaBusca] = useState("");
  const [moto, setMoto] = useState<Moto | null>(route.params?.moto || null);

  useEffect(() => {
    if (route.params?.moto) {
      setMoto(route.params.moto);
      setPlacaBusca(route.params.moto.placa);
    }
  }, [route.params?.moto]);

  const buscarMotoPorPlaca = async () => {
    if (!placaBusca.trim()) {
      Alert.alert("Atenção", "Por favor, digite uma placa para buscar.");
      return;
    }
    try {
      const dados = await AsyncStorage.getItem("motos");
      const motos: Moto[] = dados ? JSON.parse(dados) : [];
      const motoEncontrada = motos.find((m) => m.placa.toLowerCase() === placaBusca.toLowerCase());

      if (motoEncontrada) {
        setMoto(motoEncontrada);
      } else {
        Alert.alert("Não Encontrado", "Nenhuma moto com esta placa foi encontrada.");
        setMoto(null);
      }
    } catch (error) {
      console.error("Erro ao buscar moto:", error);
      Alert.alert("Erro", "Não foi possível buscar a moto.");
    }
  };

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
      <Text style={styles.titulo}>Detalhes da Moto</Text>

      <View style={styles.buscaContainer}>
        <TextInput
          placeholder="Digite a placa para buscar"
          onChangeText={setPlacaBusca}
          value={placaBusca}
          style={styles.inputBusca}
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={styles.botaoBusca}
          onPress={buscarMotoPorPlaca}
        >
          <Text style={styles.textoBotaoBusca}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {moto ? (
        <View style={styles.detalhesCard}>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Nome:</Text> {moto.nome}</Text>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Fabricante:</Text> {moto.fabricante}</Text>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Cilindrada:</Text> {moto.cilindrada} cc</Text>
          <Text style={styles.detalhesTexto}><Text style={{ fontWeight: 'bold' }}>Placa:</Text> {moto.placa}</Text>
          <Text style={styles.detalhesTexto}>
            <Text style={{ fontWeight: 'bold' }}>Status:</Text> <Text style={{ fontWeight: 'bold', color: getStatusColor(moto.status) }}>{moto.status}</Text>
          </Text>
          <Text style={styles.detalhesTexto}>
            <Text style={{ fontWeight: 'bold' }}>QR Code:</Text> {moto.qrCode ? moto.qrCode : 'não registrado'}
          </Text>

          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => navigation.navigate("Cadastro", { moto })}
          >
            <Text style={styles.textoBotaoEditar}>Editar Moto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.aviso}>Use a busca acima para encontrar uma moto ou selecione de uma lista.</Text>
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
    alignItems: 'center',
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
  detalhesCard: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
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
  aviso: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
    width: '88%',
  },
  botaoEditar: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6e8cd6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  textoBotaoEditar: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  botoesNavegacaoContainer: {
    marginTop: 30,
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