import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgProyectList } from './org-proyect-list';

describe('OrgProyectList', () => {
  let component: OrgProyectList;
  let fixture: ComponentFixture<OrgProyectList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgProyectList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgProyectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
