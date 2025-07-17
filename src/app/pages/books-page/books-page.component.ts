import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ToggleFilterMenuComponent } from '../../components/toggle-filter-menu/toggle-filter-menu.component';
import { ToastrService } from 'ngx-toastr';
import { FilterService, Filter } from '../../services/filter/filter-state.service';
import { SortService } from '../../services/sort/sort.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  isFilteredResults = false;

  constructor(
    private booksService: BooksService,
    private toastr: ToastrService,
    private filterService: FilterService,
    private sortService: SortService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filters: Filter[] = [];
  
      // Reconstruct filters from query parameters
      if (params['genre']) {
        const genres = Array.isArray(params['genre']) ? params['genre'] : [params['genre']];
        genres.forEach(g => filters.push({ label: 'genre', value: g }));
      }
  
      if (params['language']) {
        const langs = Array.isArray(params['language']) ? params['language'] : [params['language']];
        langs.forEach(l => filters.push({ label: 'language', value: l }));
      }
  
      // Handle both price formats: either as a single 'price' parameter or as 'priceMin'/'priceMax'
      if (params['price']) {
        filters.push({ label: 'price', value: params['price'] });
      } else if (params['priceMin'] && params['priceMax']) {
        filters.push({ label: 'price', value: `LE ${params['priceMin']} - LE ${params['priceMax']}` });
      }
  
      const sortOption = params['sort'] || '';
      const page = Number(params['page']) || 1;
  
      // Apply state
      this.filterService.clearFilters();
      filters.forEach(f => this.filterService.addFilter(f));
      this.sortService.setSortOption(sortOption);
  
      this.applyFiltersWithPagination(page);
    });
  }

  loadBooks(page: number = 1): void {
    this.isLoading = true;
    this.isFilteredResults = false;

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
        this.toastr.error('Failed to load books');
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      // Update the URL with the new page number
      const queryParams = { ...this.route.snapshot.queryParams, page };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge'
      });
      
      // If we have filtered results, apply the filters with the new page
      if (this.isFilteredResults) {
        this.applyFiltersWithPagination(page);
      } else {
        this.loadBooks(page);
      }
    }
  }

  applyFiltersWithPagination(page: number): void {
    this.isLoading = true;
    const filters = this.filterService.filters;

    let sortOption = '';
    this.sortService.selectedSort$.subscribe(value => {
      sortOption = value;
    }).unsubscribe();

    // Call the API
    this.filterService.getSortedAndFilteredBooks(sortOption, filters, page).subscribe({
      next: (data) => {
        this.products = data.data;
        this.totalPages = data.totalPages || 1;
        this.currentPage = page;
        this.isLoading = false;
        this.isFilteredResults = true;
      },
      error: (err) => {
        console.error('Error applying filters with pagination', err);
        this.toastr.error('Failed to apply filters');
        this.isLoading = false;
      }
    });
    // Remove this line as it's causing the error
    // this.applySortAndFilters(1);
  }

  onSortedBooks(result: any): void {
    if (!result.books || result.books.length === 0) {
      this.loadBooks();
      return;
    }

    this.products = result.books;
    this.isFilteredResults = true;

    this.totalPages = result.totalPages || 1;
    this.currentPage = result.currentPage || 1;

    // Update URL with page, filters, and sort
    const filters = this.filterService.filters;
    const queryParams: any = { page: this.currentPage, limit: 6 };

    // Only add filter parameters if there are active filters
    if (filters.length > 0) {
      filters.forEach(filter => {
        const key = filter.label.toLowerCase();
        
        // Special handling for price filters
        if (key === 'price') {
          // Add the price as a single parameter for UI state tracking
          queryParams.price = filter.value;
        } else {
          // Handle other filters normally
          if (queryParams[key]) {
            queryParams[key] = Array.isArray(queryParams[key])
              ? [...queryParams[key], filter.value]
              : [queryParams[key], filter.value];
          } else {
            queryParams[key] = filter.value;
          }
        }
      });
    }

    // Only add sort parameter if there is an active sort option
    let sortOption = '';
    this.sortService.selectedSort$.subscribe(sort => {
      sortOption = sort;
    }).unsubscribe();
    
    if (sortOption) {
      queryParams.sort = sortOption;
    }

    // Replace all query parameters instead of merging
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '' // Use empty string to replace all parameters
    });
  }
}
