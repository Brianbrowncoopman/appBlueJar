import { Component, OnInit, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx'; // Librería para Excel
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
  downloadOutline
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
    IonSegment, IonSegmentButton, IonDatetime, IonDatetimeButton, IonModal, IonButton
  ]
})
export class InformesPage implements OnInit {
  private database: Database = inject(Database);
  private injector = inject(EnvironmentInjector);

  segmentoActivo: string = 'ventas'; 
  historialComedor: any[] = []; 
  historialVentas: any[] = [];   
  ventasFiltradas: any[] = [];
  fechaFiltro: string = new Date().toISOString().substring(0, 7);

  totalMetaMensual: number = 0;
  totalRealMensual: number = 0;
  diferenciaMensual: number = 0;

  chart: any;

  constructor() { 
    addIcons({ 
      calendarOutline, 
      documentTextOutline, 
      restaurantOutline,
      chevronDownOutline,
      cashOutline,
      trendingUpOutline,
      downloadOutline
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
        })).reverse();
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
            fecha: fecha,
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
    if (!this.fechaFiltro || this.historialVentas.length === 0) return;

    const [anio, mes] = this.fechaFiltro.split('-'); 
    const patron = `-${mes}-${anio}`;

    this.ventasFiltradas = this.historialVentas
      .filter(v => v.fecha.includes(patron))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + v.meta, 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + v.real, 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    setTimeout(() => this.generarGrafico(), 200);
  }

  generarGrafico() {
    const canvas = document.getElementById('ventasChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) this.chart.destroy();

    const labels = this.ventasFiltradas.map(v => v.fecha.split('-')[0]);
    const metas = this.ventasFiltradas.map(v => v.meta);
    const reales = this.ventasFiltradas.map(v => v.real);

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Meta',
            data: metas,
            borderColor: '#000000', // Negro para Metas
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#000000'
          },
          {
            label: 'Real',
            data: reales,
            borderColor: '#2ecc71', // Verde para Real
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#2ecc71'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  descargarExcel() {
    const datosExcel = this.ventasFiltradas.map(v => ({
      'Fecha': v.fecha,
      'Meta Diaria': v.meta,
      'Venta Real': v.real,
      'Diferencia': v.diferencia,
      'Estado': v.diferencia >= 0 ? 'Superávit' : 'Déficit'
    }));

    const ws = XLSX.utils.json_to_sheet(datosExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `Informe_${this.fechaFiltro}.xlsx`);
  }

  asString(value: any): string {
    return String(value || '');
  }
}