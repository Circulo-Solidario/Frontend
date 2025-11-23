import { TestBed } from '@angular/core/testing';

import { Proyects } from './proyects';

describe('Proyects', () => {
  let service: Proyects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Proyects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
