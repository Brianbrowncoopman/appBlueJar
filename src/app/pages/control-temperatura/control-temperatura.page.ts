import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-control-temperatura',
  templateUrl: './control-temperatura.page.html',
  styleUrls: ['./control-temperatura.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ControlTemperaturaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
