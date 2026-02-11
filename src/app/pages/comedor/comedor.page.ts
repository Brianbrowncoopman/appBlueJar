/*import { Component, OnInit, inject, Injector, runInInjectionContext } from '@angular/core'; // Añadimos inject aquí
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
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
    IonItemGroup, IonItemDivider, IonButton, FooterBrbcComponent // <--- TAMBIÉN AGRÉGALOS AQUÍ
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


}*/







import { Component, OnInit, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { Database, ref, set, get } from '@angular/fire/database';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonDatetime, IonDatetimeButton, IonModal,
  IonItem, IonInput, IonLabel, IonIcon, IonText,
  IonGrid, IonRow, IonCol, IonButton,
  IonItemGroup, IonItemDivider 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, restaurantOutline, leafOutline, iceCreamOutline, 
  wineOutline, arrowBackOutline, logoWhatsapp, fastFoodOutline, 
  fishOutline, waterOutline, flaskOutline, pizzaOutline, starOutline 
} from 'ionicons/icons';

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
    IonItemGroup, IonItemDivider, IonButton, FooterBrbcComponent
  ]
})
export class ComedorPage implements OnInit {

  private database: Database = inject(Database);
  private injector = inject(Injector);
  private router = inject(Router);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Objeto Minuta actualizado con todos los nuevos campos solicitados
  minuta = {
    entrada: '',
    fondo: '',
    postre: '',
    pasta: '',
    especialChef: '',
    sandwichChef: '',
    pescado: '',
    croquetas: '',
    ceviche: '',
    sopa: '',
    jugo: '',
    mocktail: '',
    cocktail: ''
  };

  plazas: any = {
    Salon: { g1: '', g2: '' },
    Bosque: { g1: '', g2: '' },
    Terraza: { g1: '', g2: '' }
  };

  existencias: { [key: string]: string } = {};
  catEntradas = ['Croquetas del día', 'Ceviche del día', 'Sopa del día', 'Camarones rebozados', 'Empanadas de carne', 'Tártaro de filete', 'Bruschetta capresse'];
  catSandwiches = ['Pescado frito', 'Falafel', 'Pulled Pork', 'Churrasco', 'Especial de chef'];
  catEnsaladas = ['César', 'César camarón', 'César pollo', 'Quinoa', 'Peruana', 'Filete', 'Falafel'];
  catFondos = ['Curry de pollo', 'Bj burguer', 'Fish and chips', 'Pescado del día', 'Doble Bj burger', 'Escalopa de pollo', 'Pasta del día', 'Curry camarón', 'Curry vegetales', 'Lomo vetado', 'Filete', 'Especial del chef'];
  catPostres = ['Creambrulee', 'Tiramisú', 'Churritos', 'Cheesecake', 'Pavlova', 'Frutillas a la crema', 'Napoleón'];

  constructor() {
    addIcons({
      leafOutline, restaurantOutline, iceCreamOutline, wineOutline, 
      logoWhatsapp, calendarOutline, arrowBackOutline, fastFoodOutline, 
      fishOutline, waterOutline, flaskOutline, pizzaOutline, starOutline
    });
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.cargarDatos();
    });
  }

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    this.cargarDatos();
  }

  /*async cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    try {
      const snapshot = await get(dbRef);
      const data = snapshot.val();
      
      if (data) {
        // Combinamos para asegurar que campos nuevos no den error si no existen en registros viejos
        this.minuta = { ...this.minuta, ...data.minuta };
        this.plazas = { ...this.plazas, ...data.plazas };
        this.existencias = { ...data.existencias };
      } else {
        this.limpiarCampos();
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }*/

  async cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    try {
      const snapshot = await get(dbRef);
      const data = snapshot.val();
      
      if (data) {
        this.minuta = { ...this.minuta, ...data.minuta };
        
        // FORZAMOS la carga manual de plazas para evitar errores de llaves
        if (data.plazas) {
          this.plazas = {
            'Salon': { 
              g1: data.plazas['Salon']?.g1 || data.plazas['Salon ']?.g1 || '', 
              g2: data.plazas['Salon']?.g2 || data.plazas['Salon ']?.g2 || '' 
            },
            'Bosque': { 
              g1: data.plazas['Bosque']?.g1 || '', 
              g2: data.plazas['Bosque']?.g2 || '' 
            },
            'Terraza': { 
              g1: data.plazas['Terraza']?.g1 || '', 
              g2: data.plazas['Terraza']?.g2 || '' 
            }
          };
        }
        this.existencias = data.existencias || {};
      } else {
        this.limpiarCampos();
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  /*limpiarCampos() {
    this.minuta = {
      entrada: '', fondo: '', postre: '', pasta: '', especialChef: '',
      sandwichChef: '', pescado: '', croquetas: '', ceviche: '',
      sopa: '', jugo: '', mocktail: '', cocktail: ''
    };
    this.plazas = {
      Salon: { g1: '', g2: '' },
      Bosque: { g1: '', g2: '' },
      Terraza: { g1: '', g2: '' }
    };
    this.existencias = {};
  }*/

  limpiarCampos() {
    this.minuta = {
      entrada: '', fondo: '', postre: '', pasta: '', especialChef: '',
      sandwichChef: '', pescado: '', croquetas: '', ceviche: '',
      sopa: '', jugo: '', mocktail: '', cocktail: ''
    };
    this.plazas = {
      'Salon': { g1: '', g2: '' },
      'Bosque': { g1: '', g2: '' },
      'Terraza': { g1: '', g2: '' }
    };
    this.existencias = {};
  }

  /*guardarFirebase() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    set(dbRef, {
      minuta: this.minuta,
      plazas: this.plazas,
      existencias: this.existencias
    }).catch(error => console.error("Error al guardar:", error));
  }*/
  guardarFirebase() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, 'comedor/' + fechaID);
    
    // Al guardar, definimos las llaves manualmente para "limpiar" Firebase
    set(dbRef, {
      minuta: this.minuta,
      plazas: {
        'Salon': this.plazas['Salon'],
        'Bosque': this.plazas['Bosque'],
        'Terraza': this.plazas['Terraza']
      },
      existencias: this.existencias
    }).catch(error => console.error("Error al guardar:", error));
  }

  finalizarYEnviar() {
    // 1. Construimos el cuerpo del mensaje en una variable de texto normal
    let texto = `*REPORTE COMEDOR - ${this.fechaActual}*\n\n`;

    texto += `*--- MINUTA DEL DÍA ---*\n`;
    if(this.minuta.entrada) texto += `🥗 Entrada: ${this.minuta.entrada}\n`;
    if(this.minuta.fondo) texto += `🍽️ Fondo: ${this.minuta.fondo}\n`;
    if(this.minuta.pasta) texto += `🍝 Pasta: ${this.minuta.pasta}\n`;
    if(this.minuta.pescado) texto += `🐟 Pescado: ${this.minuta.pescado}\n`;
    if(this.minuta.ceviche) texto += `🍋 Ceviche: ${this.minuta.ceviche}\n`;
    if(this.minuta.sopa) texto += `🍲 Sopa: ${this.minuta.sopa}\n`;
    if(this.minuta.croquetas) texto += `🧆 Croquetas: ${this.minuta.croquetas}\n`;
    if(this.minuta.especialChef) texto += `👨‍🍳 Especial Chef: ${this.minuta.especialChef}\n`;
    if(this.minuta.sandwichChef) texto += `🥪 Sandwich Chef: ${this.minuta.sandwichChef}\n`;
    if(this.minuta.postre) texto += `🍰 Postre: ${this.minuta.postre}\n`;
    if(this.minuta.jugo) texto += `🥤 Jugo: ${this.minuta.jugo}\n`;
    if(this.minuta.mocktail) texto += `🍹 Mocktail: ${this.minuta.mocktail}\n`;
    if(this.minuta.cocktail) texto += `🍸 Cocktail: ${this.minuta.cocktail}\n`;
    
    texto += `\n*--- RESPONSABLES PLAZAS ---*\n`;
    const nombresPlazas = ['Salon', 'Bosque', 'Terraza'];
    
    nombresPlazas.forEach(p => {
      const datosPlaza = this.plazas[p];
      if (datosPlaza) {
        // Convertimos a String antes de usar trim() para evitar errores
        const g1 = String(datosPlaza.g1 || '').trim();
        const g2 = String(datosPlaza.g2 || '').trim();
        
        if (g1 || g2) {
          let garzones = [g1, g2].filter(g => g !== '').join(' - ');
          texto += `📍 *${p}:* ${garzones}\n`;
        }
      }
    });

    texto += `\n*--- STOCK DISPONIBLE ---*\n`;
    const formatearSeccion = (titulo: string, lista: string[]) => {
      let sub = `_*${titulo}*_\n`;
      let hayDisponibles = false;
      
      lista.forEach(item => {
        const valor = this.existencias[item];
        const cantidad = parseInt(valor);
        if (valor !== undefined && valor !== null && cantidad > 0) {
          sub += `- ${item}: *${cantidad}*\n`;
          hayDisponibles = true;
        }
      });
      return hayDisponibles ? sub + `\n` : '';
    };

    texto += formatearSeccion('ENTRADAS', this.catEntradas);
    texto += formatearSeccion('SÁNDWICHES', this.catSandwiches);
    texto += formatearSeccion('ENSALADAS', this.catEnsaladas);
    texto += formatearSeccion('FONDOS', this.catFondos);
    texto += formatearSeccion('POSTRES', this.catPostres);

    // 2. Codificamos TODO el mensaje al final para evitar errores de símbolos
    const mensajeFinal = encodeURIComponent(texto);
    const url = `https://wa.me/?text=${mensajeFinal}`;
    window.open(url, '_blank');
  }
}
