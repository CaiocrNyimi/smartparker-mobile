import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Setor } from "../../models/Setor";

type RootStackParamList = {
  DetalhesSetor: { setor: Setor };
  CadastroSetor: { setor?: Setor };
  ListaSetor: undefined;
  SetorMenu: undefined;
  HomeMenu: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "ListaSetor">;

export default function ListaSetor({ navigation }: Props) {
  const [setores, setSetores] = useState<Setor[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarSetores();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarSetores = async () => {
    try {
      const dados = await AsyncStorage.getItem("setores");
      setSetores(dados ? JSON.parse(dados) : []);
    } catch (error) {
      console.error("Erro ao carregar setores:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de setores.");
    }
  };

  const excluirSetor = async (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover este setor? Isso pode afetar as motos nele.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const dados = await AsyncStorage.getItem("setores");
              const setores = dados ? JSON.parse(dados) : [];
              const novosSetores = setores.filter((setor: Setor) => setor.id !== id);

              await AsyncStorage.setItem("setores", JSON.stringify(novosSetores));
              setSetores(novosSetores);
              Alert.alert("Sucesso", "Setor removido com sucesso!");
            } catch (error) {
              console.error("Erro ao excluir setor:", error);
              Alert.alert("Erro", "Não foi possível remover o setor.");
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Setor }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Setor:</Text> {item.nome}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Fileira:</Text> {item.fileira}</Text>
        <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Vaga:</Text> {item.vaga}</Text>
        {item.patio && item.patio.nome ? (
          <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Pátio:</Text> {item.patio.nome}</Text>
        ) : (
          <Text style={styles.itemTexto}><Text style={{ fontWeight: 'bold' }}>Pátio:</Text> Não Associado</Text>
        )}
      </View>
      <View style={styles.itemBotoesContainer}>
        <TouchableOpacity
          style={styles.botaoAcaoSecundario}
          onPress={() => navigation.navigate("DetalhesSetor", { setor: item })}
        >
          <Text style={styles.textoBotaoAcaoSecundario}>Ver Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => navigation.navigate("CadastroSetor", { setor: item })}
        >
          <Text style={styles.textoBotaoAcao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botaoAcao, styles.botaoRemover]}
          onPress={() => excluirSetor(item.id)}
        >
          <Text style={styles.textoBotaoAcao}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Setores</Text>
      {setores.length === 0 ? (
        <Text style={styles.aviso}>Nenhum setor cadastrado.</Text>
      ) : (
        <FlatList
          data={setores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listaConteudo}
        />
      )}

      <View style={styles.botoesNavegacaoContainer}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.navigate("SetorMenu")}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar ao Menu de Setores</Text>
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
    flexWrap: 'wrap',
    marginTop: 10,
  },
  botaoAcao: {
    backgroundColor: "#6e8cd6",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: 4,
  },
  botaoRemover: {
    backgroundColor: "#dc3545",
  },
  botaoAcaoSecundario: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: 4,
  },
  textoBotaoAcao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  textoBotaoAcaoSecundario: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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