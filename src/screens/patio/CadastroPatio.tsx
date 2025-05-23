import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Patio } from "../../models/Patio";

type RootStackParamList = {
  ListaPatio: undefined;
  CadastroPatio: { patio?: Patio };
  PatioMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CadastroPatio">;

export default function CadastroPatio({ navigation, route }: Props) {
  const patioEditando = route.params?.patio || null;
  const [nome, setNome] = useState(patioEditando?.nome || "");
  const [localizacao, setLocalizacao] = useState(patioEditando?.localizacao || "");

  const salvarPatio = async () => {
    if (!nome.trim() || !localizacao.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const dados = await AsyncStorage.getItem("patios");
      const patios: Patio[] = dados ? JSON.parse(dados) : [];

      let novosPatios;
      if (patioEditando) {
        novosPatios = patios.map((p) =>
          p.id === patioEditando.id ? { ...p, nome, localizacao } : p
        );
      } else {
        const novoPatio: Patio = { id: new Date().getTime(), nome, localizacao };
        novosPatios = [...patios, novoPatio];
      }

      await AsyncStorage.setItem("patios", JSON.stringify(novosPatios));

      Alert.alert("Sucesso", patioEditando ? "Pátio editado com sucesso!" : "Pátio cadastrado!");
      navigation.reset({
        index: 0,
        routes: [{ name: "ListaPatio" }],
      });
    } catch (error) {
      console.error("Erro ao salvar pátio:", error);
      Alert.alert("Erro", "Não foi possível salvar o pátio.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{patioEditando ? "Editar Pátio" : "Cadastrar Pátio"}</Text>

      <TextInput
        placeholder="Nome do Pátio"
        onChangeText={setNome}
        value={nome}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Localização"
        onChangeText={setLocalizacao}
        value={localizacao}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarPatio}
      >
        <Text style={styles.textoBotaoSalvar}>{patioEditando ? "Salvar Alterações" : "Salvar Pátio"}</Text>
      </TouchableOpacity>

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
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fcfbf7",
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
  input: {
    width: "88%",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 17,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  botaoSalvar: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 18,
    width: "88%",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6e8cd6",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  textoBotaoSalvar: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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