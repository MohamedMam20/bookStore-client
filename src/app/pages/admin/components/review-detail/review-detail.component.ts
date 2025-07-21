import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any; // Add this line to fix the TypeScript error

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent implements OnInit {
  reviewId: string = '';
  review: any = null;
  loading: boolean = true;
  error: string | null = null;
  deleteModal: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reviewId = id;
        this.loadReviewDetails(id);
      } else {
        this.error = 'Review ID not provided';
        this.loading = false;
      }
    });
  }

  loadReviewDetails(id: string): void {
    this.loading = true;
    this.adminService.getReviewById(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.review = response.data;
        } else {
          this.error = 'Unexpected response format from server';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load review details. Please try again.';
        this.loading = false;
        console.error('Error loading review details:', err);
      }
    });
  }

  updateStatus(status: string): void {
    // Convert string status to boolean for the API
    const isApproved = status === 'approved';

    this.adminService.updateReviewStatus(this.reviewId, isApproved).subscribe({
      next: () => {
        this.toastr.success(`Review ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
        this.loadReviewDetails(this.reviewId);
      },
      error: (error) => {
        this.toastr.error('Failed to update review status');
      }
    });
  }

  // Open delete modal
  openDeleteModal(): void {
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
    this.adminService.deleteReview(this.reviewId).subscribe({
      next: () => {
        this.toastr.success('Review deleted successfully');
        this.closeDeleteModal();
        this.router.navigate(['/admin/reviews']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to delete review. Please try again.');
      }
    });
  }

  // Close the delete modal
  closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
