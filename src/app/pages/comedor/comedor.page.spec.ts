import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComedorPage } from './comedor.page';

describe('ComedorPage', () => {
  let component: ComedorPage;
  let fixture: ComponentFixture<ComedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
