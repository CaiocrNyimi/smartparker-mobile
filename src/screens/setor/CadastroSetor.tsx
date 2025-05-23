import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; 
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Patio } from "../../models/Patio";
import { Setor } from "../../models/Setor";

type RootStackParamList = {
  ListaSetor: undefined;
  CadastroSetor: { setor?: Setor };
  SetorMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CadastroSetor">;

export default function CadastroSetor({ navigation, route }: Props) {
  const setorEditando = route.params?.setor || null;
  const [nome, setNome] = useState(setorEditando?.nome || "");
  const [fileira, setFileira] = useState(setorEditando?.fileira?.toString() || "");
  const [vaga, setVaga] = useState(setorEditando?.vaga?.toString() || "");
  const [patiosDisponiveis, setPatiosDisponiveis] = useState<Patio[]>([]);
  const [patioSelecionadoId, setPatioSelecionadoId] = useState<number | null>(null);

  useEffect(() => {
    const carregarPatios = async () => {
      try {
        const dadosPatios = await AsyncStorage.getItem("patios");
        const patios: Patio[] = dadosPatios ? JSON.parse(dadosPatios) : [];
        setPatiosDisponiveis(patios);

        if (setorEditando && setorEditando.patio) {
          setPatioSelecionadoId(setorEditando.patio.id);
        } else if (patios.length > 0) {
          setPatioSelecionadoId(patios[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar pátios:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de pátios.");
      }
    };
    carregarPatios();
  }, [setorEditando]);

  const salvarSetor = async () => {
    if (!nome.trim() || !fileira.trim() || !vaga.trim() || patioSelecionadoId === null) {
      Alert.alert("Erro", "Todos os campos e a seleção do pátio são obrigatórios.");
      return;
    }

    if (isNaN(Number(fileira)) || isNaN(Number(vaga))) {
      Alert.alert("Erro", "Fileira e Vaga devem ser números válidos.");
      return;
    }

    const patioAssociado = patiosDisponiveis.find(p => p.id === patioSelecionadoId);

    if (!patioAssociado) {
      Alert.alert("Erro", "Pátio selecionado inválido. Por favor, selecione um pátio existente.");
      return;
    }

    try {
      const dados = await AsyncStorage.getItem("setores");
      const setores: Setor[] = dados ? JSON.parse(dados) : [];

      let novosSetores;
      if (setorEditando) {
        novosSetores = setores.map((s) =>
          s.id === setorEditando.id
            ? { ...s, nome, fileira: Number(fileira), vaga: Number(vaga), patio: patioAssociado }
            : s
        );
      } else {
        const novoSetor: Setor = {
          id: new Date().getTime(),
          nome,
          fileira: Number(fileira),
          vaga: Number(vaga),
          patio: patioAssociado,
        };
        novosSetores = [...setores, novoSetor];
      }

      await AsyncStorage.setItem("setores", JSON.stringify(novosSetores));

      Alert.alert("Sucesso", setorEditando ? "Setor editado com sucesso!" : "Setor cadastrado!");
      navigation.reset({
        index: 0,
        routes: [{ name: "ListaSetor" }],
      });
    } catch (error) {
      console.error("Erro ao salvar setor:", error);
      Alert.alert("Erro", "Não foi possível salvar o setor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{setorEditando ? "Editar Setor" : "Cadastrar Setor"}</Text>

      <TextInput
        placeholder="Nome do Setor (Ex: A1, B2)"
        onChangeText={setNome}
        value={nome}
        style={styles.input}
        placeholderTextColor="#999"
        autoCapitalize="words"
      />
      <TextInput
        placeholder="Fileira (Número)"
        keyboardType="numeric"
        onChangeText={setFileira}
        value={fileira}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Vaga (Número)"
        keyboardType="numeric"
        onChangeText={setVaga}
        value={vaga}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.labelPicker}>Selecione o Pátio:</Text>
      <View style={styles.pickerContainer}>
        {patiosDisponiveis.length > 0 ? (
          <Picker
            selectedValue={patioSelecionadoId}
            onValueChange={(itemValue) => setPatioSelecionadoId(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {patiosDisponiveis.map((patio) => (
              <Picker.Item key={patio.id} label={patio.nome} value={patio.id} />
            ))}
          </Picker>
        ) : (
          <Text style={styles.aviso}>Nenhum pátio disponível. Cadastre um pátio primeiro.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarSetor}>
        <Text style={styles.textoBotaoSalvar}>
          {setorEditando ? "Salvar Alterações" : "Salvar Setor"}
        </Text>
      </TouchableOpacity>

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.navigate("SetorMenu")}>
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Setores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVoltarPrincipal} onPress={() => navigation.navigate("HomeMenu")}>
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
  labelPicker: {
    width: "88%",
    fontSize: 18,
    color: "#333333",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'left',
  },
  pickerContainer: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333333",
  },
  pickerItem: {
    fontSize: 17,
  },
  aviso: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    paddingVertical: 15,
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