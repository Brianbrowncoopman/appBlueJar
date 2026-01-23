import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaDiaPage } from './venta-dia.page';

describe('VentaDiaPage', () => {
  let component: VentaDiaPage;
  let fixture: ComponentFixture<VentaDiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaDiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
