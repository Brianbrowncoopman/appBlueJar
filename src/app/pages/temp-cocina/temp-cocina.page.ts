/*import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { AuthService } from '../../services/auth';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
  IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
  IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-temp-cocina',
  templateUrl: './temp-cocina.page.html',
  styleUrls: ['./temp-cocina.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
    IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
    IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner,
    CommonModule, FormsModule, FooterBrbcComponent
  ]
})
export class TempCocinaPage implements OnInit {
  public authService = inject(AuthService);
  private database: Database = inject(Database);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Lista de los 6 equipos de Cocina según tu solicitud
  equipos = [
    { id: 'cocina_cong_1', nombre: 'congelador 1' },
    { id: 'cocina_cong_2', nombre: 'congelador 2' },
    { id: 'cocina_meso_1', nombre: 'meson refrigerado 1' },
    { id: 'cocina_meso_2', nombre: 'meson refrigerado 2' },
    { id: 'cocina_meso_3', nombre: 'meson refrigerado 3' },
    { id: 'cocina_refri_v', nombre: 'refrigerador verduras' }
  ];

  registros: any = {};

  constructor() {
    addIcons({ saveOutline });
    this.inicializarRegistros();
  }

  ngOnInit() {
    this.cargarDatos();
  }

  inicializarRegistros() {
    this.equipos.forEach(e => {
      this.registros[e.id] = { '07:00': null, '14:00': null, '21:00': null };
    });
  }

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = new Date(seleccion.getTime() + seleccion.getTimezoneOffset() * 60000)
      .toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    this.inicializarRegistros();
    this.cargarDatos();
  }

  cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `registros_temperatura/cocina/${fechaID}`);
    
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      this.inicializarRegistros(); 
      if (data) {
        Object.keys(data).forEach(equipoId => {
          if (this.registros[equipoId]) {
            this.registros[equipoId] = { ...this.registros[equipoId], ...data[equipoId] };
          }
        });
      }
    });
  }

  async guardarTodo() {
    this.authService.userProfile$.pipe(take(1)).subscribe(async (perfil) => {
      if (perfil && perfil.rol === 'lector') {
        alert('❌ No tienes permisos para modificar estos registros.');
        return;
      }

      const fechaID = this.fechaActual.replace(/\//g, '-');
      const dbRef = ref(this.database, `registros_temperatura/cocina/${fechaID}`);
      
      try {
        await set(dbRef, this.registros);
        alert('✅ Registros de Cocina guardados con éxito.');
      } catch (error) {
        alert('❌ Error al intentar guardar en la base de datos.');
      }
    });
  }
}*/




import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { AuthService } from '../../services/auth';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
  IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
  IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-temp-cocina',
  templateUrl: './temp-cocina.page.html',
  styleUrls: ['./temp-cocina.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
    IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
    IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner,
    CommonModule, FormsModule, FooterBrbcComponent
  ]
})
export class TempCocinaPage implements OnInit {
  public authService = inject(AuthService);
  private database: Database = inject(Database);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Nuevo listado de los 9 equipos adecuados a tu solicitud
  equipos = [
    { id: 'refri_1_prod', nombre: 'Refrigerador 1 producción' },
    { id: 'refri_2_desayuno', nombre: 'Refrigerador 2 desayuno' },
    { id: 'refri_3_cuarto_cal', nombre: 'Refrigerador 3 cuarto caliente' },
    { id: 'refri_4_cuarto_frio', nombre: 'Refrigerador 4 cuarto frío' },
    { id: 'refri_5_pastel', nombre: 'Refrigerador 5 Pasteleria' },
    { id: 'cong_1_pastel', nombre: 'Congelador 1 Pasteleria' },
    { id: 'cong_2_carnes', nombre: 'Congelador 2 carnes y proteínas' },
    { id: 'cong_3_prod', nombre: 'Congelador 3 producción' },
    { id: 'camara_vegetales', nombre: 'Cámara de frío vegetales' }
  ];

  registros: any = {};

  constructor() {
    addIcons({ saveOutline });
    this.inicializarRegistros();
  }

  ngOnInit() {
    this.cargarDatos();
  }

  inicializarRegistros() {
    this.equipos.forEach(e => {
      this.registros[e.id] = { '07:00': null, '14:00': null, '21:00': null };
    });
  }

  cambiarFecha(ev: any) {
    const seleccion = new Date(ev.detail.value);
    this.fechaActual = new Date(seleccion.getTime() + seleccion.getTimezoneOffset() * 60000)
      .toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    this.inicializarRegistros();
    this.cargarDatos();
  }

  cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `registros_temperatura/cocina/${fechaID}`);
    
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      this.inicializarRegistros(); 
      if (data) {
        Object.keys(data).forEach(equipoId => {
          if (this.registros[equipoId]) {
            this.registros[equipoId] = { ...this.registros[equipoId], ...data[equipoId] };
          }
        });
      }
    });
  }

  async guardarTodo() {
    this.authService.userProfile$.pipe(take(1)).subscribe(async (perfil) => {
      if (perfil && perfil.rol === 'lector') {
        alert('❌ No tienes permisos para modificar estos registros.');
        return;
      }

      const fechaID = this.fechaActual.replace(/\//g, '-');
      const dbRef = ref(this.database, `registros_temperatura/cocina/${fechaID}`);
      
      try {
        await set(dbRef, this.registros);
        alert('✅ Registros de Cocina guardados con éxito.');
      } catch (error) {
        alert('❌ Error al intentar guardar en la base de datos.');
      }
    });
  }
}