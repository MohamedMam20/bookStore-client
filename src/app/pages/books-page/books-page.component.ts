import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books/books.service';
import { ToggleFilterMenuComponent } from '../../components/toggle-filter-menu/toggle-filter-menu.component';
import { ToastrService } from 'ngx-toastr';
import {
  FilterService,
  Filter,
} from '../../services/filter/filter-state.service';
import { SortService } from '../../services/sort/sort.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  isLoading = true; // Keep the variable but load data immediately
  currentPage = 1;
  totalPages = 1;
  isFilteredResults = false;
  isFirstLoad = true;

  constructor(
    private booksService: BooksService,
    private toastr: ToastrService,
    private filterService: FilterService,
    private sortService: SortService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Listen for navigation events to detect when user navigates directly to /shop
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Reset firstLoad flag if user navigates to /shop with no params
        if (event.url === '/shop') {
          this.isFirstLoad = true;
        }
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Check if this is the initial navigation to /shop with no query params
      const hasQueryParams = Object.keys(params).length > 0;

      const filters: Filter[] = [];

      // Reconstruct filters from query parameters
      if (params['genre']) {
        const genres = Array.isArray(params['genre'])
          ? params['genre']
          : [params['genre']];
        genres.forEach((g) => filters.push({ label: 'genre', value: g }));
      }

      if (params['language']) {
        const langs = Array.isArray(params['language'])
          ? params['language']
          : [params['language']];
        langs.forEach((l) => filters.push({ label: 'language', value: l }));
      }

      // Handle both price formats: either as a single 'price' parameter or as 'priceMin'/'priceMax'
      if (params['price']) {
        filters.push({ label: 'price', value: params['price'] });
      } else if (params['priceMin'] && params['priceMax']) {
        filters.push({
          label: 'price',
          value: `LE ${params['priceMin']} - LE ${params['priceMax']}`,
        });
      }

      const sortOption = params['sort'] || '';
      const page = Number(params['page']) || 1;

      // Apply state
      this.filterService.clearFilters();
      filters.forEach((f) => this.filterService.addFilter(f));
      this.sortService.setSortOption(sortOption);

      // Only apply filters with pagination if there are query parameters
      // Otherwise, just load books without changing the URL
      if (hasQueryParams) {
        this.applyFiltersWithPagination(page);
        // No longer first load if we have query params
        this.isFirstLoad = false;
      } else {
        this.loadBooks(page);
      }
    });
  }

  loadBooks(page: number = 1): void {
    // Keep the isLoading variable for other logic
    this.isLoading = true;
    this.isFilteredResults = false;

    this.booksService.getBooks(page).subscribe({
      next: (data) => {
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
      // First page navigation should happen without query params
      if (page === 1 && !this.isFilteredResults) {
        this.router.navigate(['/shop']);
        this.loadBooks(page);
        return;
      }

      // For pages other than first, add only the page parameter
      if (!this.isFilteredResults) {
        // Simple pagination with no filters - just use page parameter
        this.router.navigate(['/shop'], {
          queryParams: { page },
        });
        this.loadBooks(page);
        return;
      }

      // For filtered results, keep all existing parameters and update page
      const queryParams = { ...this.route.snapshot.queryParams, page };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge',
      });

      this.applyFiltersWithPagination(page);
    }
  }

  applyFiltersWithPagination(page: number): void {
    // Keep the isLoading variable for other logic
    this.isLoading = true;
    const filters = this.filterService.filters;

    let sortOption = '';
    this.sortService.selectedSort$
      .subscribe((value) => {
        sortOption = value;
      })
      .unsubscribe();

    // Call the API
    this.filterService
      .getSortedAndFilteredBooks(sortOption, filters, page)
      .subscribe({
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
        },
      });
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

    // Skip URL update on first load
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }

    // Update URL with page, filters, and sort
    const filters = this.filterService.filters;
    const queryParams: any = { page: this.currentPage };

    // Add limit parameter only when we have filters or sorting
    if (filters.length > 0) {
      queryParams.limit = 6;

      filters.forEach((filter) => {
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
    this.sortService.selectedSort$
      .subscribe((sort) => {
        sortOption = sort;
      })
      .unsubscribe();

    if (sortOption) {
      queryParams.sort = sortOption;
      // Ensure limit is added when sorting
      if (!queryParams.limit) {
        queryParams.limit = 6;
      }
    }

    // Replace all query parameters instead of merging
    this.router.navigate(['/shop'], {
      queryParams,
      replaceUrl: true,
    });
  }
}
