import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.css'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      delivery: this.fb.group({
        country: ['Egypt'],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        address: ['', Validators.required],
        apartment: [''],
        city: ['', Validators.required],
        governorate: ['', Validators.required],
        postalCode: ['', Validators.required]
      }),
      shippingMethod: ['Standard'],
      payment: this.fb.group({
        method: ['cash'],
        stripe: this.fb.group({
          cardNumber: ['', Validators.required],
          expiry: ['', Validators.required],
          cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
          nameOnCard: ['', Validators.required]
        }),
        paypal: this.fb.group({
          email: ['', [Validators.required, Validators.email]]
        }),
        paymob: this.fb.group({
          phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
        }),
        cash: this.fb.group({}),
        useSameAddress: [true]
      })
    });
  }

  get paymentMethod() {
    return this.checkoutForm.get('payment.method')?.value;
  }

  get stripeForm() {
    return this.checkoutForm.get('payment.stripe') as FormGroup;
  }

  get paypalForm() {
    return this.checkoutForm.get('payment.paypal') as FormGroup;
  }

  get paymobForm() {
    return this.checkoutForm.get('payment.paymob') as FormGroup;
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formData = this.checkoutForm.value;
    const selectedMethod = formData.payment.method;
    const paymentData = formData.payment[selectedMethod];

    const order = {
      contact: formData.emailOrPhone,
      delivery: formData.delivery,
      shippingMethod: formData.shippingMethod,
      payment: {
        method: selectedMethod,
        data: paymentData
      }
    };

    console.log('Ready to send to backend:', order);
  }
}
