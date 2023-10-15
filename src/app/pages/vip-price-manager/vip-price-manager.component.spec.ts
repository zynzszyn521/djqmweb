import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipPriceManagerComponent } from './vip-price-manager.component';

describe('VipPriceManagerComponent', () => {
  let component: VipPriceManagerComponent;
  let fixture: ComponentFixture<VipPriceManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VipPriceManagerComponent]
    });
    fixture = TestBed.createComponent(VipPriceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
