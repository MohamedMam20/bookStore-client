
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProductDetailsComponent {
  quantity: number = 1;
  viewsCount: number = 0;
  showReviews: boolean = false;
  reviewText: string = '';
  hoverRating: number = 0;
  showWarning: boolean = false;
  averageRating: number = 4;

  reviewForm = {
    name: '',
    email: '',
    rating: 0
  };
  isEditing: boolean = false;
  editIndex: number | null = null;

  submittedReviews: any[] = [
    // { name: 'Sara', email: 'sara@example.com', rating: 5, text: 'Amazing book! Very helpful and inspiring.' },
    // { name: 'Omar', email: 'omar@example.com', rating: 4, text: 'Good read, but delivery was a bit late.' },
    // { name: 'Mona', email: 'mona@example.com', rating: 5, text: 'Excellent quality and great story.' }
  ];

  product = {
    title: 'Visit in the North',
    description: `About Author: This book's author, John, is one of the most popular writers in American history.
    He was California-born but attended school in New York. He attended Harvard University...`,
    price: 514.60,
    originalPrice: 1086.50,
    vendor: 'James Dylan',
    type: 'Business',
    formats: [
      { name: 'Audible Audiobook', selected: true },
      { name: 'Paperback', selected: false },
      { name: 'Hardcover', selected: false }
    ],
    languages: [
      { name: 'Korean', selected: true },
      { name: 'English', selected: false },
      { name: 'Spanish', selected: false }
    ],
    publicationDate: new Date('2022-11-23'),
    stock: 12,
    image: 'https://bookly-theme.myshopify.com/cdn/shop/products/shop-new-57.jpg?v=1587119315',
    thumbnails: [
      'https://bookly-theme.myshopify.com/cdn/shop/products/shop-new-57.jpg?v=1587119315',
      'https://bookly-theme.myshopify.com/cdn/shop/products/shop-new-57.jpg?v=1587119315',
      'https://bookly-theme.myshopify.com/cdn/shop/products/shop-new-57.jpg?v=1587119315'
    ]
  };
 warningMessage: string = '';


  ngOnInit() {
    this.viewsCount = Math.floor(Math.random() * 200) + 50;
  }

  selectFormat(format: any) {
    this.product.formats.forEach(f => f.selected = false);
    format.selected = true;
  }

  selectLanguage(lang: any) {
    this.product.languages.forEach(l => l.selected = false);
    lang.selected = true;
  }

  increment() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setReviewRating(star: number) {
    this.reviewForm.rating = star;
    this.showWarning = false;
  }
submitReview() {
  if (!this.reviewForm.rating || !this.reviewText.trim()) {
    this.warningMessage = '⭐ Please give a rating and a comment before submitting!';
    return;
  }

  const newReview = {
    name: '',
    email: '',
    rating: this.reviewForm.rating,
    text: this.reviewText.trim(),
    date: new Date().toLocaleDateString('en-US')  // التاريخ
  };

  if (this.isEditing && this.editIndex !== null) {
    this.submittedReviews[this.editIndex] = newReview;
  } else {
    this.submittedReviews.push(newReview);
  }

  this.cancelReview();
}

editReview(index: number) {
  const review = this.submittedReviews[index];
  this.reviewForm.rating = review.rating;
  this.reviewText = review.text;
  this.isEditing = true;
  this.editIndex = index;
  this.showReviews = true;
  this.warningMessage = '';
}

deleteReview(index: number) {
  this.submittedReviews.splice(index, 1);
}


cancelReview() {
  this.showReviews = false;
  this.reviewForm = { name: '', email: '', rating: 0 };
  this.reviewText = '';
  this.hoverRating = 0;
  this.showWarning = false;
  this.warningMessage = '';
  this.isEditing = false;
  this.editIndex = null;
}

}
