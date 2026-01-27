import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  private auth = inject(Auth);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);

  // Variables para el formulario
  email = '';
  password = '';

  async iniciarSesion() {
    try {
      console.log('Intentando entrar con:', this.email);
      await signInWithEmailAndPassword(this.auth, this.email.trim(), this.password);
      this.navCtrl.navigateRoot('/home');
    } catch (error: any) {
      // ESTO TE DIRÁ EL ERROR REAL (ej: auth/user-not-found o auth/wrong-password)
      console.error('Código de error Firebase:', error.code);
      console.error('Mensaje completo:', error.message);
      
      const toast = await this.toastCtrl.create({
        message: 'Error: ' + error.code, 
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}