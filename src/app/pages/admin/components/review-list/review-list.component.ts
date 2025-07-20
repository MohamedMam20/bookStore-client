import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any; // Add this line to fix the TypeScript error

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;
  filterStatus: string = 'all';
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Modal properties
  deleteModal: any;
  reviewToDelete: any = null;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.adminService.getAllReviews(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.reviews = response.data;
          this.filteredReviews = [...this.reviews];

          // Set pagination data if available
          if (response.currentPage) this.currentPage = response.currentPage;
          if (response.totalPages) this.totalPages = response.totalPages;
          if (response.count) this.totalItems = response.count;
        } else {
          console.error('Unexpected response format:', response);
          this.error = 'Unexpected data format from server';
          this.reviews = [];
          this.filteredReviews = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load reviews. Please try again.';
        this.loading = false;
        console.error('Error loading reviews:', err);
      }
    });
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(review => {
      // Filter by search term
      const matchesSearch = !this.searchTerm ||
        review.user?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.book?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.review?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        review.email?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = this.filterStatus === 'all' ||
        (review.status && review.status === this.filterStatus);

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    this.sortReviews(this.sortColumn);
  }

  onSearch(): void {
    this.filterReviews();
  }

  onStatusFilterChange(): void {
    this.filterReviews();
  }

  // Open delete modal with the review to delete
  openDeleteModal(review: any): void {
    this.reviewToDelete = review;
    const modalElement = document.getElementById('deleteReviewModal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      this.deleteModal = new bootstrap.Modal(modalElement, {
        backdrop: false,
        keyboard: true
      });
      this.deleteModal.show();
    }
  }

  // Confirm review deletion from the modal
  confirmDeleteReview(): void {
    if (!this.reviewToDelete) return;

    const reviewId = this.reviewToDelete.id;

    this.adminService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
        this.filterReviews();
        this.toastr.success('Review deleted successfully');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.toastr.error(err.error?.message || 'Failed to delete review. Please try again.');
      }
    });
  }

  // Close the delete modal
  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
      this.reviewToDelete = null;
    }
  }

  updateReviewStatus(id: string, status: string): void {
    // Convert string status to boolean for the API
    const isApproved = status === 'approved';

    this.adminService.updateReviewStatus(id, isApproved).subscribe({
      next: () => {
        this.toastr.success(`Review ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
        this.loadReviews();
      },
      error: (error) => {
        this.toastr.error('Failed to update review status');
        console.error('Error updating review status:', error);
      }
    });
  }

  sortReviews(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = column === 'date' ? 'desc' : 'asc';
    }

    this.filteredReviews.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      // Special case for date columns
      if (column === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (typeof valA === 'string') {
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

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadReviews();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReviews();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadReviews();
    }
  }

  // Get star rating display
  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
