export interface EnderecoInterface {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
  estado: string;
  regiao: string;
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
  uf: '',
  estado: '',
  regiao: '',
  ibge: '',
  gia: '',
  ddd: '',
  siafi: '',
});
