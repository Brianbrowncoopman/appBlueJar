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
import { cloudUploadOutline, saveOutline } from 'ionicons/icons';
import { FooterBrbcComponent } from 'src/app/componets/footer-brbc/footer-brbc.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-temp-comedor',
  templateUrl: './temp-comedor.page.html',
  styleUrls: ['./temp-comedor.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
    IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
    IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner,
    CommonModule, FormsModule, FooterBrbcComponent
  ]
})
export class TempComedorPage implements OnInit {
  public authService = inject(AuthService);
  private database: Database = inject(Database);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  equipos = [
    { id: 'equipo_1', nombre: 'equipo 1' },
    { id: 'equipo_2', nombre: 'equipo 2' },
    { id: 'equipo_3', nombre: 'equipo 3' },
    { id: 'equipo_4', nombre: 'equipo 4' },
    { id: 'equipo_5', nombre: 'equipo 5' },
    { id: 'equipo_6', nombre: 'equipo 6' },
    { id: 'equipo_7', nombre: 'equipo 7' },
    { id: 'equipo_8', nombre: 'equipo 8' }
  ];

  registros: any = {};

  constructor() {
    addIcons({ cloudUploadOutline, saveOutline });
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
    // Ajuste para evitar desfase de zona horaria al seleccionar fecha
    this.fechaActual = new Date(seleccion.getTime() + seleccion.getTimezoneOffset() * 60000)
      .toLocaleDateString('es-CL', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    this.inicializarRegistros();
    this.cargarDatos();
  }

  cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `registros_temperatura/comedor/${fechaID}`);
    
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      this.inicializarRegistros(); // Limpiamos para asegurar datos frescos
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
        alert('❌ No tienes permisos para guardar.');
        return;
      }

      const fechaID = this.fechaActual.replace(/\//g, '-');
      const dbRef = ref(this.database, `registros_temperatura/comedor/${fechaID}`);
      
      try {
        await set(dbRef, this.registros);
        alert('✅ Registros del Comedor guardados correctamente.');
      } catch (error) {
        alert('❌ Error al guardar en la base de datos.');
      }
    });
  }
}