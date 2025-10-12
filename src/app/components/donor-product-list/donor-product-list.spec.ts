import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorProductList } from './donor-product-list';

describe('DonorProductList', () => {
  let component: DonorProductList;
  let fixture: ComponentFixture<DonorProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
