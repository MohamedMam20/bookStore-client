import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/paypal/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paypal.component.html',
})
export class PaypalComponent implements OnInit {
  loading = true;
  message = 'Processing your payment...';
  error = '';

  constructor(
    private orderSrv: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('🟢 PaypalComponent initialised');

    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      // ✅ Step 3: Return from PayPal → Capture the payment
      this.message = 'Finalising your payment…';

      this.orderSrv.capturePaypal(token).subscribe({
        next: () => {
          this.loading = false;
          this.message = '✅ Payment successful!';
          setTimeout(() => this.router.navigate(['/thank-you']), 1500);
        },
        error: (e) => {
          this.loading = false;
          this.error = e.error?.message || '❌ Payment capture failed.';
        }
      });
    } else {
      // ❌ No token = invalid PayPal flow
      this.loading = false;
      this.error = '❌ Invalid PayPal session. Token missing.';
    }
  }
}
