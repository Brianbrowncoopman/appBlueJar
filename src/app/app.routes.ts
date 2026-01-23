import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'control-temperatura',
    loadComponent: () => import('./pages/control-temperatura/control-temperatura.page').then( m => m.ControlTemperaturaPage)
  },
  {
    path: 'control-productos',
    loadComponent: () => import('./pages/control-productos/control-productos.page').then( m => m.ControlProductosPage)
  },
  {
    path: 'venta-dia',
    loadComponent: () => import('./pages/venta-dia/venta-dia.page').then( m => m.VentaDiaPage)
  },
];
