import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../../../assets";

type RootStackParamList = {
  HomeMenu: undefined;
  MotoMenu: undefined;
  PatioMenu: undefined;
  SetorMenu: undefined;
  LocalizacaoMotoMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "HomeMenu">;

export default function HomeMenu({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>SmartPark</Text>
      <Text style={styles.subtitulo}>Gestão Completa ao seu Alcance</Text>

      <Image
        source={Images.smartparkLogo}
        style={styles.ilustracao}
        resizeMode="contain"
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.botaoDestaque}
          onPress={() => navigation.navigate("MotoMenu")}
        >
          <Text style={styles.textoBotaoDestaque}>Gerenciar Motos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("PatioMenu")}
        >
          <Text style={styles.textoBotao}>Gerenciar Pátios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("SetorMenu")}
        >
          <Text style={styles.textoBotao}>Gerenciar Setores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("LocalizacaoMotoMenu")}
        >
          <Text style={styles.textoBotao}>Localização de Motos</Text>
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
    fontSize: 52,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: "500",
    color: "#6b7c85",
    textAlign: "center",
    marginBottom: 40,
  },
  ilustracao: {
    width: '85%',
    height: 220,
    marginBottom: 50,
  },
  botoesContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  botaoPersonalizado: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 18,
    width: "88%",
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 8,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  botaoDestaque: {
    backgroundColor: "#ff8c72",
    paddingVertical: 20,
    width: "88%",
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff8c72",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 16,
    borderWidth: 2,
    borderColor: '#ffc19e',
  },
  textoBotaoDestaque: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 4,
  },
});