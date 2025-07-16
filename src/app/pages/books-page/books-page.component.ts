import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ToggleFilterMenuComponent } from '../../components/toggle-filter-menu/toggle-filter-menu.component';
import {
  FilterService,
  Filter,
} from '../../services/filter/filter-state.service';
import { SortService } from '../../services/sort/sort.service';
import { Subscription, combineLatest } from 'rxjs';

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
export class BooksPageComponent implements OnInit, OnDestroy {
  products: Book[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  private subscriptions: Subscription = new Subscription();
  private currentFilters: Filter[] = [];
  private currentSort: string = '';

  constructor(
    private booksService: BooksService,
    private filterService: FilterService,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    // Subscribe to filter and sort changes
    this.subscriptions.add(
      combineLatest([
        this.filterService.filters$,
        this.sortService.selectedSort$,
      ]).subscribe(([filters, sort]) => {
        this.currentFilters = filters;
        this.currentSort = sort;
        this.currentPage = 1; // Reset to first page when filters change
        this.loadBooks(this.currentPage, this.currentSort, this.currentFilters);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadBooks(page: number = 1, sort?: string, filters?: Filter[]): void {
    this.isLoading = true;
    this.booksService.getBooks(page, 6, sort, filters).subscribe({
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
      this.currentPage = page;
      this.loadBooks(page, this.currentSort, this.currentFilters);
    }
  }

  onSortedBooks(sortedList: Book[]): void {
    this.products = sortedList;
    this.totalPages = 1;
    this.currentPage = 1;
  }
}
