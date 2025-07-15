import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  filterStatus: string = 'all';
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Status options
  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    
    // Only send status filter if it's not 'all'
    const statusFilter = this.filterStatus !== 'all' ? this.filterStatus : undefined;
    
    this.adminService.getAllOrders(this.currentPage, this.itemsPerPage, statusFilter).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          // Ensure each order has both _id and id properties
          this.orders = response.data.map((order: Order) => ({
            ...order,
            _id: order._id || order.id, // Ensure _id exists
            id: order.id || order._id   // Ensure id exists
          }));
          this.filteredOrders = [...this.orders];
          
          // Set pagination data if available
          if (response.page) this.currentPage = response.page;
          if (response.totalPages) this.totalPages = response.totalPages;
          if (response.totalItems) this.totalItems = response.totalItems;
        } else {
          console.error('Unexpected response format:', response);
          this.error = 'Unexpected data format from server';
          this.orders = [];
          this.filteredOrders = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  // Helper method to get order ID consistently
  getOrderId(order: any): string {
    return order._id || order.id;
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Filter by search term
      const matchesSearch = !this.searchTerm || 
        (order.orderNumber && order.orderNumber.toString().includes(this.searchTerm)) ||
        (order.customer && order.customer.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (order.email && order.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filter by status
      const matchesStatus = this.filterStatus === 'all' || order.status === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    // Apply sorting
    this.sortOrders(this.sortColumn);
  }

  onSearch(): void {
    this.filterOrders();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1; // Reset to first page
    this.loadOrders(); // Reload with new filter
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const orderToUpdate = this.orders.find(order => this.getOrderId(order) === orderId);
        if (orderToUpdate) {
          orderToUpdate.status = newStatus;
        }
        this.toastr.success(`Order status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.toastr.error(err.error?.message || 'Failed to update order status. Please try again.');
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.adminService.deleteOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order._id !== orderId);
          this.filterOrders();
          this.toastr.success('Order deleted successfully');
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to delete order. Please try again.');
        }
      });
    }
  }

  sortOrders(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc'; // Default to descending for most columns
    }

    this.filteredOrders.sort((a, b) => {
      let valA: any;
      let valB: any;
      
      // Handle dates
      if (column === 'createdAt' || column === 'updatedAt') {
        // Safely handle date values
        const dateA: any = a[column];
        const dateB: any = b[column];
        
        if (dateA && (typeof dateA === 'string' || typeof dateA === 'number' || dateA instanceof Date)) {
          valA = new Date(dateA).getTime();
        } else {
          valA = 0;
        }
        
        if (dateB && (typeof dateB === 'string' || typeof dateB === 'number' || dateB instanceof Date)) {
          valB = new Date(dateB).getTime();
        } else {
          valB = 0;
        }
      }
      // Handle total (could be string with currency symbol)
      else if (column === 'total') {
        // Safely handle numeric values that might be formatted as strings
        const totalA: any = a[column];
        const totalB: any = b[column];
        
        if (typeof totalA === 'string') {
          valA = totalA ? parseFloat(totalA.replace(/[^0-9.-]+/g, '')) : 0;
        } else {
          valA = totalA || 0;
        }
        
        if (typeof totalB === 'string') {
          valB = totalB ? parseFloat(totalB.replace(/[^0-9.-]+/g, '')) : 0;
        } else {
          valB = totalB || 0;
        }
      }
      // Handle all other cases
      else {
        valA = a[column] || '';
        valB = b[column] || '';
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc'
          ? valA - valB
          : valB - valA;
      }
    });
  }

  // Format currency
  formatCurrency(amount: number | undefined): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
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

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrders();
    }
  }
}