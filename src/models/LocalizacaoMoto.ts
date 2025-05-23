import { Moto } from "./Moto";
import { Setor } from "./Setor";

export type LocalizacaoMoto = {
  id: number;
  dataAtualizada: string;
  moto: Moto;
  setor: Setor;
};
