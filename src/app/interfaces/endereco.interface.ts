import { RegiaoBrasilNomeEnum, UfSigla } from "./regioesBrasil.interface";

export interface EnderecoInterface {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: UfSigla;
  numero: string;
  estado: string;
  regiao: RegiaoBrasilNomeEnum;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const getEmptyEndereco = (): EnderecoInterface => ({
  cep: '',
  logradouro: '',
  complemento: '',
  unidade: '',
  numero: '',
  bairro: '',
  localidade: '',
  uf: '' as UfSigla,
  estado: '',
  regiao: '' as RegiaoBrasilNomeEnum,
  ibge: '',
  gia: '',
  ddd: '',
  siafi: '',
});
