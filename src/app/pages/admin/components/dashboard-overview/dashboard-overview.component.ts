import { Component, OnInit } from '@angular/core';
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
    totalRevenue: 0
  };

  recentOrders: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Get dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (data: any) => {
        this.dashboardStats = data;
        this.loading = false;
        console.log(data);
      },
      error: () => {
        // Fallback to individual API calls if the combined endpoint fails
        this.loadIndividualStats();
      },
    });

    // Get recent orders
    this.adminService.getRecentOrders().subscribe({
      next: (data: any) => {
        this.recentOrders = data.data || data;
      },
      error: () => {
        // Silent error handling
        this.recentOrders = [];
      },
    });
  }

  loadIndividualStats(): void {
    // Load books count
    this.adminService.getAllBooks().subscribe({
      next: (data: any) => {
        this.dashboardStats.totalBooks = parseInt(data.totalItems);
      },
      error: () => {
        this.dashboardStats.totalBooks = 0;
      },
    });

    // Load users count
    this.adminService.getTotalUsers().subscribe({
      next: (res: any) => {
        this.dashboardStats.totalUsers = res.totalUsers || 0;
      },
      error: () => {
        this.dashboardStats.totalUsers = 0;
      },
    });

    // Load orders count
    this.adminService.getTotalOrders().subscribe({
      next: (res: any) => {
        this.dashboardStats.totalOrders = res.totalOrders;
      },
      error: () => {
        this.dashboardStats.totalOrders = 0;
      },
    });

    // Load revenue
    this.adminService.getTotalRevenue().subscribe({
      next: (res: any) => {
        this.dashboardStats.totalRevenue = res.totalRevenue || 0;
      },
      error: () => {
        this.dashboardStats.totalRevenue = 0;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
