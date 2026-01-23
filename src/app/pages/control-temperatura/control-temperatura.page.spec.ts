import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlTemperaturaPage } from './control-temperatura.page';

describe('ControlTemperaturaPage', () => {
  let component: ControlTemperaturaPage;
  let fixture: ComponentFixture<ControlTemperaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTemperaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
