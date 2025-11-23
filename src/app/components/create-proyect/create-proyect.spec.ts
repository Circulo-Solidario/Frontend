import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProyect } from './create-proyect';

describe('CreateProyect', () => {
  let component: CreateProyect;
  let fixture: ComponentFixture<CreateProyect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProyect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProyect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
