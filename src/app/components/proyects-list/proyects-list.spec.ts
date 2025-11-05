import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectsList } from './proyects-list';

describe('ProyectsList', () => {
  let component: ProyectsList;
  let fixture: ComponentFixture<ProyectsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
