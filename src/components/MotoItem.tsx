import { View, Text, StyleSheet } from "react-native";
import { Moto } from "../models/Moto";

type MotoProps = {
  nome: string;
  placa: string;
  fabricante: string;
  status: "Disponível" | "Em uso" | "Reparo";
};

export default function MotoItem({ nome, placa, fabricante, status }: MotoProps) {
  return (
    <View>
      <Text>{nome} ({placa})</Text>
      <Text>Fabricante: {fabricante}</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
