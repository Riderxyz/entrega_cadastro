import { Injectable } from '@angular/core';
import { FirestoreDataConverter, Timestamp, DocumentData } from '@angular/fire/firestore';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor() {}

  /**
   * Retorna o conversor Firestore para UserInterface.
   *
   * Útil para usar com `.withConverter(...)` em coleções/documentos
   * e manter os campos Date ↔ Timestamp convertidos automaticamente.
   */
  userConverter(): FirestoreDataConverter<UserInterface> {
    return {
      toFirestore(user: UserInterface): DocumentData {
        return {
          ...user,
          createdAt: user.createdAt ? Timestamp.fromDate(user.createdAt) : null,
          lastLogin: user.lastLogin ? Timestamp.fromDate(user.lastLogin) : null,
        };
      },
      fromFirestore(snapshot, options): UserInterface {
        const data = snapshot.data(options)!;
        return {
          ...data,
          createdAt: data['createdAt']?.toDate() ?? null,
          lastLogin: data['lastLogin']?.toDate() ?? null,
        } as UserInterface;
      },
    };
  }

  /**
   * Converte um Date para Timestamp (Firestore).
   */
  dateToTimestamp(date?: Date): Timestamp | null {
    return date ? Timestamp.fromDate(date) : null;
  }

  /**
   * Converte um Timestamp em Date puro.
   * Se já for Date, retorna ele mesmo.
   */
  toDate(value?: Date | Timestamp | null): Date | null {
    if (!value) return null;
    return value instanceof Timestamp ? value.toDate() : value;
  }
}
