import { Router } from '@angular/router';
import { Injectable, inject, DestroyRef } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  authState,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  User as FirebaseUser,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  updateDoc,
  docData,
  DocumentReference,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import {
  getEmptyUser,
  UserInterface,
  UserType,
} from './../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { config } from './config';
import { serverTimestamp } from 'firebase/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // deps
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  /** Firebase Auth user (nullable) */
  readonly authUser$ = authState(this.auth).pipe(
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /** Stream do documento do usuário no Firestore (nullable quando deslogado) */
  readonly user$: Observable<UserInterface | null> = this.authUser$.pipe(
    switchMap((fbUser) =>
      fbUser ? this.ensureUserDocument$(fbUser) : of(null)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /** Tipo do usuário (ou null) */
  readonly userType$: Observable<UserType | null> = this.user$.pipe(
    map((u) => u?.role ?? null),
    distinctUntilChanged()
  );

  /** Flag derivada de auth */
  readonly isLoggedIn$: Observable<boolean> = this.authUser$.pipe(
    map(Boolean),
    distinctUntilChanged()
  );

  /** Subject que guarda sempre o último valor do usuário logado */
  private readonly currentUserSubject =
    new BehaviorSubject<UserInterface | null>(null);

  /** Observable público do usuário atual */
  readonly currentUser$ = this.currentUserSubject.asObservable();

  /** Getter síncrono para pegar o último usuário */
  get currentUser(): UserInterface | null {
    return this.currentUserSubject.value;
  }

  constructor() {
    this.initAuthPersistence();

    // mantém o subject sincronizado com user$
    this.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.currentUserSubject.next(user));
  }

  /** Persistência: produção = sessão; dev = local. */
  private initAuthPersistence(): void {
    const persistence = environment.production
      ? browserSessionPersistence
      : browserLocalPersistence;

    from(setPersistence(this.auth, persistence))
      .pipe(catchError(() => of(null)))
      .subscribe();
  }

  /** Login com Google */
  loginWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((cred) => {
        const ref = this.userRef(cred.user.uid);
        return from(updateDoc(ref, { lastLogin: serverTimestamp() })).pipe(
          catchError(() => of(void 0)),
          map(() => void 0)
        );
      }),
      tap(() => {
        debugger;
        this.router.navigateByUrl('/dashboard');
      })
    );
  }

  /** Logout */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        // currentUserSubject já vai emitir `null` por causa do authState
        return void 0;
      }),
      catchError(() => of(void 0))
    );
  }

  /**
   * Garante que o doc do usuário exista no Firestore.
   * Se não existir, cria com defaults. Sempre retorna o stream docData.
   */
  private ensureUserDocument$(
    firebaseUser: FirebaseUser
  ): Observable<UserInterface> {
    const ref = this.userRef(firebaseUser.uid);

    return docData(ref, { idField: 'id' }).pipe(
      switchMap((data) => {
        if (data) {
          return of(data);
        }

        const newUser: UserInterface = {
          ...getEmptyUser(),
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          photoURL: firebaseUser.photoURL ?? '',
          phoneNumber: firebaseUser.phoneNumber ?? '',
          role: UserType.User,
          createdAt: serverTimestamp() as any,
          lastLogin: serverTimestamp() as any,
          isActive: true,
          settings: { darkMode: false, notifications: true },
        };

        return from(setDoc(ref, newUser, { merge: true })).pipe(
          map(() => newUser)
        );
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  /** Atualiza dados do usuário atual. Emite via user$ automaticamente. */
  updateUserData(patch: Partial<UserInterface>): Observable<void> {
    return this.authUser$.pipe(
      switchMap((fbUser) => {
        if (!fbUser) return of(void 0);
        const ref = this.userRef(fbUser.uid);
        return from(updateDoc(ref, { ...patch })).pipe(map(() => void 0));
      }),
      shareReplay(1)
    );
  }

  /** Referência do documento do usuário */
  private userRef(uid: string): DocumentReference<UserInterface> {
    return doc(
      this.firestore,
      config.firebaseCollectionKeys.users,
      uid
    ) as DocumentReference<UserInterface>;
  }
}
