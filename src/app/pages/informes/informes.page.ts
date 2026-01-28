/*import { Component, OnInit, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import * as XLSX from 'xlsx';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
  IonIcon, IonAccordionGroup, IonAccordion, IonItem, 
  IonLabel, IonList, IonListHeader, IonBadge,
  IonSegment, IonSegmentButton, IonDatetime, IonDatetimeButton, IonModal, IonButton
} from '@ionic/angular/standalone';
import { Database, ref, get } from '@angular/fire/database';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  documentTextOutline, 
  restaurantOutline,
  chevronDownOutline,
  cashOutline,
  trendingUpOutline,
  downloadOutline,
  statsChartOutline, logoWhatsapp, lockClosedOutline } from 'ionicons/icons';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DecimalPipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
    IonIcon, IonAccordionGroup, IonAccordion, IonItem, 
    IonLabel, IonList, IonListHeader, IonBadge,
    IonSegment, IonSegmentButton, IonDatetime, IonDatetimeButton, IonModal, IonButton, FooterBrbcComponent
  ]
})
export class InformesPage implements OnInit {
  
  private database: Database = inject(Database);
  private injector = inject(EnvironmentInjector);

  segmentoActivo: string = 'ventas'; 
  historialComedor: any[] = []; 
  historialVentas: any[] = [];   
  ventasFiltradas: any[] = [];
  comedorFiltrado: any[] = [];
  totalesExistencias: { nombre: string, cantidad: number }[] = [];

  fechaFiltro: string = new Date().toISOString().substring(0, 7);

  totalMetaMensual: number = 0;
  totalRealMensual: number = 0;
  diferenciaMensual: number = 0;

  chartVentas: any;
  chartComedor: any;

  constructor() { 
    addIcons({downloadOutline,lockClosedOutline,calendarOutline,documentTextOutline,restaurantOutline,chevronDownOutline,cashOutline,trendingUpOutline,statsChartOutline,logoWhatsapp});
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.cargarHistorial();
      this.cargarDatosVentas();
    });
  }

  async cargarHistorial() {
    const dbRef = ref(this.database, 'comedor');
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      if (data) {
        this.historialComedor = Object.keys(data).map(fecha => ({
          fecha: fecha,
          ...data[fecha]
        }));
        this.aplicarFiltro();
      }
    } catch (error) {
      console.error("Error al cargar historial comedor:", error);
    }
  }

  async cargarDatosVentas() {
    const dbRef = ref(this.database, 'ventas'); 
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      if (data) {
        this.historialVentas = Object.keys(data).map(fecha => {
          const d = data[fecha];
          const metaTotal = (Number(d.metas?.am) || 0) + (Number(d.metas?.almuerzo) || 0) + (Number(d.metas?.tarde) || 0);
          const realTotal = (Number(d.real?.am) || 0) + (Number(d.real?.almuerzo) || 0) + (Number(d.real?.tarde) || 0);
          return { 
            fecha, 
            meta: metaTotal, 
            real: realTotal, 
            diferencia: realTotal - metaTotal 
          };
        });
        this.aplicarFiltro();
      }
    } catch (error) {
      console.error("Error al procesar ventas:", error);
    }
  }

  aplicarFiltro() {
    if (!this.fechaFiltro) return;
    const fechaLimpia = this.fechaFiltro.split('T')[0];
    const partes = fechaLimpia.split('-');
    const anio = partes[0];
    const mes = partes[1];
    const patron = `-${mes}-${anio}`;

    this.ventasFiltradas = this.historialVentas
      .filter(v => v.fecha && v.fecha.includes(patron))
      .sort((a, b) => {
        const diaA = parseInt(a.fecha.split('-')[0]);
        const diaB = parseInt(b.fecha.split('-')[0]);
        return diaA - diaB;
      });

    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.meta) || 0), 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.real) || 0), 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    this.comedorFiltrado = this.historialComedor
      .filter(item => item.fecha && item.fecha.includes(patron))
      .sort((a, b) => {
        const diaA = parseInt(a.fecha.split('-')[0]);
        const diaB = parseInt(b.fecha.split('-')[0]);
        return diaA - diaB;
      });

    const mapa: { [key: string]: number } = {};
    this.comedorFiltrado.forEach(dia => {
      if (dia.existencias) {
        Object.entries(dia.existencias).forEach(([prod, cant]) => {
          mapa[prod] = (mapa[prod] || 0) + (Number(cant) || 0);
        });
      }
    });
    this.totalesExistencias = Object.entries(mapa).map(([nombre, cantidad]) => ({ nombre, cantidad }));

    setTimeout(() => {
      this.generarGraficoVentas();
      this.generarGraficoComedor();
    }, 400);
  }

  generarGraficoVentas() {
    const canvas = document.getElementById('ventasChart') as HTMLCanvasElement;
    if (!canvas || this.ventasFiltradas.length === 0) return;
    if (this.chartVentas) this.chartVentas.destroy();
    this.chartVentas = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.ventasFiltradas.map(v => v.fecha.split('-')[0]),
        datasets: [
          { label: 'Meta', data: this.ventasFiltradas.map(v => v.meta), borderColor: '#555', borderDash: [5, 5], tension: 0.3 },
          { label: 'Real', data: this.ventasFiltradas.map(v => v.real), borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', fill: true, tension: 0.3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } } }
    });
  }

  generarGraficoComedor() {
    const canvas = document.getElementById('comedorChart') as HTMLCanvasElement;
    if (!canvas || this.comedorFiltrado.length === 0) return;
    if (this.chartComedor) this.chartComedor.destroy();
    this.chartComedor = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.comedorFiltrado.map(c => c.fecha.split('-')[0]),
        datasets: [{
          label: 'Platos Totales',
          data: this.comedorFiltrado.map(c => Object.values(c.existencias || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0)),
          backgroundColor: '#3880ff', borderRadius: 5
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  }

  async compartirWhatsApp(fecha: string) {
    // 1. Buscamos el día en el array que YA TENEMOS cargado en la tabla
    const venta = this.ventasFiltradas.find(v => v.fecha === fecha);
    
    // 2. Si no lo encuentra, usaremos datos de prueba para ver si el mensaje cambia
    const msg = `*REPORTE DE VENTAS - ${fecha}*
  ---------------------------------------
  📊 *META TOTAL:* $${venta ? venta.meta.toLocaleString() : '0'}
  💰 *REAL TOTAL:* $${venta ? venta.real.toLocaleString() : '0'}
  ⚖️ *DIFERENCIA:* $${venta ? venta.diferencia.toLocaleString() : '0'}
  ---------------------------------------
  ✅ *ESTADO:* Si ves esto, el código se actualizó.`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  descargarExcel() {
    let datosParaExportar = [];
    if (this.segmentoActivo === 'ventas') {
      datosParaExportar = this.ventasFiltradas.map(v => ({ Fecha: v.fecha, Meta: v.meta, Real: v.real, Diferencia: v.diferencia }));
    } else {
      datosParaExportar = this.totalesExistencias.map(t => ({ Producto: t.nombre.toUpperCase(), Cantidad_Total: t.cantidad }));
    }
    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
    XLSX.writeFile(wb, `Informe_${this.segmentoActivo}_${this.fechaFiltro.split('T')[0]}.xlsx`);
  }

  asString(value: any): string { return String(value || ''); }
}*/
import { Component, OnInit, inject, runInInjectionContext, EnvironmentInjector, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { AuthService } from '../../services/auth';
import * as XLSX from 'xlsx';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, 
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
  IonIcon, IonAccordionGroup, IonAccordion, IonItem, 
  IonLabel, IonList, IonListHeader, IonBadge, IonSpinner,
  IonSegment, IonSegmentButton, IonDatetime, IonDatetimeButton, IonModal, IonButton
} from '@ionic/angular/standalone';
import { Database, ref, get } from '@angular/fire/database';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, documentTextOutline, restaurantOutline,
  chevronDownOutline, cashOutline, trendingUpOutline, 
  downloadOutline, statsChartOutline, logoWhatsapp, lockClosedOutline
} from 'ionicons/icons';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DecimalPipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
    IonIcon, IonAccordionGroup, IonAccordion, IonItem, 
    IonLabel, IonList, IonListHeader, IonBadge, IonSpinner,
    IonSegment, IonSegmentButton, IonDatetime, IonDatetimeButton, IonModal, IonButton, FooterBrbcComponent
  ]
})
export class InformesPage implements OnInit {
  public authService = inject(AuthService);
  private database: Database = inject(Database);
  private injector = inject(EnvironmentInjector);

  segmentoActivo: string = 'ventas'; 
  historialComedor: any[] = []; 
  historialVentas: any[] = [];
  historialTemps: any = { cocina: [], bodega: [], comedor: [] };

  ventasFiltradas: any[] = [];
  comedorFiltrado: any[] = [];
  tempsFiltradas: any = { cocina: [], bodega: [], comedor: [] };
  totalesExistencias: { nombre: string, cantidad: number }[] = [];

  fechaFiltro: string = new Date().toISOString().substring(0, 7);
  totalMetaMensual: number = 0;
  totalRealMensual: number = 0;
  diferenciaMensual: number = 0;

  chartVentas: any;
  chartComedor: any;

  constructor() { 
    addIcons({downloadOutline,lockClosedOutline,calendarOutline,documentTextOutline,restaurantOutline,chevronDownOutline,cashOutline,trendingUpOutline,statsChartOutline,logoWhatsapp});
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.cargarHistorial();
      this.cargarDatosVentas();
      this.cargarTemperaturas();
    });
  }

  async cargarHistorial() {
    const dbRef = ref(this.database, 'comedor');
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      if (data) {
        this.historialComedor = Object.keys(data).map(fecha => ({ fecha, ...data[fecha] }));
        this.aplicarFiltro();
      }
    } catch (error) { console.error(error); }
  }

  async cargarDatosVentas() {
    const dbRef = ref(this.database, 'ventas'); 
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      if (data) {
        this.historialVentas = Object.keys(data).map(fecha => {
          const d = data[fecha];
          const metaTotal = (Number(d.metas?.am) || 0) + (Number(d.metas?.almuerzo) || 0) + (Number(d.metas?.tarde) || 0);
          const realTotal = (Number(d.real?.am) || 0) + (Number(d.real?.almuerzo) || 0) + (Number(d.real?.tarde) || 0);
          return { fecha, meta: metaTotal, real: realTotal, diferencia: realTotal - metaTotal };
        });
        this.aplicarFiltro();
      }
    } catch (error) { console.error(error); }
  }

  async cargarTemperaturas() {
    const dbRef = ref(this.database, 'registros_temperatura');
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      if (data) {
        ['cocina', 'bodega', 'comedor'].forEach(area => {
          if (data[area]) {
            this.historialTemps[area] = Object.keys(data[area]).map(fecha => ({
              fecha: fecha,
              equipos: data[area][fecha]
            }));
          }
        });
        this.aplicarFiltro();
      }
    } catch (error) { console.error(error); }
  }

  aplicarFiltro() {
    if (!this.fechaFiltro) return;
    const [anio, mes] = this.fechaFiltro.split('T')[0].split('-');
    const patron = `-${mes}-${anio}`;

    this.ventasFiltradas = this.historialVentas.filter(v => v.fecha.includes(patron)).sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));
    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + (v.meta || 0), 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + (v.real || 0), 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    this.comedorFiltrado = this.historialComedor.filter(item => item.fecha.includes(patron)).sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));

    ['cocina', 'bodega', 'comedor'].forEach(area => {
      this.tempsFiltradas[area] = this.historialTemps[area].filter((t: any) => t.fecha.includes(patron)).sort((a: any, b: any) => parseInt(a.fecha) - parseInt(b.fecha));
    });

    const mapa: { [key: string]: number } = {};
    this.comedorFiltrado.forEach(dia => {
      if (dia.existencias) {
        Object.entries(dia.existencias).forEach(([prod, cant]) => {
          mapa[prod] = (mapa[prod] || 0) + (Number(cant) || 0);
        });
      }
    });
    this.totalesExistencias = Object.entries(mapa).map(([nombre, cantidad]) => ({ nombre, cantidad }));

    setTimeout(() => { this.generarGraficoVentas(); this.generarGraficoComedor(); }, 400);
  }

  generarGraficoVentas() {
    const canvas = document.getElementById('ventasChart') as HTMLCanvasElement;
    if (!canvas || this.ventasFiltradas.length === 0) return;
    if (this.chartVentas) this.chartVentas.destroy();
    this.chartVentas = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.ventasFiltradas.map(v => v.fecha.split('-')[0]),
        datasets: [
          { label: 'Meta', data: this.ventasFiltradas.map(v => v.meta), borderColor: '#555', borderDash: [5, 5], tension: 0.3 },
          { label: 'Real', data: this.ventasFiltradas.map(v => v.real), borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', fill: true, tension: 0.3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  generarGraficoComedor() {
    const canvas = document.getElementById('comedorChart') as HTMLCanvasElement;
    if (!canvas || this.comedorFiltrado.length === 0) return;
    if (this.chartComedor) this.chartComedor.destroy();
    this.chartComedor = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.comedorFiltrado.map(c => c.fecha.split('-')[0]),
        datasets: [{
          label: 'Platos',
          data: this.comedorFiltrado.map(c => Object.values(c.existencias || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0)),
          backgroundColor: '#3880ff'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  async compartirWhatsApp(fecha: string) {
    const venta = this.ventasFiltradas.find(v => v.fecha === fecha);
    const msg = `*REPORTE DE VENTAS - ${fecha}*\n📊 *META:* $${venta?.meta.toLocaleString()}\n💰 *REAL:* $${venta?.real.toLocaleString()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  descargarExcel() {
    let datosParaExportar: any[] = [];
    if (this.segmentoActivo === 'ventas') {
      datosParaExportar = this.ventasFiltradas.map(v => ({ Fecha: v.fecha, Meta: v.meta, Real: v.real, Diferencia: v.diferencia }));
    } else if (this.segmentoActivo === 'comedor') {
      datosParaExportar = this.totalesExistencias.map(t => ({ Producto: t.nombre.toUpperCase(), Cantidad: t.cantidad }));
    } else {
      ['cocina', 'bodega', 'comedor'].forEach(area => {
        this.tempsFiltradas[area].forEach((d: any) => {
          Object.entries(d.equipos).forEach(([eq, h]: [string, any]) => {
            datosParaExportar.push({ Área: area, Fecha: d.fecha, Equipo: eq, '07:00': h['07:00'], '14:00': h['14:00'], '21:00': h['21:00'] });
          });
        });
      });
    }
    const ws = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
    XLSX.writeFile(wb, `Informe_${this.segmentoActivo}.xlsx`);
  }

  asString(value: any): string { return String(value || ''); }
}