import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ToggleFilterMenuComponent } from '../../components/toggle-filter-menu/toggle-filter-menu.component';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FilterComponent,
    ToggleFilterMenuComponent,
  ],
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.css'],
})
export class BooksPageComponent implements OnInit {
  products: Book[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(page: number = 1): void {
    this.isLoading = true;
    this.booksService.getBooks(page).subscribe({
      next: (data) => {
        console.log('📦 Received books data:', data);
        this.products = data.books;
        this.totalPages = data.totalPages;
        this.currentPage = page;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books', err);
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadBooks(page);
    }
  }
}
