import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { User } from '../../../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  selectedRole: string = '';

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.users = response.data;
          this.filteredUsers = [...this.users];

          // Set pagination data if available
          if (response.page) this.currentPage = response.page;
          if (response.totalPages) this.totalPages = response.totalPages;
          if (response.totalItems) this.totalItems = response.totalItems;
        } else {
          this.error = 'Unexpected data format from server';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (user.lastName && user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.selectedRole || user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  onSearch(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  // Add pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('User deleted successfully');
          this.loadUsers(); // Reload the current page after deletion
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.toastr.error('Failed to delete user. Please try again.');
        }
      });
    }
  }
}
