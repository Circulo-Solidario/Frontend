import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectDetail } from './proyect-detail';

describe('ProyectDetail', () => {
  let component: ProyectDetail;
  let fixture: ComponentFixture<ProyectDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
