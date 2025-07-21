import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../services/admin/admin.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css'],
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
    revenueGrowth: 0,
  };

  bestsellers: any[] = [];
  recentOrders: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();

    this.adminService.getAllBooks().subscribe({
      next: (data: any) => {
        this.dashboardStats.totalBooks = parseInt(data.totalItems);
      },
      // error: (err) => console.error('Error fetching books:', err),
    });

    this.adminService.getTotalUsers().subscribe({
      next: (res: any) => {


        this.dashboardStats.totalUsers = res.totalUsers || 0;
      },
      // error: (err) => console.error('Error fetching users:', err),
    });

    this.adminService.getTotalOrders().subscribe({
      next: (res: any) => {


        this.dashboardStats.totalOrders = res.totalOrders;
      },
      // error: (err) => console.error('Error fetching orders:', err),
    });

    // this.adminService.getTotalRevenue().subscribe({
    //   next: (res: any) => {
    //     this.dashboardStats.totalRevenue = res.totalRevenue || 0;
    //   },
    //   error: (err) => console.error('Error fetching revenue:', err),
    // });

    // this.adminService.getBestsellers().subscribe({
    //   next: (data) => {
    //     this.bestsellers = data || [];
    //   },
    //   error: (err) => console.error('Error fetching bestsellers:', err),
    // });

    this.adminService.getRecentOrders().subscribe({
      next: (data) => {
        this.recentOrders = data.data;
      },
      // error: (err) => console.error('Error fetching recent orders:', err),
    });
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
        this.loading = false;
      },
    });

    // Try to get bestsellers
    // Replace the getBestsellers() call with getBookSalesData()
    this.adminService.getBookSalesData().subscribe({
      next: (response) => {
        // Transform the data to match the format expected by the dashboard
        this.bestsellers = response.data.map((book: any) => ({
          title: book.title,
          author: book.author,
          sales: book.totalSales
        })).slice(0, 5); // Limit to top 5 bestsellers
      },
      error: (err) => console.error('Error fetching bestsellers:', err),
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
          {
            id: 'ORD-001',
            customer: 'John Doe',
            date: '2023-06-15',
            total: 125.99,
            status: 'Completed',
          },
          {
            id: 'ORD-002',
            customer: 'Jane Smith',
            date: '2023-06-14',
            total: 89.5,
            status: 'Processing',
          },
          {
            id: 'ORD-003',
            customer: 'Robert Johnson',
            date: '2023-06-13',
            total: 210.75,
            status: 'Completed',
          },
          {
            id: 'ORD-004',
            customer: 'Emily Davis',
            date: '2023-06-12',
            total: 45.25,
            status: 'Shipped',
          },
          {
            id: 'ORD-005',
            customer: 'Michael Brown',
            date: '2023-06-11',
            total: 78.0,
            status: 'Completed',
          },
        ];
      },
    });
  }
}
