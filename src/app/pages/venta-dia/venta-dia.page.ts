/*import { Component, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue, get } from '@angular/fire/database';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonItem, IonLabel, IonText, IonCard, IonBadge,
  IonIcon, IonButton, IonCardHeader, IonCardTitle,
  IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
  sunnyOutline, fastFoodOutline, moonOutline, logoWhatsapp, shareOutline, 
  saveOutline, cloudUploadOutline, lockClosedOutline, checkmarkDoneCircle 
} from 'ionicons/icons'; 

@Component({
  selector: 'app-venta-dia',
  templateUrl: './venta-dia.page.html',
  styleUrls: ['./venta-dia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonCard, 
    IonBadge, IonIcon, IonButton, IonCardHeader, IonCardTitle,
    IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, FooterBrbcComponent, IonSpinner
  ]
})
export class VentaDiaPage implements OnInit {

  public authService = inject(AuthService);
  private database: Database = inject(Database);
  private injector = inject(Injector);
  
  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  metas: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };
  real: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };

  metasDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };
  realDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };

  diaSalvado: boolean = false;

  constructor() {
    addIcons({
      saveOutline, cloudUploadOutline, checkmarkDoneCircle, logoWhatsapp, 
      calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
      sunnyOutline, fastFoodOutline, moonOutline, shareOutline, lockClosedOutline
    });
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {  
      this.escucharCambios();
    });
  }

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    this.diaSalvado = false;
    this.metas = { am: 0, almuerzo: 0, tarde: 0 };
    this.real = { am: 0, almuerzo: 0, tarde: 0 };
    this.actualizarDisplays();
    this.escucharCambios();
  }

  escucharCambios() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const historicoRef = ref(this.database, 'historico_ventas/' + fechaID);
    onValue(historicoRef, (snapshot) => {
      this.diaSalvado = snapshot.exists();
    });

    const dbRef = ref(this.database, 'ventas/' + fechaID);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.metas) Object.assign(this.metas, data.metas);
        if (data.real) Object.assign(this.real, data.real);
        this.actualizarDisplays();
      } else {
        this.metas = { am: 0, almuerzo: 0, tarde: 0 };
        this.real = { am: 0, almuerzo: 0, tarde: 0 };
        this.actualizarDisplays();
      }
    });
  }

  actualizarDisplays() {
    ['am', 'almuerzo', 'tarde'].forEach(turno => {
      this.metasDisplay[turno] = (this.metas[turno] || 0).toLocaleString('de-DE') + '.-';
      this.realDisplay[turno] = (this.real[turno] || 0).toLocaleString('de-DE') + '.-';
    });
  }

  formatInput(tipo: 'metas' | 'real', turno: string, evento: any) {
    let valor = evento.target.value.replace(/\D/g, '');
    const num = valor === '' ? 0 : parseInt(valor, 10);
    this[tipo][turno] = num;
    this[`${tipo}Display`][turno] = num.toLocaleString('de-DE') + '.-';
    
    // Auto-guardado opcional (se mantiene por consistencia)
    const fechaID = this.fechaActual.replace(/\//g, '-');
    runInInjectionContext(this.injector, () => {
      const dbRef = ref(this.database, 'ventas/' + fechaID);
      set(dbRef, { metas: this.metas, real: this.real });
    });
  }

  async guardarTurnoIndividual(turno: string) {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `ventas/${fechaID}`);
    
    try {
      await set(dbRef, { metas: this.metas, real: this.real });
      alert(`✅ Datos del turno ${turno.toUpperCase()} guardados en la base de datos.`);
    } catch (error) {
      alert("❌ Error al guardar.");
    }
  }

  cerrarDia() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const historicoRef = ref(this.database, 'historico_ventas/' + fechaID);
    const resumen = {
      fecha: this.fechaActual,
      total_meta: this.metaDelDiaCalculada,
      total_real: this.sumaReal,
      detalle: this.real
    };
    runInInjectionContext(this.injector, () => {
      set(historicoRef, resumen).then(() => {
        alert("Día finalizado y guardado en el historial.");
      });
    });
  }

  compartirReporte() {
    const msg = `*REPORTE DE VENTAS - ${this.fechaActual}*
---------------------------------------
☀️ *AM:* $${(this.real['am'] || 0).toLocaleString('de-DE')} / $${(this.metas['am'] || 0).toLocaleString('de-DE')}
🍴 *ALMUERZO:* $${(this.real['almuerzo'] || 0).toLocaleString('de-DE')} / $${(this.metas['almuerzo'] || 0).toLocaleString('de-DE')}
🌙 *TARDE:* $${(this.real['tarde'] || 0).toLocaleString('de-DE')} / $${(this.metas['tarde'] || 0).toLocaleString('de-DE')}
---------------------------------------
📊 *META DÍA:* $${this.metaDelDiaCalculada.toLocaleString('de-DE')}
💰 *REAL DÍA:* $${this.sumaReal.toLocaleString('de-DE')}
${this.diferenciaTotal <= 0 ? '✅ *SUPERÁVIT*' : '❌ *FALTANTE*'}: $${Math.abs(this.diferenciaTotal).toLocaleString('de-DE')}
---------------------------------------`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  get todoCompleto(): boolean {
    return this.real['am'] > 0 && this.real['almuerzo'] > 0 && this.real['tarde'] > 0;
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
}*/

import { Component, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonItem, IonLabel, IonText, IonCard, IonBadge,
  IonIcon, IonButton, IonCardHeader, IonCardTitle,
  IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
  sunnyOutline, fastFoodOutline, moonOutline, logoWhatsapp, shareOutline, 
  saveOutline, cloudUploadOutline, lockClosedOutline, checkmarkDoneCircle 
} from 'ionicons/icons'; 
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-dia',
  templateUrl: './venta-dia.page.html',
  styleUrls: ['./venta-dia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonCard, 
    IonBadge, IonIcon, IonButton, IonCardHeader, IonCardTitle,
    IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, FooterBrbcComponent, IonSpinner
  ]
})
export class VentaDiaPage implements OnInit {

  public authService = inject(AuthService);
  private database: Database = inject(Database);
  private injector = inject(Injector);
  private router = inject(Router);
  
  
  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  metas: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };
  real: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };

  metasDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };
  realDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };

  diaSalvado: boolean = false;

  constructor() {
    addIcons({
      saveOutline, cloudUploadOutline, checkmarkDoneCircle, logoWhatsapp, 
      calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
      sunnyOutline, fastFoodOutline, moonOutline, shareOutline, lockClosedOutline
    });
  }

  ngOnInit() {
    this.authService.userProfile$.subscribe(perfil => {
      if (perfil && perfil.rol === 'garzon' || perfil.rol === 'cocina') {
        alert("⛔ Acceso no autorizado para tu perfil.");
        this.router.navigate(['/home']); // Lo devuelve al inicio
      }
    });
  }

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    this.diaSalvado = false;
    this.metas = { am: 0, almuerzo: 0, tarde: 0 };
    this.real = { am: 0, almuerzo: 0, tarde: 0 };
    this.actualizarDisplays();
    this.escucharCambios();
  }

  escucharCambios() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const historicoRef = ref(this.database, 'historico_ventas/' + fechaID);
    onValue(historicoRef, (snapshot) => {
      this.diaSalvado = snapshot.exists();
    });

    const dbRef = ref(this.database, 'ventas/' + fechaID);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.metas) Object.assign(this.metas, data.metas);
        if (data.real) Object.assign(this.real, data.real);
        this.actualizarDisplays();
      } else {
        this.metas = { am: 0, almuerzo: 0, tarde: 0 };
        this.real = { am: 0, almuerzo: 0, tarde: 0 };
        this.actualizarDisplays();
      }
    });
  }

  actualizarDisplays() {
    ['am', 'almuerzo', 'tarde'].forEach(turno => {
      this.metasDisplay[turno] = (this.metas[turno] || 0).toLocaleString('de-DE') + '.-';
      this.realDisplay[turno] = (this.real[turno] || 0).toLocaleString('de-DE') + '.-';
    });
  }

  async formatInput(tipo: 'metas' | 'real', turno: string, evento: any) {
    // Verificación de seguridad rápida antes de procesar input
    const perfil = await this.authService.userProfile$.pipe(take(1)).toPromise();
    if (perfil?.rol === 'lector') return;

    let valor = evento.target.value.replace(/\D/g, '');
    const num = valor === '' ? 0 : parseInt(valor, 10);
    this[tipo][turno] = num;
    this[`${tipo}Display`][turno] = num.toLocaleString('de-DE') + '.-';
    
    // Auto-guardado
    const fechaID = this.fechaActual.replace(/\//g, '-');
    runInInjectionContext(this.injector, () => {
      const dbRef = ref(this.database, 'ventas/' + fechaID);
      set(dbRef, { metas: this.metas, real: this.real });
    });
  }

  async guardarTurnoIndividual(turno: string) {
    const perfil = await this.authService.userProfile$.pipe(take(1)).toPromise();
    if (perfil?.rol === 'lector') return;

    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `ventas/${fechaID}`);
    
    try {
      await set(dbRef, { metas: this.metas, real: this.real });
      alert(`✅ Datos del turno ${turno.toUpperCase()} guardados en la base de datos.`);
    } catch (error) {
      alert("❌ Error al guardar.");
    }
  }

  async cerrarDia() {
    const perfil = await this.authService.userProfile$.pipe(take(1)).toPromise();
    if (perfil?.rol === 'lector') return;

    const fechaID = this.fechaActual.replace(/\//g, '-');
    const historicoRef = ref(this.database, 'historico_ventas/' + fechaID);
    const resumen = {
      fecha: this.fechaActual,
      total_meta: this.metaDelDiaCalculada,
      total_real: this.sumaReal,
      detalle: this.real
    };
    runInInjectionContext(this.injector, () => {
      set(historicoRef, resumen).then(() => {
        alert("Día finalizado y guardado en el historial.");
      });
    });
  }

  compartirReporte() {
    const msg = `*REPORTE DE VENTAS - ${this.fechaActual}*
---------------------------------------
☀️ *AM:* $${(this.real['am'] || 0).toLocaleString('de-DE')} / $${(this.metas['am'] || 0).toLocaleString('de-DE')}
🍴 *ALMUERZO:* $${(this.real['almuerzo'] || 0).toLocaleString('de-DE')} / $${(this.metas['almuerzo'] || 0).toLocaleString('de-DE')}
🌙 *TARDE:* $${(this.real['tarde'] || 0).toLocaleString('de-DE')} / $${(this.metas['tarde'] || 0).toLocaleString('de-DE')}
---------------------------------------
📊 *META DÍA:* $${this.metaDelDiaCalculada.toLocaleString('de-DE')}
💰 *REAL DÍA:* $${this.sumaReal.toLocaleString('de-DE')}
${this.diferenciaTotal <= 0 ? '✅ *SUPERÁVIT*' : '❌ *FALTANTE*'}: $${Math.abs(this.diferenciaTotal).toLocaleString('de-DE')}
---------------------------------------`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  get todoCompleto(): boolean {
    return this.real['am'] > 0 && this.real['almuerzo'] > 0 && this.real['tarde'] > 0;
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
}