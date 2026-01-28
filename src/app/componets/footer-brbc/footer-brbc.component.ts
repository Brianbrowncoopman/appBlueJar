import { Component, inject } from '@angular/core'; 
import { IonFooter, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth'; 
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-brbc',
  standalone: true,
  imports: [IonFooter, IonToolbar, IonButton, IonIcon, CommonModule],
  template: `
    <ion-footer class="ion-no-border">
      <div class="footer-container">
        
        <div class="footer-firma">
          <span class="label">DESARROLLADO POR</span>
          <span class="marca">BRBC</span>
        </div>

        <ion-button fill="clear" size="small" (click)="salir()" class="logout-button">
          <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
        </ion-button>

      </div>
    </ion-footer>
  `,
  styles: [`
    ion-footer {
      background: white;
      border-top: 1px solid #f0f0f0;
      padding-bottom: var(--ion-safe-area-bottom, 0); 
      display: block;
    }
    .footer-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      height: 50px;
    }
    .footer-firma {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;
      margin-left: 40px;
    }
    .label {
      color: #aaa;
      font-size: 0.6rem;
      letter-spacing: 1px;
      margin: 0;
    }
    .marca {
      color: #3880ff;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 2px;
      margin: 0;
    }
    .logout-button {
      --color: #eb445a;
    }
  `]
})
export class FooterBrbcComponent {
  private authService = inject(AuthService);

  constructor() {
    addIcons({ logOutOutline });
  }

  async salir() {
    // Usamos el confirm nativo para probar rápido
    if (window.confirm('¿Cerrar sesión en el sistema?')) {
      await this.authService.logout();
    }
  }
}