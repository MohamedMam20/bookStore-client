import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpCompleteComponent } from './otp-complete.component';

describe('OtpCompleteComponent', () => {
  let component: OtpCompleteComponent;
  let fixture: ComponentFixture<OtpCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpCompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
