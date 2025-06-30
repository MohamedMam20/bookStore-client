import { Component, OnInit, HostListener } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';

import { BooksService } from '../../services/books/books.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FilterComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  products: Book[] = [];
  isLoading = false;
  hasMore = true;
  lastId?: string;

  constructor(private productService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    this.productService.getBooks(this.lastId).subscribe({
      next: (data) => {
        if (data.length) {
          this.products = [...this.products, ...data];
          this.lastId = data[data.length - 1]._id;
        } else {
          this.hasMore = false;
        }

        // Artificial delay of 1 second
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to fetch products', error);
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 200;

    if (scrollPosition >= threshold) {
      this.loadBooks();
    }
  }
}
