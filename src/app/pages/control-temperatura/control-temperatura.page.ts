import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
  IonIcon, IonCardTitle, IonCardSubtitle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flameOutline, restaurantOutline, cubeOutline, chevronForwardOutline } from 'ionicons/icons';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';

@Component({
  selector: 'app-control-temperatura',
  templateUrl: './control-temperatura.page.html',
  styleUrls: ['./control-temperatura.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
    IonIcon, IonCardTitle, IonCardSubtitle, CommonModule, 
    FormsModule, FooterBrbcComponent
  ]
})
export class ControlTemperaturaPage implements OnInit {

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  constructor(private router: Router) {
    addIcons({ flameOutline, restaurantOutline, cubeOutline, chevronForwardOutline });
  }

  ngOnInit() {}

  navegar(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}