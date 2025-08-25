import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docSnapshots,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { config } from './config';
import { UtilService } from './util.service';
import {
  EntregaInterface,
  EntregaStatus,
} from '../interfaces/entrega.interface';
import { HistoricoEntregaInterface } from '../interfaces/historico.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class EntregaService {
  private readonly firestoreCtrl = inject(Firestore);
  private readonly utilSrv = inject(UtilService);
  private readonly authSrv = inject(AuthService);
  private readonly entregaConverter =
    this.utilSrv.genericConverter<EntregaInterface>([
      'dataEstimadaEntrega',
      'createdAt',
      'updatedAt',
      'dataEnvio',
    ]);

  private readonly historicoConverter =
    this.utilSrv.genericConverter<HistoricoEntregaInterface>(['date']);

  private entregaDocRef(id: string) {
    return doc(
      this.firestoreCtrl,
      config.firebaseCollectionKeys.entregas,
      id
    ).withConverter(this.entregaConverter);
  }

  private historicoDocRef(idEntrega: string, idHistorico: string) {
    return doc(
      this.firestoreCtrl,
      config.firebaseCollectionKeys.entregas,
      idEntrega,
      config.firebaseCollectionKeys.historico,
      idHistorico
    ).withConverter(this.historicoConverter);
  }

  private historicoCollectionRef(idEntrega: string) {
    return collection(
      this.firestoreCtrl,
      config.firebaseCollectionKeys.entregas,
      idEntrega,
      config.firebaseCollectionKeys.historico
    ).withConverter(this.historicoConverter);
  }

  getAllEntregas() {
    const collectionRef = collection(
      this.firestoreCtrl,
      config.firebaseCollectionKeys.entregas
    ).withConverter(this.entregaConverter);

    return collectionData(collectionRef, { idField: 'id' });
  }

  getUltimas5Entregas() {
    const collectionRef = collection(
      this.firestoreCtrl,
      config.firebaseCollectionKeys.entregas
    ).withConverter(this.entregaConverter);

    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(5));

    return collectionData(q, { idField: 'id' });
  }

  listenToEntregaById(id: string) {
    return docSnapshots(this.entregaDocRef(id));
  }

  getEntregaById(id: string) {
    return getDoc(this.entregaDocRef(id));
  }

  addEntrega(entrega: EntregaInterface) {
    return setDoc(this.entregaDocRef(entrega.id), entrega);
  }

  updateEntrega(entrega: EntregaInterface) {
    return setDoc(this.entregaDocRef(entrega.id), entrega, { merge: true });
  }

  archiveEntrega(entregaObj: EntregaInterface) {
    entregaObj.status = EntregaStatus.Arquivada;
    entregaObj.updatedAt = new Date();
    entregaObj.arquivado = true;
    entregaObj.updatedBy = this.authSrv.currentUser!.id
      ? this.authSrv.currentUser!.id
      : '';

    return updateDoc(this.entregaDocRef(entregaObj.id), { entregaObj });
  }

  deleteEntrega(id: string) {
    return deleteDoc(this.entregaDocRef(id));
  }

  getAllHistoricoEntrega(idEntrega: string) {
    return collectionData(this.historicoCollectionRef(idEntrega), {
      idField: 'id',
    });
  }

  listenToHistoricoEntregaById(idEntrega: string, idHistorico: string) {
    return docSnapshots(this.historicoDocRef(idEntrega, idHistorico));
  }

  getHistoricoEntregaById(idEntrega: string, idHistorico: string) {
    return getDoc(this.historicoDocRef(idEntrega, idHistorico));
  }

  addHistoricoEntrega(idEntrega: string, historico: HistoricoEntregaInterface) {
    return setDoc(this.historicoDocRef(idEntrega, historico.id), historico);
  }

  updateHistoricoEntrega(
    idEntrega: string,
    historico: HistoricoEntregaInterface
  ) {
    return setDoc(this.historicoDocRef(idEntrega, historico.id), historico);
  }
}
