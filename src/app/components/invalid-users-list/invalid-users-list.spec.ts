import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidUsersList } from './invalid-users-list';

describe('InvalidUsersList', () => {
  let component: InvalidUsersList;
  let fixture: ComponentFixture<InvalidUsersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvalidUsersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidUsersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
