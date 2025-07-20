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
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Add these properties for the modal
  private deleteModal: any;
  adminToDelete: User | null = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();

    // Initialize the modal after view is ready
    setTimeout(() => {
      const modalElement = document.getElementById('deleteAdminModal');
      if (modalElement && typeof bootstrap !== 'undefined') {
        this.deleteModal = new bootstrap.Modal(modalElement, {
          backdrop: false,
          keyboard: true
        });
      }
    }, 0);
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAllUsers(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          // Filter to only include admin users
          this.admins = response.data.filter((user: User) => user.role === 'admin');
          this.filteredAdmins = [...this.admins];

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
        this.error = 'Failed to load admins. Please try again.';
        this.loading = false;
        console.error('Error loading admins:', err);
      }
    });
  }

  filterAdmins(): void {
    this.filteredAdmins = this.admins.filter(admin => {
      const matchesSearch = !this.searchTerm ||
        admin.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (admin.lastName && admin.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        admin.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onSearch(): void {
    this.filterAdmins();
  }

  // Add pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadAdmins();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAdmins();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAdmins();
    }
  }

  // Replace the existing deleteAdmin method with these methods
  deleteAdmin(id: string): void {
    const admin = this.admins.find(a => a._id === id);
    if (admin) {
      this.adminToDelete = admin;
      if (this.deleteModal) {
        this.deleteModal.show();
      } else {
        // If modal wasn't initialized, try again
        const modalElement = document.getElementById('deleteAdminModal');
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

  confirmDeleteAdmin(): void {
    if (!this.adminToDelete) return;

    this.adminService.deleteUser(this.adminToDelete._id).subscribe({
      next: () => {
        this.toastr.success('Admin deleted successfully');
        this.closeDeleteModal();
        this.loadAdmins(); // Reload the current page after deletion
      },
      error: (err) => {
        console.error('Error deleting admin:', err);
        this.toastr.error('Failed to delete admin. Please try again.');
      }
    });
  }

  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
      this.adminToDelete = null;
    }
  }
}
