import { Component, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { inject } from '@angular/core'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, 
  IonCol, IonItem, IonLabel, IonText, IonCard, IonBadge,
  IonIcon, IonButton, IonCardHeader, IonCardTitle,
  IonDatetime, IonDatetimeButton, IonModal, IonButtons ,IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  calendarOutline, alertCircle, checkmarkCircle, closeCircleOutline, 
  sunnyOutline, fastFoodOutline, moonOutline, logoWhatsapp, shareOutline, 
  saveOutline, cloudUploadOutline, lockClosedOutline, checkmarkDoneCircle } from 'ionicons/icons'; 

@Component({
  selector: 'app-venta-dia',
  templateUrl: './venta-dia.page.html',
  styleUrls: ['./venta-dia.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonText, IonCard, 
    IonBadge, IonIcon, IonButton, IonCardHeader, IonCardTitle,
    IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonBackButton, FooterBrbcComponent
  ]
})
export class VentaDiaPage implements OnInit {

  private database: Database = inject(Database);
  private injector = inject(Injector);
  
  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  metas: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };
  real: { [key: string]: number } = { am: 0, almuerzo: 0, tarde: 0 };

  metasDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };
  realDisplay: { [key: string]: string } = { am: '', almuerzo: '', tarde: '' };

  constructor() {
    addIcons({saveOutline,cloudUploadOutline,checkmarkDoneCircle,logoWhatsapp,calendarOutline,alertCircle,checkmarkCircle,closeCircleOutline,sunnyOutline,fastFoodOutline,moonOutline,shareOutline,lockClosedOutline});
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {  
      this.escucharCambios();
    });
  }

  // Permite navegar a días anteriores
  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    
    // Reset local antes de cargar lo nuevo
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
      this.diaSalvado = snapshot.exists(); // Si existe en el histórico, diaSalvado será true
    });

    const dbRef = ref(this.database, 'ventas/' + fechaID);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Corrección de sintaxis en Object.assign
        if (data.metas) Object.assign(this.metas, data.metas);
        if (data.real) Object.assign(this.real, data.real);
        this.actualizarDisplays();
      } else {
        // Si no hay datos en esa fecha, limpiar pantalla
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

    const fechaID = this.fechaActual.replace(/\//g, '-');
    
    runInInjectionContext(this.injector, () => {
      const dbRef = ref(this.database, 'ventas/' + fechaID);
      set(dbRef, {
        metas: this.metas,
        real: this.real
      });
    });
  }

  // --- NUEVAS FUNCIONES DE CIERRE ---

  cerrarTurno(turno: string) {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const logRef = ref(this.database, `logs_turnos/${fechaID}/${turno}`);
    
    runInInjectionContext(this.injector, () => {
      set(logRef, {
        hora_registro: new Date().toLocaleTimeString(),
        meta: this.metas[turno],
        venta: this.real[turno]
      }).then(() => {
        alert(`Registro de turno ${turno.toUpperCase()} guardado.`);
      });
    });
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

  get todoCompleto(): boolean {
    // El botón se activa si hay al menos un valor real en cada turno
    return this.real['am'] > 0 && this.real['almuerzo'] > 0 && this.real['tarde'] > 0;
  }

  // --- UTILIDADES ---

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
    ☀️ *AM:* $${this.metasDisplay['am']} / $${this.realDisplay['am']}
    🍴 *ALMUERZO:* $${this.metasDisplay['almuerzo']} / $${this.realDisplay['almuerzo']}
    🌙 *TARDE:* $${this.metasDisplay['tarde']} / $${this.realDisplay['tarde']}
    ---------------------------------------
    📊 *TOTAL META:* $${this.metaDelDiaCalculada.toLocaleString('de-DE')}.-
    💰 *TOTAL REAL:* $${this.sumaReal.toLocaleString('de-DE')}.-
    ${this.diferenciaTotal > 0 ? '❌ *FALTAN:*' : '✅ *SOBRAN:*'} $${Math.abs(this.diferenciaTotal).toLocaleString('de-DE')}.-
        `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  diaSalvado: boolean = false;

  


} 