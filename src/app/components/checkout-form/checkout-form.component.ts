import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../services/payment/payment.service';
import { CartService } from '../../services/cart/cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm!: FormGroup;
  clientSecret!: string;
  orderId!: string;
  card: any;
  stripe: any;

  cartItems: any[] = [];
  subtotal = 0;
  total = 0;
  isLoading = false;
  errorMessage = '';
  selectedShipping: 'free' | 'paid' = 'free';
  paymentMode: 'cart' | 'buyNow' = 'cart';

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  get shipping(): number {
    return this.selectedShipping === 'free' ? 0 : 200;
  }

  ngOnInit(): void {
  this.checkoutForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  const nav = this.router.getCurrentNavigation();
  const state = nav?.extras?.state as {
    mode?: 'cart' | 'buyNow',
    cartItems?: any[],
    clientSecret?: string,
    orderId?: string
  };
  const queryMode = this.route.snapshot.queryParams['mode'];
  const queryOrderId = this.route.snapshot.queryParams['orderId'];

  this.paymentMode = state?.mode || queryMode || 'cart';


  if (this.paymentMode === 'buyNow') {

    if (state?.cartItems && state?.clientSecret && state?.orderId) {
      this.cartItems = state.cartItems;
      this.clientSecret = state.clientSecret;
      this.orderId = state.orderId;
      this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      this.total = this.subtotal + this.shipping;
    } else {

      const buyNowData = localStorage.getItem('buyNowData');
      if (buyNowData) {
        const data = JSON.parse(buyNowData);
        if (data.mode === 'buyNow' && data.cartItems && data.clientSecret && data.orderId) {
          this.cartItems = data.cartItems;
          this.clientSecret = data.clientSecret;
          this.orderId = data.orderId;
          this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
          this.total = this.subtotal + this.shipping;
        } else {
          this.toastr.error('Invalid Buy Now data');
          this.router.navigateByUrl('/');
          return;
        }
      } else if (queryOrderId) {

        this.isLoading = true;
        this.fetchOrderDetails(queryOrderId);
        return;
      } else {
        this.toastr.error('Invalid Buy Now data');
        this.router.navigateByUrl('/');
        return;
      }
    }
  } else {
    // Cart mode: Fetch cart items from backend
    this.isLoading = true;
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartItems = res.data || [];
        this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        this.total = this.subtotal + this.shipping;
        this.isLoading = false;

        if (!this.cartItems.length) {
          this.toastr.warning('Your cart is empty');
          this.router.navigateByUrl('/cart');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.error?.message || 'Failed to load cart items');
        console.error('❌ Cart load error:', err);
        this.router.navigateByUrl('/cart');
      }
    });
  }

  this.stripeService.loadStripe().then(({ stripe, elements }) => {
    this.stripe = stripe;
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }).catch(err => {
    this.toastr.error('Failed to load payment form');
    console.error('❌ Stripe load error:', err);
  });


  localStorage.removeItem('buyNowData');
}

  private async fetchOrderDetails(orderId: string) {
    try {
      const res = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/orders/${orderId}`, { headers: this.getHeaders() })
      );
      const order = (res as any).data || res;
      this.cartItems = order.books.map((item: any) => ({
        productId: item.book._id,
        title: item.book.title,
        price: item.book.price,
        quantity: item.quantity,
        image: item.book.image || '',
        language: item.language
      }));
      this.subtotal = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      this.total = this.subtotal + this.shipping;
      this.orderId = orderId;
      // Note: clientSecret cannot be fetched; regenerate if needed
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      this.toastr.error('Failed to load order details');
      this.router.navigateByUrl('/');
    }
  }

  selectShipping(shipping: 'free' | 'paid'): void {
    this.selectedShipping = shipping;
    this.total = this.subtotal + this.shipping;
  }

async onSubmit() {
  if (this.checkoutForm.invalid) {
    this.toastr.error('Please fill in all required fields');
    return;
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    this.toastr.error('Please log in to proceed with checkout');
    this.router.navigateByUrl('/login', { state: { returnUrl: '/checkout' } });
    return;
  }

  this.isLoading = true;
  const { name, email } = this.checkoutForm.value;

  try {
    let clientSecret = this.clientSecret;
    let orderId = this.orderId;


    if (this.paymentMode === 'cart') {
      if (!this.cartItems.length) {
        this.toastr.warning('Your cart is empty');
        this.router.navigateByUrl('/cart');
        return;
      }

      const response = await firstValueFrom(
        this.stripeService.createCheckout({
          cartItems: this.cartItems.map(item => ({
            productId: item.bookId || item.productId,
            quantity: item.quantity,
            language: item.language || 'en'
          })),
          amount: this.total
        })
      );
      clientSecret = response.clientSecret;
      orderId = response.orderId;
    }




    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: { name, email }
      }
    });

    if (result.error) {
      this.errorMessage = result.error.message || 'Payment failed';
      this.toastr.error(this.errorMessage);
      return;
    }


    if (result.paymentIntent.status === 'succeeded') {
  await firstValueFrom(
    this.stripeService.confirmPayment({
      paymentIntentId: result.paymentIntent.id,
      orderId,
      mode: this.paymentMode
    })
  );

  this.toastr.success('✅ Payment successful');
  localStorage.removeItem('buyNowData');
  this.router.navigateByUrl('/order-confirmation', { state: { orderId } });
}



  } catch (err: any) {
    console.error('❌ Error during payment:', err);
    this.toastr.error(err.error?.message || 'Something went wrong during checkout');
  } finally {
    this.isLoading = false;
  }
}

}
