import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importamos los componentes específicos para asegurar que carguen en el celular
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, 
  IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonList 
} from '@ionic/angular/standalone'; 

import { Database, ref, push, set } from '@angular/fire/database';
import { addIcons } from 'ionicons';
import { 
  saveOutline, 
  logoWhatsapp, 
  cartOutline, 
  addOutline, 
  trashOutline, 
  downloadOutline,
  refreshOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-pedidobodega',
  templateUrl: './pedidobodega.page.html',
  styleUrls: ['./pedidobodega.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    // Listamos los componentes aquí uno por uno
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, 
    IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, IonList
  ]
})
export class PedidoPage {
  [key: string]: any; 
  private database: Database = inject(Database);

  area: string = '';
  items: any[] = [{ producto: '', cantidad: null }]; 
  guardado: boolean = false;

  constructor() {
    addIcons({ 
      saveOutline, 
      logoWhatsapp, 
      cartOutline, 
      addOutline, 
      trashOutline, 
      downloadOutline,
      refreshOutline 
    });
  }

  agregarFila() {
    this.items.push({ producto: '', cantidad: null });
  }

  eliminarFila(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  async guardarPedido() {
    if (!this.area || this.items.some(i => !i.producto || i.cantidad === null || i.cantidad <= 0)) {
      alert("Por favor, selecciona el área y completa todos los productos.");
      return;
    }

    const fecha = new Date().toLocaleDateString('es-CL').replace(/\//g, '-');
    const dbRef = ref(this.database, `pedidos/${fecha}/${this.area}`);
    const nuevoPedidoRef = push(dbRef);

    try {
      await set(nuevoPedidoRef, {
        items: this.items,
        hora: new Date().toLocaleTimeString(),
        timestamp: Date.now()
      });
      
      this.guardado = true;
      alert("✅ Pedido guardado y registrado correctamente.");
    } catch (error) {
      console.error("Error Firebase:", error);
      alert("❌ Error al guardar en la base de datos.");
    }
  }

  enviarWhatsApp() {
    const fecha = new Date().toLocaleDateString('es-CL');
    let listaTexto = '';
    
    this.items.forEach(item => {
      listaTexto += `• *${item.producto}*: ${item.cantidad}\n`;
    });

    const mensaje = `*📦 PEDIDO DE BODEGA*\n` +
                    `--------------------------\n` +
                    `🏢 *Área:* ${this.area.toUpperCase()}\n` +
                    `📅 *Fecha:* ${fecha}\n` +
                    `--------------------------\n` +
                    `${listaTexto}` +
                    `--------------------------\n` +
                    `_Enviado desde App CSB Moneda_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  reiniciarFormulario() {
    this.area = '';
    this.items = [{ producto: '', cantidad: null }];
    this.guardado = false;
  }
}