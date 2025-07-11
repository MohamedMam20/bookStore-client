import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from '../../services/payment/payment.service'; // Import StripeService

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  @ViewChild('invoice') invoiceElement!: ElementRef;

  customerName = '';
  customerEmail = '';
  orderId = '';
  orderDate = new Date();
  cartItems: any[] = [];
  totalAmount = 0;
  orderStatus: string = ''; // Track order status
  refundStatus: string = ''; // Track refund status
  canCancel: boolean = true; // Track if order can be cancelled

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private stripeService: StripeService // Inject StripeService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const orderId = localStorage.getItem('orderId');
    this.customerName = user?.name || 'customer';
    this.customerEmail = user?.email || 'not available';
    this.orderId = orderId || 'not available';

    if (orderId) {
      this.http.get<any>(`http://localhost:3000/api/v1/orders/${orderId}`).subscribe({
        next: (res) => {
          this.cartItems = res?.data?.books.map((item: any) => ({
            ...item,
            name: item.book.title, // Assuming book object has title
            price: item.book.price // Assuming book object has price
          })) || [];
          this.totalAmount = res?.data?.totalPrice || 0;
          this.orderDate = new Date(res?.data?.createdAt);
          this.orderStatus = res?.data?.status || 'pending';
          this.refundStatus = res?.data?.statusHistory?.find((h: any) => h.status === 'cancelled')?.refundStatus || '';
          // Check if order is cancellable (completed and within 24 hours)
          const orderDate = new Date(res?.data?.createdAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
          this.canCancel = this.orderStatus === 'completed' && hoursDiff <= 24;
        },
        error: (err) => {
          console.error('Failed to fetch order', err);
        }
      });
    }
  }

  cancelOrder(): void {
    if (this.orderId && this.canCancel) {
      this.stripeService.cancelOrder(this.orderId).subscribe({
        next: (response: any) => {
          this.orderStatus = 'cancelled';
          this.refundStatus = response.refundStatus || 'pending';
          this.canCancel = false; // Disable cancel button after cancellation
          // Calculate hoursDiff for logging
          const orderDate = new Date(this.orderDate);
          const now = new Date();
          const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
          console.log('Order cancelled successfully', response);
          console.log('orderStatus:', this.orderStatus, 'hoursDiff:', hoursDiff, 'canCancel:', this.canCancel);
        },
        error: (err) => {
          console.error('Failed to cancel order', err);
        }
      });
    }
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
      pdf.save(`invoice ${this.orderId}.pdf`);
    });
  }
}
