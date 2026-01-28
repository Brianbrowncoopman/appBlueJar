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
import { take } from 'rxjs'; // Importante para leer el rol una vez

@Component({
  selector: 'app-temp-bodega',
  templateUrl: './temp-bodega.page.html',
  styleUrls: ['./temp-bodega.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonGrid, IonRow, IonCol, IonCard, 
    IonCardHeader, IonCardTitle, IonLabel, IonDatetime, 
    IonDatetimeButton, IonModal, IonIcon, IonButton, IonSpinner,
    CommonModule, FormsModule, FooterBrbcComponent
  ]
})
export class TempBodegaPage implements OnInit {
  public authService = inject(AuthService);
  private database: Database = inject(Database);

  fechaActual: string = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Lista de equipos de Bodega (Tus equipos actualizados)
  equipos = [
    { id: 'bod_refri_1', nombre: 'Congelador Proteinas' },
    { id: 'bod_refri_2', nombre: 'congelador mixto' },
    { id: 'bod_refri_3', nombre: 'congelador Bollerias' },
    { id: 'bod_cong_1',  nombre: 'Congelador Panes' },
    { id: 'bod_cong_2',  nombre: 'Congelador Tremus' },
    { id: 'bod_refri_4', nombre: 'congelador hielo' }
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
    this.fechaActual = seleccion.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    this.inicializarRegistros();
    this.cargarDatos();
  }

  cargarDatos() {
    const fechaID = this.fechaActual.replace(/\//g, '-');
    const dbRef = ref(this.database, `registros_temperatura/bodega/${fechaID}`);
    
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
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
    // Verificación de seguridad por código
    this.authService.userProfile$.pipe(take(1)).subscribe(async (perfil) => {
      if (perfil.rol === 'lector') {
        alert('❌ No tienes permisos para guardar datos.');
        return;
      }

      const fechaID = this.fechaActual.replace(/\//g, '-');
      const dbRef = ref(this.database, `registros_temperatura/bodega/${fechaID}`);
      
      try {
        await set(dbRef, this.registros);
        alert('✅ Registros de Bodega guardados.');
      } catch (error) {
        console.error(error);
        alert('❌ Error al guardar en la base de datos.');
      }
    });
  }
}