import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadArtComponent } from './bread-art.component';

describe('BreadArtComponent', () => {
  let component: BreadArtComponent;
  let fixture: ComponentFixture<BreadArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreadArtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
