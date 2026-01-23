import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonItem, IonLabel, IonInput, IonText, IonCard, IonBadge,
  IonList, IonItemDivider, IonIcon, IonButton // <--- Agregamos estos
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // Para que funcionen los iconos
import { closeCircleOutline } from 'ionicons/icons'; // Importar el icono específico

@Component({
  selector: 'app-venta-dia',
  templateUrl: './venta-dia.page.html',
  styleUrls: ['./venta-dia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonText, 
    IonCard, 
    IonBadge,
    IonList,          // Requerido por el error
    IonItemDivider,   // Requerido por el error
    IonIcon,          // Requerido por el error
    IonButton         // Requerido por el error
  ]
})
export class VentaDiaPage implements OnInit {
  
  fechaActual: string = '2024-05-20'; // Esto vendrá de tu servicio/base de datos

  // Valores que "traeremos de otro lado" (Metas)
  metas = {
    am: 550000,
    almuerzo: 1000000,
    tarde: 450000,
    dia :2000000
  };

  // Nueva sección operativa
  operacion = {
    menuDelDia: '',
    platoPrincipal: '',
    entrada: '',
    postre: '',
    desviar: '',
    productos86: ['', '', ''] // Array para los 3 inputs de la imagen
  };

  // Valores que el usuario ingresa (Real)
  real = {
    am: 0,
    almuerzo: 0,
    tarde: 0
  };

  constructor() {}

  ngOnInit() {}

  // Cálculo de suma de ventas reales
  get sumaReal(): number {
    return this.real.am + this.real.almuerzo + this.real.tarde;
  }

  // Cálculo de diferencia final (Meta del día - Suma de reales)
  get diferenciaTotal(): number {
    return this.metas.dia - this.sumaReal;
  }
}