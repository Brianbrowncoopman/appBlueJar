import { Injectable, inject } from '@angular/core';
import { Auth, signOut, user } from '@angular/fire/auth';
import { Database, ref, objectVal } from '@angular/fire/database'; // Cambiado a Database
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private db: Database = inject(Database);

  userProfile$: Observable<any>;

  constructor() {
    this.userProfile$ = user(this.auth).pipe(
      switchMap((user) => {
        if (user) {
          // Buscamos el rol en Realtime Database rama 'usuarios'
          const userRef = ref(this.db, `usuarios/${user.uid}`);
          return objectVal(userRef);
        } else {
          return of(null);
        }
      })
    );
  }

  async logout() {
    return signOut(this.auth);
  }
}