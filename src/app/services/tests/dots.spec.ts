import { TestBed } from '@angular/core/testing';

import { Dots } from '../dots';

describe('Dots', () => {
  let service: Dots;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dots);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
