import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TempCocinaPage } from './temp-cocina.page';

describe('TempCocinaPage', () => {
  let component: TempCocinaPage;
  let fixture: ComponentFixture<TempCocinaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TempCocinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
