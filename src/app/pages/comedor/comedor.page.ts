import { Component, OnInit, inject, Injector, runInInjectionContext } from '@angular/core'; // Añadimos inject aquí
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue, get } from '@angular/fire/database';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonDatetime, IonDatetimeButton, IonModal,
  IonItem, IonInput, IonLabel, IonIcon, IonText,
  IonGrid, IonRow, IonCol, IonButton,
  IonItemGroup, IonItemDivider // <--- ESTOS SON LOS QUE FALTABAN
} from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // Importado correctamente
import { addIcons } from 'ionicons';
import { calendarOutline, restaurantOutline, leafOutline, iceCreamOutline, wineOutline, arrowBackOutline, logoWhatsapp } from 'ionicons/icons';


@Component({
  selector: 'app-comedor',
  templateUrl: './comedor.page.html',
  styleUrls: ['./comedor.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonBackButton, IonDatetime, IonDatetimeButton, IonModal,
    IonItem, IonInput, IonLabel, IonIcon, IonText,
    IonGrid, IonRow, IonCol,
    IonItemGroup, IonItemDivider, IonButton // <--- TAMBIÉN AGRÉGALOS AQUÍ
  ]
})
export class ComedorPage implements OnInit {

  private database: Database = inject(Database);
  private injector = inject(Injector);

  // Inyectamos el router correctamente
  private router = inject(Router);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  minuta = {
    entrada: '',
    plato: '',
    postre: '',
    bebida: ''

  };

  constructor() {
  addIcons({leafOutline,restaurantOutline,iceCreamOutline,
    wineOutline,logoWhatsapp,calendarOutline,
    arrowBackOutline});
}

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.cargarDatos();
    });
  }

  // Eliminé irAComedor() porque ya estás en la página Comedor.
  // Si necesitas navegar a otra parte, usa this.router.navigate...

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    this.cargarDatos();
    // Aquí vendrá la lógica de Firebase onValue() similar a Ventas
  }

  plazas: { [key: string]: string} = {
    p1: '', p2: '', p3:  '', p4: '' , p6: ''
  };

  async cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    try {
      const snapshot = await get(dbRef); // Usamos get para leer una sola vez
      const data = snapshot.val();
      
      if (data) {
        // Usamos copias para no perder la referencia de los objetos
        this.minuta = { ...this.minuta, ...data.minuta };
        this.plazas = { ...this.plazas, ...data.plazas };
        this.existencias = { ...data.existencias };
      } else {
        // Si no hay datos, limpiamos todo
        this.minuta = { entrada: '', plato: '', postre: '', bebida: '' };
        this.plazas = { p1: '', p2: '', p3: '', p4: '', p6: '' };
        this.existencias = {};
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  guardarFirebase() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    // Guardamos el objeto completo
    set(dbRef, {
      minuta: this.minuta,
      plazas: this.plazas,
      existencias: this.existencias
    }).catch(error => console.error("Error al guardar:", error));
  }

  // Listados para el control del HTML
  platosEnsaladas = ['loire', 'quiche', 'naturista', 'tabule'];
  platosFondos = ['lomo salteado', 'cordon', 'filete', 'costillas', 'salmon', 'atun', 'bourgignon', 'florentin', 'mar y tierra'];

  // Objeto que guardará los datos
  existencias: { [key: string]: string } = {};


  finalizarYEnviar() {
  // 1. Construcción del encabezado
  let mensaje = `*REPORTE COMEDOR - ${this.fechaActual}*%0A%0A`;

  // 2. Sección Minuta
  mensaje += `*--- MINUTA DEL DÍA ---*%0A`;
  mensaje += `🥗 Entrada: ${this.minuta.entrada || 'No definida'}%0A`;
  mensaje += `🍽️ Plato: ${this.minuta.plato || 'No definido'}%0A`;
  mensaje += `🍰 Postre: ${this.minuta.postre || 'No definido'}%0A`;
  mensaje += `🥤 Bebida: ${this.minuta.bebida || 'No definida'}%0A%0A`;

  // 3. Sección Plazas
  mensaje += `*--- RESPONSABLES PLAZAS ---*%0A`;
  for (let p of ['p1', 'p2', 'p3', 'p4', 'p6']) {
    mensaje += `${p.toUpperCase()}: ${this.plazas[p] || 'Sin asignar'}%0A`;
  }
  mensaje += `%0A`;

  // 4. Sección Existencias (Solo las que tengan algo escrito)
  mensaje += `*--- STOCK ACTUAL ---*%0A`;
  
  // Ensaladas
  mensaje += `_Ensaladas:_%0A`;
  this.platosEnsaladas.forEach(p => {
    if (this.existencias[p]) mensaje += `- ${p.toUpperCase()}: ${this.existencias[p]}%0A`;
  });

  // Fondos
  mensaje += `%0A_Fondos:_%0A`;
  this.platosFondos.forEach(p => {
    if (this.existencias[p]) mensaje += `- ${p.toUpperCase()}: ${this.existencias[p]}%0A`;
  });

  // 5. Abrir WhatsApp
  const url = `https://wa.me/?text=${mensaje}`;
  window.open(url, '_blank');
}


}
