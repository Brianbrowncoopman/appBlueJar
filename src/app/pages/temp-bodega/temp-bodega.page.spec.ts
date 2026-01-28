import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TempBodegaPage } from './temp-bodega.page';

describe('TempBodegaPage', () => {
  let component: TempBodegaPage;
  let fixture: ComponentFixture<TempBodegaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TempBodegaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
