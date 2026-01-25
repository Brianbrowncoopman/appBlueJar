import { Component, OnInit, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
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
  statsChartOutline
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
  comedorFiltrado: any[] = []; // Nueva
  totalesExistencias: { nombre: string, cantidad: number }[] = []; // Nueva

  fechaFiltro: string = new Date().toISOString().substring(0, 7);

  totalMetaMensual: number = 0;
  totalRealMensual: number = 0;
  diferenciaMensual: number = 0;

  chartVentas: any;
  chartComedor: any;

  constructor() { 
    addIcons({ 
      calendarOutline, documentTextOutline, restaurantOutline,
      chevronDownOutline, cashOutline, trendingUpOutline, 
      downloadOutline, statsChartOutline
    });
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
          return { fecha, meta: metaTotal, real: realTotal, diferencia: realTotal - metaTotal };
        });
        this.aplicarFiltro();
      }
    } catch (error) {
      console.error("Error al procesar ventas:", error);
    }
  }

  aplicarFiltro() {
    if (!this.fechaFiltro) return;
    const [anio, mes] = this.fechaFiltro.split('-'); 
    const patron = `-${mes}-${anio}`;

    // Filtro Ventas
    this.ventasFiltradas = this.historialVentas
      .filter(v => v.fecha.includes(patron))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + v.meta, 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + v.real, 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    // Filtro Comedor
    this.comedorFiltrado = this.historialComedor
      .filter(item => item.fecha.includes(patron))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Calcular Totales Existencias
    const mapa: { [key: string]: number } = {};
    this.comedorFiltrado.forEach(dia => {
      if (dia.existencias) {
        Object.entries(dia.existencias).forEach(([prod, cant]) => {
          mapa[prod] = (mapa[prod] || 0) + Number(cant);
        });
      }
    });
    this.totalesExistencias = Object.entries(mapa).map(([nombre, cantidad]) => ({ nombre, cantidad }));

    setTimeout(() => {
      this.generarGraficoVentas();
      this.generarGraficoComedor();
    }, 300);
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
          { label: 'Meta', data: this.ventasFiltradas.map(v => v.meta), borderColor: '#000', tension: 0.3 },
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
          label: 'Platos Totales',
          data: this.comedorFiltrado.map(c => {
             return Object.values(c.existencias || {}).reduce((a: any, b: any) => Number(a) + Number(b), 0);
          }),
          backgroundColor: '#3880ff'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  descargarExcel() {
    const datos = this.segmentoActivo === 'ventas' ? this.ventasFiltradas : this.totalesExistencias;
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
    XLSX.writeFile(wb, `Informe_${this.segmentoActivo}_${this.fechaFiltro}.xlsx`);
  }

  asString(value: any): string { return String(value || ''); }
}