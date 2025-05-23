import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Moto } from "../../models/Moto";

type RootStackParamList = {
  Lista: undefined;
  Cadastro: { moto?: Moto };
  MotoMenu: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">;

export default function Cadastro({ navigation, route }: Props) {
  const motoEditando = route.params?.moto || null;
  const [nome, setNome] = useState(motoEditando?.nome || "");
  const [placa, setPlaca] = useState(motoEditando?.placa || "");
  const [fabricante, setFabricante] = useState(motoEditando?.fabricante || "");
  const [cilindrada, setCilindrada] = useState(motoEditando?.cilindrada?.toString() || "");
  const [qrCode, setQrCode] = useState(motoEditando?.qrCode || "");
  const [status, setStatus] = useState<"Disponível" | "Em uso" | "Reparo">(motoEditando?.status || "Disponível");

  const salvarMoto = async () => {
    if (!nome.trim() || !placa.trim() || !fabricante.trim() || !cilindrada.trim() || !qrCode.trim()) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    const dados = await AsyncStorage.getItem("motos");
    const motos: Moto[] = dados ? JSON.parse(dados) : [];

    let novasMotos;
    if (motoEditando) {
      novasMotos = motos.map((m) => m.id === motoEditando.id ? { ...m, nome, placa, fabricante, cilindrada: Number(cilindrada), qrCode, status } : m);
    } else {
      const novaMoto: Moto = {
        id: new Date().getTime(),
        nome,
        placa,
        fabricante,
        cilindrada: Number(cilindrada),
        qrCode,
        status,
      };
      novasMotos = [...motos, novaMoto];
    }

    await AsyncStorage.setItem("motos", JSON.stringify(novasMotos));

    Alert.alert("Sucesso", motoEditando ? "Moto editada com sucesso!" : "Moto cadastrada!");
    navigation.reset({ index: 0, routes: [{ name: "Lista" }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{motoEditando ? "Editar Moto" : "Cadastrar Moto"}</Text>

      <TextInput
        placeholder="Nome da Moto"
        onChangeText={setNome}
        value={nome}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Placa"
        onChangeText={setPlaca}
        value={placa}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Fabricante"
        onChangeText={setFabricante}
        value={fabricante}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Cilindrada"
        keyboardType="numeric"
        onChangeText={setCilindrada}
        value={cilindrada}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="QR Code"
        onChangeText={setQrCode}
        value={qrCode}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Status:</Text>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue as "Disponível" | "Em uso" | "Reparo")}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Disponível" value="Disponível" />
          <Picker.Item label="Em uso" value="Em uso" />
          <Picker.Item label="Reparo" value="Reparo" />
        </Picker>
      </View>


      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={salvarMoto}
      >
        <Text style={styles.textoBotaoSalvar}>{motoEditando ? "Salvar Alterações" : "Salvar Moto"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotaoVoltar}>Voltar</Text>
      </TouchableOpacity>
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
  pickerContainer: {
    width: "88%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
  },
  pickerLabel: {
    fontSize: 17,
    color: "#333333",
    fontWeight: '600',
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: "#333333",
  },
  pickerItem: {
    fontSize: 17,
    color: "#333333",
  },

  botaoSalvar: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 18,
    width: "88%",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
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
  botaoVoltar: {
    backgroundColor: "#95a5a6",
    paddingVertical: 15,
    width: "88%",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
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