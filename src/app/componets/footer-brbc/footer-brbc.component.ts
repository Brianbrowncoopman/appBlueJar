import { Component } from '@angular/core'; 
import { IonFooter, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer-brbc',
  template: `
    <ion-footer class="ion-no-border">
      <div class="footer-firma">
        <span class="label">DESARROLLADO POR</span>
        <span class="marca">BRBC</span>
      </div>
    </ion-footer>
  `,
  styles: [`
    ion-footer {
      background: white;
      display: block;
      /* Asegura que esté al frente y pegado abajo */
      position: relative; 
      bottom: 0;
    }
    .footer-firma {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 0;
      border-top: 1px solid #f0f0f0;
    }
    .label {
      color: #aaa;
      font-size: 0.6rem;
      letter-spacing: 1px;
    }
    .marca {
      color: #3880ff;
      font-weight: 800;
      font-size: 0.85rem;
      letter-spacing: 2px;
      margin-top: -2px;
    }
  `],
  standalone: true,
  imports: [IonFooter, IonToolbar]
})
export class FooterBrbcComponent {}