import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, OrderHistoryItem } from '../../services/paypal/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  loading = true;
  error   = '';
 // orders: OrderHistoryItem[] = [];

   currentPage = 1;
  limit = 5;
  totalPages = 1;


  constructor(private orderSrv: OrderService) {}

  ngOnInit(): void {
   this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderSrv.getHistory(this.currentPage, this.limit).subscribe({
      next: res => {
        this.orders = res.data;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to load order history.';
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }  payNow(orderId: string) {
  this.orderSrv.createPaypal(orderId).subscribe({
    next: res => {
      if (res.approvalUrl) {
        window.location.href = res.approvalUrl; 
      }
    },
    error: err => {
      console.error('Failed to initiate PayPal payment', err);
      alert('Failed to initiate PayPal payment. Please try again.');
    }
  });
}


    @Input() orders: OrderHistoryItem[] = [];

}
