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
          console.log('Order data:', this.order);
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
    console.log(`Attempting to update order ${this.orderId} status to: ${newStatus}`);
    console.log(`Current order status: ${this.order.status}`);
    
    this.adminService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: (response) => {
        console.log('Status update successful:', response);
        this.order.status = newStatus;
        this.toastr.success(`Order status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        const errorMessage = err.error?.message || 'Failed to update order status';
        this.toastr.error(errorMessage);
        
        // If there's a backend error, try to refresh the order details
        if (err.status && err.status !== 0) {
          this.loadOrderDetails(this.orderId);
        }
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

  // Calculate subtotal from items
  calculateSubtotal(): number {
    if (!this.order) return 0;
    
    // If subtotal is already provided, use it
    if (this.order.subtotal && typeof this.order.subtotal === 'number') {
      return this.order.subtotal;
    }
    
    // Calculate from items
    const items = this.order.books || this.order.items || [];
    return items.reduce((sum: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  }

  // Calculate total
  calculateTotal(): number {
    if (!this.order) return 0;
    
    // If total is already provided, use it
    if (this.order.total && typeof this.order.total === 'number') {
      return this.order.total;
    }
    
    // Calculate from subtotal and other components
    const subtotal = this.calculateSubtotal();
    const shipping = this.order.shipping || 0;
    const tax = this.order.tax || 0;
    const discount = this.order.discount || 0;
    
    return subtotal + shipping + tax - discount;
  }

  // Get payment method with fallback
  getPaymentMethod(): string {
    if (!this.order) return 'Unknown';
    
    if (this.order.paymentMethod) return this.order.paymentMethod;
    if (this.order.payment?.method) return this.order.payment.method;
    
    // Check for common payment indicators
    if (this.order.paymentId && this.order.paymentId.startsWith('pi_')) return 'Stripe';
    if (this.order.paymentId && this.order.paymentId.startsWith('pay_')) return 'PayPal';
    
    return 'Credit Card';
  }

  // Get payment ID with fallback
  getPaymentId(): string {
    if (!this.order) return 'Unknown';
    
    if (this.order.paymentId) return this.order.paymentId;
    if (this.order.payment?.id) return this.order.payment.id;
    if (this.order.transactionId) return this.order.transactionId;
    
    // Generate a mock payment ID based on order ID
    return `PAYMENT-${this.getOrderId().substring(0, 8)}`;
  }

  // Get payment status with fallback
  getPaymentStatus(): string {
    if (!this.order) return 'Unknown';
    
    if (this.order.paymentStatus) return this.order.paymentStatus;
    if (this.order.payment?.status) return this.order.payment.status;
    
    // Infer from order status
    if (this.order.status === 'cancelled') return 'Refunded';
    if (['delivered', 'shipped'].includes(this.order.status)) return 'Completed';
    if (this.order.status === 'processing') return 'Processing';
    
    return 'Completed';
  }

  // Format currency
  formatCurrency(amount: number): string {
    if (amount === undefined || amount === null) {
      return '$0.00';
    }
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