import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterBrbcComponent } from '../componets/footer-brbc/footer-brbc.component';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
  IonCardTitle, IonIcon, IonCardSubtitle,IonLabel ,IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { thermometerOutline, cubeOutline, cashOutline, restaurantOutline, documentTextOutline, cartOutline, statsChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent,
    IonCardTitle, IonIcon, IonCardSubtitle, FooterBrbcComponent,IonLabel
  ],
})
export class HomePage {
  constructor(private router: Router) {
    // Registrar los iconos para Standalone
    addIcons({restaurantOutline,cashOutline,thermometerOutline,statsChartOutline,cartOutline,cubeOutline,documentTextOutline});
  }

  navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}
