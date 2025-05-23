import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeMenu from "../screens/menu/HomeMenu";
import LocalizacaoMotoMenu from "../screens/menu/LocalizacaoMotoMenu";
import MotoMenu from "../screens/menu/MotoMenu";
import PatioMenu from "../screens/menu/PatioMenu";
import SetorMenu from "../screens/menu/SetorMenu";

import Cadastro from "../screens/moto/Cadastro";
import Detalhes from "../screens/moto/Detalhes";
import EntradaSaida from "../screens/moto/EntradaSaida";
import Lista from "../screens/moto/Lista";

import CadastroPatio from "../screens/patio/CadastroPatio";
import DetalhesPatio from "../screens/patio/DetalhesPatio";
import ListaPatio from "../screens/patio/ListaPatio";

import CadastroSetor from "../screens/setor/CadastroSetor";
import DetalhesSetor from "../screens/setor/DetalhesSetor";
import ListaSetor from "../screens/setor/ListaSetor";

import CadastroLocalizacao from "../screens/localizacaoMoto/CadastroLocalizacao";
import DetalhesLocalizacao from "../screens/localizacaoMoto/DetalhesLocalizacao";
import ListaLocalizacao from "../screens/localizacaoMoto/ListaLocalizacao";

type RootStackParamList = {
  HomeMenu: undefined;
  MotoMenu: undefined;
  PatioMenu: undefined;
  SetorMenu: undefined;
  LocalizacaoMotoMenu: undefined;

  Cadastro: undefined;
  Lista: undefined;
  EntradaSaida: undefined;
  Detalhes: undefined;

  CadastroPatio: undefined;
  ListaPatio: undefined;
  DetalhesPatio: undefined;

  CadastroSetor: undefined;
  ListaSetor: undefined;
  DetalhesSetor: undefined;

  CadastroLocalizacao: undefined;
  ListaLocalizacao: undefined;
  DetalhesLocalizacao: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMenu" component={HomeMenu} />
      <Stack.Screen name="MotoMenu" component={MotoMenu} />
      <Stack.Screen name="PatioMenu" component={PatioMenu} />
      <Stack.Screen name="SetorMenu" component={SetorMenu} />
      <Stack.Screen name="LocalizacaoMotoMenu" component={LocalizacaoMotoMenu} />

      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Lista" component={Lista} />
      <Stack.Screen name="EntradaSaida" component={EntradaSaida} />
      <Stack.Screen name="Detalhes" component={Detalhes} />

      <Stack.Screen name="CadastroPatio" component={CadastroPatio} />
      <Stack.Screen name="ListaPatio" component={ListaPatio} />
      <Stack.Screen name="DetalhesPatio" component={DetalhesPatio} />

      <Stack.Screen name="CadastroSetor" component={CadastroSetor} />
      <Stack.Screen name="ListaSetor" component={ListaSetor} />
      <Stack.Screen name="DetalhesSetor" component={DetalhesSetor} />

      <Stack.Screen name="CadastroLocalizacao" component={CadastroLocalizacao} />
      <Stack.Screen name="ListaLocalizacao" component={ListaLocalizacao} />
      <Stack.Screen name="DetalhesLocalizacao" component={DetalhesLocalizacao} />
    </Stack.Navigator>
  );
}
