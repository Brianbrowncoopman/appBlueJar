import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlProductosPage } from './control-productos.page';

describe('ControlProductosPage', () => {
  let component: ControlProductosPage;
  let fixture: ComponentFixture<ControlProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
