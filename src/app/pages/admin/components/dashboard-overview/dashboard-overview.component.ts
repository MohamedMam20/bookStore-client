import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin/admin.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit {
  dashboardStats = {
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    bookGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
    revenueGrowth: 0
  };

  bestsellers: any[] = [];
  recentOrders: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Try to get dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.dashboardStats = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading dashboard stats:', err);
        // Fallback to mock data
        this.dashboardStats = {
          totalBooks: 125,
          totalOrders: 85,
          totalUsers: 42,
          totalRevenue: 12580,
          bookGrowth: 15,
          orderGrowth: 8,
          userGrowth: 12,
          revenueGrowth: 10
        };
        this.loading = false;
      }
    });

    // Try to get bestsellers
    this.adminService.getBestsellers().subscribe({
      next: (data: any) => {
        this.bestsellers = data;
      },
      error: (err: any) => {
        console.error('Error loading bestsellers:', err);
        // Fallback to mock data
        this.bestsellers = [
          { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', sales: 42 },
          { title: 'To Kill a Mockingbird', author: 'Harper Lee', sales: 38 },
          { title: '1984', author: 'George Orwell', sales: 35 },
          { title: 'Pride and Prejudice', author: 'Jane Austen', sales: 30 },
          { title: 'The Catcher in the Rye', author: 'J.D. Salinger', sales: 28 }
        ];
      }
    });

    // Try to get recent orders
    this.adminService.getRecentOrders().subscribe({
      next: (data: any) => {
        this.recentOrders = data;
      },
      error: (err: any) => {
        console.error('Error loading recent orders:', err);
        // Fallback to mock data
        this.recentOrders = [
          { id: 'ORD-001', customer: 'John Doe', date: '2023-06-15', total: 125.99, status: 'Completed' },
          { id: 'ORD-002', customer: 'Jane Smith', date: '2023-06-14', total: 89.50, status: 'Processing' },
          { id: 'ORD-003', customer: 'Robert Johnson', date: '2023-06-13', total: 210.75, status: 'Completed' },
          { id: 'ORD-004', customer: 'Emily Davis', date: '2023-06-12', total: 45.25, status: 'Shipped' },
          { id: 'ORD-005', customer: 'Michael Brown', date: '2023-06-11', total: 78.00, status: 'Completed' }
        ];
      }
    });
  }
}
