import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ مهم جداً
import { StripeService } from '../../services/payment/payment.service';
import { CartService } from '../../services/cart/cart.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ زودي هنا
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm!: FormGroup;
  clientSecret!: string;
  cardElement: any;
  stripe: any;
  card: any;

  cartItems: any[] = [];
  subtotal = 0;

  total = 0;
  errorMessage = '';
  isLoading = false;
 selectedShipping: 'free' | 'paid' = 'free';

  // حساب قيمة الشحن بناءً على الاختيار
  get shipping(): number {
    return this.selectedShipping === 'free' ? 0 : 200;
  }
  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private cartService: CartService,
     private router: Router,
  private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
 const cartData = localStorage.getItem('cart');
  if (cartData) {
    this.cartItems = JSON.parse(cartData);
  }
    const localCart = localStorage.getItem('cart');
    if (localCart) {
    this.cartItems = JSON.parse(localCart);
    this.subtotal = this.cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    this.total = this.subtotal + this.shipping;
  } else {
    // fallback لو فيه سلة حقيقية
    this.cartService.viewCart().subscribe((res) => {
      this.cartItems = res.items;
      this.subtotal = res.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
      this.total = this.subtotal + this.shipping;
    });
  }

    this.stripeService.loadStripe().then(({ stripe, elements }) => {
      this.stripe = stripe;
      this.card = elements.create('card');
      this.card.mount('#card-element');
    });
  }
 selectShipping(shipping: 'free' | 'paid'): void {
    this.selectedShipping = shipping;
  }
 async onSubmit() {
  if (this.checkoutForm.invalid) return;

  this.isLoading = true;
  const { name, email } = this.checkoutForm.value;

  try {
    const response = await firstValueFrom(
      this.stripeService.createCheckout({
        cartItems: this.cartItems,
        amount: this.total
      })
    );

    const result = await this.stripe.confirmCardPayment(response.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: { name, email }
      }
    });

    if (result.error) {
      this.errorMessage = result.error.message;
    } else if (result.paymentIntent.status === 'succeeded') {
      // ✅ هنا مكان الـ console.log الصح
      console.log("🧾 Confirming payment with:", {
        paymentIntentId: result.paymentIntent.id,
        orderId: response.orderId
      });

      await firstValueFrom(
        this.stripeService.confirmPayment({
          paymentIntentId: result.paymentIntent.id,
          orderId: response.orderId
        })
      );

       this.toastr.success('payment successful ✅');
      localStorage.removeItem('cart');
       this.router.navigateByUrl('/order-confirmation');
    }
  } catch (error: any) {
    console.error('Error during payment:', error);
    this.errorMessage = 'not validation';
    this.toastr.error(this.errorMessage, 'Failed to process payment');
  } finally {
    this.isLoading = false;
  }
}


}

// export class CheckoutFormComponent implements OnInit {
//   checkoutForm!: FormGroup;
//   clientSecret!: string;
//   cardElement: any;
//   stripe: any;
//   card: any;

//   errorMessage = '';
//   isLoading = false;

//   cartItems: any[] = [];
//   subtotal = 0;
//   shipping = 50;
//   total = 0;

//   constructor(
//     private fb: FormBuilder,
//     private stripeService: StripeService,
//     private cartService: CartService
//   ) {}

//   ngOnInit(): void {
//   this.checkoutForm = this.fb.group({
//     name: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]]
//   });

//   // ✅ جلب البيانات من localStorage
//   const localCart = localStorage.getItem('cart');
//   if (localCart) {
//     this.cartItems = JSON.parse(localCart);
//     this.subtotal = this.cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
//     this.total = this.subtotal + this.shipping;
//   } else {
//     // fallback لو فيه سلة حقيقية
//     this.cartService.viewCart().subscribe((res) => {
//       this.cartItems = res.items;
//       this.subtotal = res.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
//       this.total = this.subtotal + this.shipping;
//     });
//   }

//   this.stripeService.loadStripe().then(({ stripe, elements }) => {
//     this.stripe = stripe;
//     this.card = elements.create('card');
//     this.card.mount('#card-element');
//   });
// }

//   async onSubmit() {
//     if (this.checkoutForm.invalid) return;

//     this.isLoading = true;
//     const { name, email } = this.checkoutForm.value;

//     try {
//       const response = await firstValueFrom(
//         this.stripeService.createCheckout({
//           cartItems: this.cartItems,
//           amount: this.total
//         })
//       );

//       const result = await this.stripe.confirmCardPayment(response.clientSecret, {
//         payment_method: {
//           card: this.card,
//           billing_details: { name, email }
//         }
//       });

//       if (result.error) {
//         this.errorMessage = result.error.message;
//       } else if (result.paymentIntent.status === 'succeeded') {
//         await firstValueFrom(
//           this.stripeService.confirmPayment({
//             paymentIntentId: result.paymentIntent.id,
//             orderId: response.orderId
//           })
//         );
//         alert('تم الدفع بنجاح ✅');
//       }
//     } catch (error: any) {
//       console.error('Error during payment:', error);
//       this.errorMessage = 'حدث خطأ أثناء عملية الدفع';
//     } finally {
//       this.isLoading = false;
//     }
//   }

//   get stripeForm() {
//     return this.checkoutForm.get('payment.stripe') as FormGroup;
//   }
//   get paypalForm() {
//     return this.checkoutForm.get('payment.paypal') as FormGroup;
//   }
//   get paymobForm() {
//     return this.checkoutForm.get('payment.paymob') as FormGroup;
//   }

//   get paymentMethod() {
//     return this.checkoutForm.get('payment.method')?.value;
//   }
// }
