export type Moto = {
  id: number;
  nome: string;
  fabricante: string;
  cilindrada: number;
  placa: string;
  status: "Disponível" | "Em uso" | "Reparo";
  qrCode: string;
};
