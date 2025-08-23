import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  browserSessionPersistence,
  browserLocalPersistence,
  signOut,
  User as FirebaseUser,
  authState,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  docSnapshots,
  DocumentReference,
  getDoc,
  snapToData,
} from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  getEmptyUser,
  UserInterface,
  UserType,
} from './../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

/**
 * Serviço responsável pela autenticação e gerenciamento de usuários.
 * Integra Firebase Auth e Firestore, controlando login, logout
 * e persistência de dados do usuário.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Estado do tipo de usuário (ex: comum, admin) */
  private readonly userTypeSubject = new BehaviorSubject<UserType | null>(null);
  readonly userType$ = this.userTypeSubject.asObservable();

  /** Dados do usuário logado */
  private loggedUser: UserInterface = getEmptyUser();

  /** Flag de status de login */
  isLoggedIn = false;

  // Dependências
  private readonly router = inject(Router);
  private readonly firestoreCtrl = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly toastSrv = inject(ToastService);
  constructor() {
    this.initAuthPersistence();

    // Observa mudanças no estado de autenticação do Firebase
    authState(this.auth).subscribe((firebaseUser) => {
      if (firebaseUser) {
        console.log('2323');

        this.handleFirebaseUser(firebaseUser);
        this.isLoggedIn = true;
        this.router.navigateByUrl('dashboard');
        this.toastSrv.notify('success', 'Login realizado com sucesso', '', 3000);
      } else {
        this.isLoggedIn = false;
        this.clearUserData();
      }
    });
  }

  /**
   * Inicializa a persistência da sessão de autenticação.
   * Produção = session, Dev = local.
   */
  private initAuthPersistence(): void {
    const persistence = environment.production
      ? browserSessionPersistence
      : browserLocalPersistence;

    from(this.auth.setPersistence(persistence))
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  /**
   * Realiza login usando Google.
   * @returns Observable<void>
   */
  loginWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      map(() => void 0),
      catchError((error) => throwError(() => error))
    );
  }

  /**
   * Gerencia o usuário retornado pelo FirebaseAuth.
   * Caso o usuário não exista no Firestore, cria-o com tipo padrão "comum".
   * @param firebaseUser Usuário do Firebase
   */
  private handleFirebaseUser(firebaseUser: FirebaseUser): void {
    const docRef: DocumentReference = doc(
      this.firestoreCtrl,
      'usuarios',
      firebaseUser.uid
    );
    docSnapshots(docRef)
      .pipe(
        switchMap((res) => {
          if (res.exists()) {
            const userData = res.data() as UserInterface;
            this.setLoggedUser(userData);
            return of(null);
          } else {
            const newUser: UserInterface = {
              ...getEmptyUser(),
              id: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? '',
              photoURL: firebaseUser.photoURL ?? '',
              role: UserType.User,
              createdAt: new Date(),
              lastLogin: new Date(),
              isActive: true,
              settings: {
                darkMode: false,
                notifications: true,
              },
              phoneNumber: firebaseUser.phoneNumber ?? '',
            };
            console.log(newUser);

            return from(setDoc(docRef, newUser));
          }
        })
      )
      .subscribe();
  }

  listenToUserChanges() {
    const docRef = doc(this.firestoreCtrl, 'usuarios', this.loggedUser.id);
    return docSnapshots(docRef);
  }

  /**
   * Define e persiste os dados do usuário logado.
   * @param userData Dados do usuário
   */
  private setLoggedUser(userData: UserInterface): void {
    this.loggedUser = { ...userData };
    localStorage.setItem('user', JSON.stringify(this.loggedUser));
    this.userTypeSubject.next(this.loggedUser.role!);
  }

  /**
   * Obtém os dados locais do usuário armazenados em localStorage.
   */
  get localUserData(): UserInterface {
    return (
      JSON.parse(localStorage.getItem('user') ?? 'null') ?? getEmptyUser()
    );
  }

  /**
   * Realiza logout, limpando dados locais e redirecionando para login.
   * @returns Observable<void>
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.clearUserData();
        this.router.navigateByUrl('/login');
        window.location.reload();
      }),
      catchError(() => of(void 0))
    );
  }

  /**
   * Remove dados locais do usuário e reseta estado.
   */
  private clearUserData(): void {
    localStorage.removeItem('user');
    this.userTypeSubject.next(null);
    this.loggedUser = getEmptyUser();
  }
}
