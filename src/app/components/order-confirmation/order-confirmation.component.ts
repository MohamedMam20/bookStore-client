import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from '../../services/payment/payment.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  @ViewChild('invoice') invoiceElement!: ElementRef;

  customerName = '';
  customerEmail = '';
  orderId = '';
  orderNumber = '';
  orderDate = new Date();
  cartItems: any[] = [];
  totalAmount = 0;
  orderStatus: string = '';
  refundStatus: string = '';
  canCancel: boolean = true;
  isLoading: any;
  timeRemaining: number = 0;
  private countdownInterval: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService,
    private toastr: ToastrService

  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  ngOnInit(): void {
    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
    this.customerName = orderData.customerName || 'Customer';
    this.customerEmail = orderData.customerEmail || 'Not available';
    this.orderId = orderData.orderId || this.route.snapshot.queryParams['orderId'] || 'Not available';
    this.orderDate = new Date(orderData.orderDate || Date.now());
    this.cartItems = orderData.cartItems || [];
    this.totalAmount = orderData.totalAmount || 0;

    if (this.orderId) {
      this.http.get<any>(`${environment.apiUrl}/orders/${this.orderId}`, { headers: this.getHeaders() }).subscribe({
        next: (res) => {
          const order = res.data || res;
          this.orderNumber = order.orderNumber || this.generateOrderNumber(this.orderId);
          this.orderStatus = order.status || 'pending';
          this.refundStatus = order.statusHistory?.find((h: any) => h.status === 'cancelled')?.refundStatus || '';

          if (!this.cartItems.length) {
            this.cartItems = order.books.map((item: any) => ({
              name: item.book.title,
              price: item.book.price,
              quantity: item.quantity,
              language: item.language,
              image: item.book.image || ''
            }));
            this.totalAmount = order.totalPrice || 0;
          }

          const orderDate = new Date(order.createdAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
          this.canCancel = this.orderStatus === 'completed' && hoursDiff <= 24;

          if (this.canCancel && this.orderStatus !== 'cancelled') {
            this.startCountdown();
          }
        },
        error: (err) => {
          console.error('Failed to fetch order', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown(): void {
    const orderDate = new Date(this.orderDate);
    const expiryTime = new Date(orderDate.getTime() + (24 * 60 * 60 * 1000));
    this.updateTimeRemaining();

    this.countdownInterval = setInterval(() => {
      this.updateTimeRemaining();
      if (this.timeRemaining <= 0) {
        this.canCancel = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  private updateTimeRemaining(): void {
    const orderDate = new Date(this.orderDate);
    const expiryTime = new Date(orderDate.getTime() + (24 * 60 * 60 * 1000));
    const now = new Date();

    const diff = expiryTime.getTime() - now.getTime();
    this.timeRemaining = Math.max(0, Math.floor(diff / 1000));
  }

  formatTimeRemaining(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    return `${hours}h`;
  }

  formatDetailedTimeRemaining(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    const minutes = Math.floor((this.timeRemaining % 3600) / 60);
    const seconds = this.timeRemaining % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  getProgressPercentage(): number {
    const totalSeconds = 24 * 60 * 60;
    const percentage = (this.timeRemaining / totalSeconds) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.calculateSubtotal() > 200 ? 0 : 20;
  }

  getTaxAmount(): number {
    const subtotal = this.calculateSubtotal();
    const shipping = this.getShippingCost();
    return Math.round((subtotal + shipping) * 0.14 * 100) / 100;
  }

  private generateOrderNumber(orderId: string): string {
    const hash = orderId.split('-')[0].toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${hash}-${randomNum}`;
  }

  cancelOrder(): void {
    if (!this.orderId || !this.canCancel) {
      return;
    }

    this.stripeService.cancelOrder(this.orderId).subscribe({
      next: (response: any) => {
        this.orderStatus = 'cancelled';
        this.refundStatus = response.refundStatus || 'pending';
        this.canCancel = false;
        this.toastr.success('❌ Order has been cancelled successfully');
        this.router.navigateByUrl('/order-confirmation', {
          state: {
            orderId: this.orderId,
            refundStatus: this.refundStatus
          }
        });
      },
      error: (err) => {
        console.error('Failed to cancel order', err);
      }
    });
  }

  downloadInvoiceAsPDF(): void {
    const invoice = this.invoiceElement.nativeElement;

    html2canvas(invoice).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${this.orderNumber}.pdf`);
    });
  }
}
