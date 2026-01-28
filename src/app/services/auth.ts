import { Injectable, inject } from '@angular/core';
import { Auth, signOut, user } from '@angular/fire/auth';
import { Database, ref, objectVal } from '@angular/fire/database';
import { Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router'; // <--- Importante

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private db: Database = inject(Database);
  private router: Router = inject(Router); // <--- Inyectamos el router

  userProfile$: Observable<any>;

  constructor() {
    this.userProfile$ = user(this.auth).pipe(
      switchMap((user) => {
        if (user) {
          const userRef = ref(this.db, `usuarios/${user.uid}`);
          return objectVal(userRef);
        } else {
          return of(null);
        }
      })
    );
  }

  async logout() {
    await signOut(this.auth);
    return this.router.navigate(['/login']); // <--- Cambia '/login' por la ruta de tu login
  }
}