import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinPriceClientComponent } from './bitcoin-price-client.component';

describe('BitcoinPriceClientComponent', () => {
  let component: BitcoinPriceClientComponent;
  let fixture: ComponentFixture<BitcoinPriceClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BitcoinPriceClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BitcoinPriceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
