import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProyect } from './edit-proyect';

describe('EditProyect', () => {
  let component: EditProyect;
  let fixture: ComponentFixture<EditProyect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProyect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProyect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
