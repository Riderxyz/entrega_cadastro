import { inject, Injectable } from '@angular/core';
import {
  FirestoreDataConverter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';
import { EnderecoInterface } from '../interfaces/endereco.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilService {
  private readonly http: HttpClient = inject(HttpClient);
  constructor() {}

  /**
   * Retorna o conversor Firestore de timestamp para Date e vice-versa.
   *
   * Útil para usar com `.withConverter(...)` em coleções/documentos
   * e manter os campos Date ↔ Timestamp convertidos automaticamente.
   * @param dateFields nomes dos campos que devem ser convertidos
   */
  genericConverter<T>(dateFields: (keyof T)[] = []): FirestoreDataConverter<T> {
    return {
      toFirestore(model: T): DocumentData {
        const data: any = { ...model };

        for (const field of dateFields) {
          const value = data[field as string];
          data[field as string] =
            value instanceof Date ? Timestamp.fromDate(value) : value ?? null;
        }

        return data;
      },

      fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
      ): T {
        const data: any = snapshot.data(options);

        for (const field of dateFields) {
          const value = data[field as string];
          data[field as string] =
            value instanceof Timestamp ? value.toDate() : value ?? null;
        }

        return data as T;
      },
    };
  }

  /**
   * Faz uma requisição GET para a API do ViaCEP,
   * retornando um Observable com os dados do endereço
   * correspondente ao CEP informado.
   * @param cep CEP a ser consultado
   * @returns Observable com os dados do endereço
   */
  getEnderecoByCep(cep: string): Observable<EnderecoInterface> {
    return this.http.get<EnderecoInterface>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
  }

  /**
   * Formata um endereço em uma única linha padrão.
   */
  formatarEndereco(endereco: EnderecoInterface): string {
    if (!endereco) return '';

    const { logradouro, complemento, bairro, localidade, uf, cep } = endereco;

    let linha = logradouro;
    if (complemento && complemento.trim() !== '') {
      linha += `, ${complemento}`;
    }

    return `${linha} – ${bairro}, ${localidade}/${uf} – CEP ${cep}`;
  }
}
