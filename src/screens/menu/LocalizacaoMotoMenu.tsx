import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  LocalizacaoMotoMenu: undefined;
  CadastroLocalizacao: undefined;
  ListaLocalizacao: undefined;
  DetalhesLocalizacao: { localizacao?: any };
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "LocalizacaoMotoMenu">;

export default function LocalizacaoMotoMenu({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Localização de Motos</Text>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("CadastroLocalizacao")}
        >
          <Text style={styles.textoBotao}>Registrar Localização</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("ListaLocalizacao")}
        >
          <Text style={styles.textoBotao}>Ver Localizações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPersonalizado}
          onPress={() => navigation.navigate("DetalhesLocalizacao")}
        >
          <Text style={styles.textoBotao}>Buscar por Placa</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.navigate("HomeMenu")}
      >
        <Text style={styles.textoBotaoVoltar}>Voltar ao Menu Principal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 70,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fcfbf7",
  },
  titulo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 50,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtonsContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
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
  botaoVoltar: {
    backgroundColor: "#95a5a6",
    paddingVertical: 15,
    width: "88%",
    borderRadius: 12,
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