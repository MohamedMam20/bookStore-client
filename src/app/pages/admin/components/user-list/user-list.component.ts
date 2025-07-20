// Add these imports at the top if not already present
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { User } from '../../../../models/user.model';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any; // Declare Bootstrap to use it without TypeScript errors

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

  // Add these properties for the modal
  private deleteModal: any;
  userToDelete: User | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Initialize the modal after view is ready
    setTimeout(() => {
      const modalElement = document.getElementById('deleteUserModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.deleteModal = new bootstrap.Modal(modalElement, {
          backdrop: false,
          keyboard: true
        });
      }
    }, 0);
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Add User type to the parameter
          this.users = response.data.filter((user: User) => user.role === 'user');
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
    // Also fix this filter function to use proper typing
    this.filteredUsers = this.users.filter((user: User) => {
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

  // Replace the existing deleteUser method with these methods
  deleteUser(id: string): void {
    const user = this.users.find(u => u._id === id);
    if (user) {
      this.userToDelete = user;
      if (this.deleteModal) {
        this.deleteModal.show();
      } else {
        // If modal wasn't initialized, try again
        const modalElement = document.getElementById('deleteUserModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
          this.deleteModal = new bootstrap.Modal(modalElement, {
            backdrop: false,
            keyboard: true
          });
          this.deleteModal.show();
        }
      }
    }
  }

  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.adminService.deleteUser(this.userToDelete._id).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.closeDeleteModal();
        this.loadUsers(); // Reload the current page after deletion
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.toastr.error('Failed to delete user. Please try again.');
      }
    });
  }

  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
      this.userToDelete = null;
    }
  }
}
