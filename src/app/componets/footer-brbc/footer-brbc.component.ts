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
    border-top: 1px solid #f0f0f0;
    /* Esto es clave para que se vea en móviles modernos */
    padding-bottom: var(--ion-safe-area-bottom, 0); 
    display: block;
  }
  .footer-firma {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 45px; /* Altura fija para asegurar visibilidad */
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
`],
  standalone: true,
  imports: [IonFooter, IonToolbar]
})
export class FooterBrbcComponent {}