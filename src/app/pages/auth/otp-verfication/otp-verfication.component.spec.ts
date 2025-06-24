import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationComponent } from './otp-verfication.component';

describe('OtpVerficationComponent', () => {
  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
