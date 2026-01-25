import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
  IonCardTitle, IonIcon, IonCardSubtitle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { thermometerOutline, cubeOutline, cashOutline, restaurantOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonIcon, IonCardSubtitle
  ],
})
export class HomePage {
  constructor(private router: Router) {
    // Registrar los iconos para Standalone
    addIcons({thermometerOutline,cubeOutline,restaurantOutline,cashOutline,documentTextOutline});
  }

  navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}
