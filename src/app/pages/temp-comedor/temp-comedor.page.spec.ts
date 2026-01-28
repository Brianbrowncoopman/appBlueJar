import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TempComedorPage } from './temp-comedor.page';

describe('TempComedorPage', () => {
  let component: TempComedorPage;
  let fixture: ComponentFixture<TempComedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TempComedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
