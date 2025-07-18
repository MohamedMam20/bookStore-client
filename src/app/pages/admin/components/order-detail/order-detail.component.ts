import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId: string = '';
  order: any = null;
  loading: boolean = true;
  error: string | null = null;

  // Status options for the dropdown
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.loadOrderDetails(this.orderId);
      } else {
        this.error = 'Order ID is missing';
        this.loading = false;
      }
    });
  }

  loadOrderDetails(orderId: string): void {
    this.loading = true;
    this.error = null;
    
    this.adminService.getOrderById(orderId).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.order = response.data;
          // Ensure both _id and id are available
          this.order._id = this.order._id || this.order.id;
          this.order.id = this.order.id || this.order._id;
        } else {
          this.error = 'Unexpected response format from server';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load order details';
        this.loading = false;
        console.error('Error loading order details:', err);
      }
    });
  }

  updateOrderStatus(newStatus: string): void {
    this.adminService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: () => {
        this.order.status = newStatus;
        this.toastr.success(`Order status updated to ${newStatus}`);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update order status');
        console.error('Error updating order status:', err);
      }
    });
  }

  deleteOrder(): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.adminService.deleteOrder(this.orderId).subscribe({
        next: () => {
          this.toastr.success('Order deleted successfully');
          this.router.navigate(['/admin/orders']);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to delete order. Please try again.');
        }
      });
    }
  }

  // Helper method to get order ID consistently
  getOrderId(): string {
    return this.order?._id || this.order?.id || this.orderId;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Get status badge class
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}