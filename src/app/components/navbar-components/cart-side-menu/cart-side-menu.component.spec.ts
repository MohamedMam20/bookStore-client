import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSideMenuComponent } from './cart-side-menu.component';

describe('CartSideMenuComponent', () => {
  let component: CartSideMenuComponent;
  let fixture: ComponentFixture<CartSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSideMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
