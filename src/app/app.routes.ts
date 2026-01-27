import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Cambiamos el inicio de 'home' a 'login'
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
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
  {
    path: 'comedor',
    loadComponent: () => import('./pages/comedor/comedor.page').then( m => m.ComedorPage)
  },
  {
    path: 'informes',
    loadComponent: () => import('./pages/informes/informes.page').then( m => m.InformesPage)
  },
  {
    path: 'pedido-bodega',
    loadComponent: () => import('./pages/pedidobodega/pedidobodega.page').then( m => m.PedidoPage)
  }
  
];
