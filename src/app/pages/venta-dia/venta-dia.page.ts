import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonItem, IonLabel, IonText, IonCard, IonBadge,
  IonIcon, IonButton, IonCardHeader, IonCardTitle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
  sunnyOutline, fastFoodOutline, moonOutline, logoWhatsapp, shareOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-venta-dia',
  templateUrl: './venta-dia.page.html',
  styleUrls: ['./venta-dia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonCard, 
    IonBadge, IonIcon, IonButton, IonCardHeader, IonCardTitle
  ]
})
export class VentaDiaPage implements OnInit {
  
  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Valores numéricos para cálculos
  metas: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };
  real: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };

  // Máscaras de texto para los inputs
  metasDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };
  realDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };

  constructor() {
    addIcons({
      calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline,
      sunnyOutline, fastFoodOutline, moonOutline, logoWhatsapp, shareOutline
    });
  }

  ngOnInit() {}

  // Lógica de formateo: Convierte 1000000 en 1.000.000.-
  formatInput(tipo: 'metas' | 'real', turno: string, evento: any) {
    let valor = evento.target.value.replace(/\D/g, ''); // Solo números
    
    if (valor === '') {
      this[tipo][turno] = 0;
      this[`${tipo}Display`][turno] = '';
      return;
    }

    const num = parseInt(valor, 10);
    this[tipo][turno] = num;
    
    // Formatear con puntos y sufijo
    this[`${tipo}Display`][turno] = num.toLocaleString('de-DE') + '.-';
  }

  clearIfZero(tipo: 'metasDisplay' | 'realDisplay', turno: string) {
    if (this[tipo][turno] === '0.-' || this[tipo][turno] === '') {
      this[tipo][turno] = '';
    }
  }

  get metaDelDiaCalculada(): number {
    return (this.metas['am'] || 0) + (this.metas['almuerzo'] || 0) + (this.metas['tarde'] || 0);
  }

  get sumaReal(): number {
    return (this.real['am'] || 0) + (this.real['almuerzo'] || 0) + (this.real['tarde'] || 0);
  }

  get diferenciaTotal(): number {
    return this.metaDelDiaCalculada - this.sumaReal;
  }

  getIcono(turno: string) {
    const iconos: { [key: string]: string } = { am: 'sunny-outline', almuerzo: 'fast-food-outline', tarde: 'moon-outline' };
    return iconos[turno];
  }

  compartirReporte() {
    const mensaje = `
  *RESUMEN DE VENTAS - ${this.fechaActual}*
  ---------------------------------------
  ☀️ *AM:* $${this.metas['am']?.toLocaleString('de-DE') || 0} / $${this.real['am']?.toLocaleString('de-DE') || 0}
  🍴 *ALMUERZO:* $${this.metas['almuerzo']?.toLocaleString('de-DE') || 0} / $${this.real['almuerzo']?.toLocaleString('de-DE') || 0}
  🌙 *TARDE:* $${this.metas['tarde']?.toLocaleString('de-DE') || 0} / $${this.real['tarde']?.toLocaleString('de-DE') || 0}
  ---------------------------------------
  📊 *TOTAL META:* $${this.metaDelDiaCalculada.toLocaleString('de-DE')}.-
  💰 *TOTAL REAL:* $${this.sumaReal.toLocaleString('de-DE')}.-
  ${this.diferenciaTotal > 0 ? '❌ *FALTAN:*' : '✅ *SOBRAN:*'} $${Math.abs(this.diferenciaTotal).toLocaleString('de-DE')}.-
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

}