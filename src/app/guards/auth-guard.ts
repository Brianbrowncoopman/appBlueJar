import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userProfile$.pipe(
    take(1),
    map(profile => {
      // Verificamos si el usuario existe y si su rol es 'admin'
      if (profile && profile.rol === 'admin') {
        return true;
      }
      
      // Si no es admin, lo mandamos de vuelta al home
      console.error('Acceso denegado: No eres administrador');
      router.navigate(['/home']);
      return false;
    })
  );
};