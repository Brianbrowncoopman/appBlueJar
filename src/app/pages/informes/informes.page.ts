


import { Component, OnInit, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
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
  downloadOutline, statsChartOutline, logoWhatsapp, lockClosedOutline,
  thermometerOutline, cartOutline,
  chevronForwardOutline
} from 'ionicons/icons';

Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  providers: [DecimalPipe],
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

  historialPedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  fechaFiltro: string = new Date().toISOString().substring(0, 7);

  totalMetaMensual: number = 0;
  totalRealMensual: number = 0;
  diferenciaMensual: number = 0;

  chartVentas: any;
  chartComedor: any;

  constructor() { 
    addIcons({
      downloadOutline, lockClosedOutline, calendarOutline, 
      documentTextOutline, restaurantOutline, chevronDownOutline, 
      cashOutline, trendingUpOutline, statsChartOutline, 
      logoWhatsapp, thermometerOutline, cartOutline,
      chevronForwardOutline
    });
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.cargarHistorial();
      this.cargarDatosVentas();
      this.cargarTemperaturas();
      this.cargarPedidos();
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
    } catch (error) { console.error("Error comedor:", error); }
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
    } catch (error) { console.error("Error ventas:", error); }
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
    } catch (error) { console.error("Error temps:", error); }
  }

  /*aplicarFiltro() {
    if (!this.fechaFiltro) return;
    
    const fechaLimpia = this.fechaFiltro.split('T')[0];
    const partes = fechaLimpia.split('-');
    const anio = partes[0];
    const mes = partes[1];
    const patron = `-${mes}-${anio}`;

    this.ventasFiltradas = this.historialVentas
      .filter(v => v.fecha && v.fecha.includes(patron))
      .sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));

    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.meta) || 0), 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.real) || 0), 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    this.comedorFiltrado = this.historialComedor
      .filter(item => item.fecha && item.fecha.includes(patron))
      .sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));

    ['cocina', 'bodega', 'comedor'].forEach(area => {
      this.tempsFiltradas[area] = (this.historialTemps[area] || [])
        .filter((t: any) => t.fecha && t.fecha.includes(patron))
        .sort((a: any, b: any) => parseInt(a.fecha) - parseInt(b.fecha));
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
  }*/

  aplicarFiltro() {
    if (!this.fechaFiltro) return;
    
    // fechaFiltro viene como "2026-02" o "2026-02-11T..."
    const partes = this.fechaFiltro.split('-');
    const anio = partes[0];
    const mes = partes[1].substring(0, 2); // Asegura tomar solo los 2 dígitos del mes
    
    // El patrón debe ser "-02-2026" para coincidir con el formato DD-MM-YYYY de Firebase
    const patron = `-${mes}-${anio}`;

    // Filtrar Ventas
    this.ventasFiltradas = this.historialVentas
      .filter(v => v.fecha && v.fecha.includes(patron))
      .sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));

    // Filtrar Comedor (Aquí estaba el error)
    this.comedorFiltrado = this.historialComedor
      .filter(item => item.fecha && item.fecha.includes(patron))
      .sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));

    // Actualizar totales de ventas
    this.totalMetaMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.meta) || 0), 0);
    this.totalRealMensual = this.ventasFiltradas.reduce((acc, v) => acc + (Number(v.real) || 0), 0);
    this.diferenciaMensual = this.totalRealMensual - this.totalMetaMensual;

    // Filtrar Temperaturas
    ['cocina', 'bodega', 'comedor'].forEach(area => {
      this.tempsFiltradas[area] = (this.historialTemps[area] || [])
        .filter((t: any) => t.fecha && t.fecha.includes(patron))
        .sort((a: any, b: any) => parseInt(a.fecha) - parseInt(b.fecha));
    });

    // Totales de existencias para la tabla de comedor
    const mapa: { [key: string]: number } = {};
    this.comedorFiltrado.forEach(dia => {
      if (dia.existencias) {
        Object.entries(dia.existencias).forEach(([prod, cant]) => {
          mapa[prod] = (mapa[prod] || 0) + (Number(cant) || 0);
        });
      }
    });
    this.totalesExistencias = Object.entries(mapa)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad); // Ordenar por más vendidos

    this.pedidosFiltrados = this.historialPedidos
      .filter(p => p.fecha && p.fecha.includes(patron))
      .sort((a, b) => {
        // Ordenar por fecha descendente (más recientes primero)
        return (b.timestamp || 0) - (a.timestamp || 0);
      });

    
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
          { label: 'Meta', data: this.ventasFiltradas.map(v => v.meta), borderColor: '#adb5bd', borderDash: [5, 5], tension: 0.3 },
          { label: 'Real', data: this.ventasFiltradas.map(v => v.real), borderColor: '#1b365d', backgroundColor: 'rgba(27, 54, 93, 0.1)', fill: true, tension: 0.3 }
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
          backgroundColor: '#1b365d', borderRadius: 5
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  async compartirWhatsApp(fecha: string) {
    const venta = this.ventasFiltradas.find(v => v.fecha === fecha);
    const msg = `*REPORTE BLUE JAR - ${fecha}*\n📊 *META:* $${venta ? venta.meta.toLocaleString() : '0'}\n💰 *REAL:* $${venta ? venta.real.toLocaleString() : '0'}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  descargarExcel() {
    let datos: any[] = [];
    if (this.segmentoActivo === 'ventas') {
      datos = this.ventasFiltradas.map(v => ({ Fecha: v.fecha, Meta: v.meta, Real: v.real, Diferencia: v.diferencia }));
    } else if (this.segmentoActivo === 'comedor') {
      datos = this.totalesExistencias.map(t => ({ Producto: t.nombre.toUpperCase(), Total: t.cantidad }));
    } else if (this.segmentoActivo === 'pedidos') {
      this.pedidosFiltrados.forEach(p => {
        p.items.forEach((item: any) => {
          datos.push({
            Fecha: p.fecha,
            Hora: p.hora,
            Area: p.area.toUpperCase(),
            Producto: item.producto, // Arreglado de 'nombre' a 'producto'
            Cantidad: item.cantidad,
            Observaciones: p.observaciones || ''
          });
        });
      });
    } else {
      ['cocina', 'bodega', 'comedor'].forEach(area => {
        this.tempsFiltradas[area].forEach((d: any) => {
          Object.entries(d.equipos).forEach(([eq, h]: [string, any]) => {
            datos.push({ Area: area, Fecha: d.fecha, Equipo: eq, '07:00': h['07:00'], '14:00': h['14:00'], '21:00': h['21:00'] });
          });
        });
      });
    }
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
    XLSX.writeFile(wb, `Informe_BRBC_${this.segmentoActivo}.xlsx`);
  }

  // Funciones de ayuda para el HTML
  asString(value: any): string { return String(value || ''); }
  
  asNumber(value: any): number { 
    return value ? Number(value) : 0; 
  }

  async cargarPedidos() {
    const dbRef = ref(this.database, 'pedidos');
    try {
      const snapshot = await runInInjectionContext(this.injector, () => get(dbRef));
      const data = snapshot.val();
      
      if (data) {
        const pedidosTemporales: any[] = [];
        
        // Estructura: pedidos -> fecha -> area -> id_pedido
        Object.keys(data).forEach(fechaKey => {
          const areas = data[fechaKey];
          if (areas && typeof areas === 'object') {
            Object.keys(areas).forEach(areaKey => {
              const pedidosDeArea = areas[areaKey];
              if (pedidosDeArea && typeof pedidosDeArea === 'object') {
                Object.keys(pedidosDeArea).forEach(id => {
                  const pedido = pedidosDeArea[id];
                  pedidosTemporales.push({
                    id: id,
                    fecha: fechaKey,
                    area: areaKey,
                    // Aseguramos que existan las propiedades para evitar errores en el HTML
                    items: pedido.items || [],
                    hora: pedido.hora || '--:--',
                    timestamp: pedido.timestamp || 0,
                    observaciones: pedido.observaciones || ''
                  });
                });
              }
            });
          }
        });
        
        this.historialPedidos = pedidosTemporales;
        this.aplicarFiltro();
      }
    } catch (error) { 
      console.error("Error cargando pedidos:", error); 
    }

    



  }








}
