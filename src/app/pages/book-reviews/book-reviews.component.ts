import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../../services/review.service';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-book-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-reviews.component.html',
  styleUrl: './book-reviews.component.css'
})
export class BookReviewsComponent implements OnInit {
  @Input() slug: string = '';
  reviews: any[] = [];
  averageRating = 0;
  reviewText = '';
  reviewForm = { rating: 0 };
  hoverRating = 0;
  showWarning = false;
  warningMessage = '';
  isEditing = false;
  editIndex: number | null = null;
  currentUserId = '';

  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
   const user = this.authService.getCurrentUser();
this.currentUserId = user?.id || '';
    this.fetchReviews();
  console.log("Current User ID:", this.currentUserId);
  }


@Output() ratingStats = new EventEmitter<{ average: number, count: number }>();
isReviewOwner(review: any): boolean {
  return review.user?._id === this.currentUserId;
}

fetchReviews() {
  this.reviewService.getBookReviews(this.slug).subscribe({
    next: (res) => {
      this.reviews = res.data || [];
      this.calculateAverageRating();


      this.ratingStats.emit({
        average: this.averageRating,
        count: this.reviews.length
      });
    },
    error: () => {
      this.toastr.error('Error fetching reviews.');
    }
  });
  console.log("Fetched Reviews:", this.reviews);

}



  calculateAverageRating() {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = this.reviews.length ? sum / this.reviews.length : 0;
  }

  setReviewRating(star: number) {
    this.reviewForm.rating = star;
    this.showWarning = false;
  }

  submitReview() {
    if (!this.reviewForm.rating || !this.reviewText.trim()) {
      this.warningMessage = '⭐ Please give a rating and a comment before submitting!';
      this.showWarning = true;
      return;
    }

    const payload = {
      rating: this.reviewForm.rating,
      review: this.reviewText
    };

    if (this.isEditing && this.editIndex !== null) {
      this.reviewService.updateReview(this.slug, payload).subscribe({
        next: () => {
          this.toastr.success('Review updated!');
          this.fetchReviews();
          this.cancelReview();
        },
        error: () => this.toastr.error('Error updating review.')
      });
    } else {
      this.reviewService.submitReview(this.slug, payload).subscribe({
        next: () => {
          this.toastr.success('Review submitted!');
          this.fetchReviews();
          this.cancelReview();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'You may have already reviewed this book.');
        }
      });
    }
  }

  editReview(index: number) {
    const review = this.reviews[index];
    this.reviewForm.rating = review.rating;
    this.reviewText = review.review;
    this.isEditing = true;
    this.editIndex = index;
  }

  deleteReview(index: number) {
    this.reviewService.deleteReview(this.slug).subscribe({
      next: () => {
        this.toastr.success('Review deleted!');
        this.fetchReviews();
      },
      error: () => this.toastr.error('Error deleting review.')
    });
  }

  cancelReview() {
    this.reviewForm = { rating: 0 };
    this.reviewText = '';
    this.hoverRating = 0;
    this.showWarning = false;
    this.warningMessage = '';
    this.isEditing = false;
    this.editIndex = null;
  }
}

