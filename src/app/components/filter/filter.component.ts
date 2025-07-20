import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Filter,
  FilterService,
} from '../../services/filter/filter-state.service';
import { SortService } from '../../services/sort/sort.service';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnDestroy {
  activeFilters: Filter[] = [];
  selectedSort: string = '';
  filterSubscription!: Subscription;
  sortSubscription!: Subscription;
  isLoading: boolean = false; // Keep the variable but don't use it for loading display

  @Output() sortedBooks = new EventEmitter<{
    books: any[];
    totalPages?: number;
    currentPage?: number;
  }>(); // emit to parent with pagination info

  // Default filter options
  filters = {
    categories: [] as string[],
    price: [
      'LE 100 - LE 200',
      'LE 200 - LE 300',
      'LE 300 - LE 400',
      'LE 400 - LE 500',
      'LE 500 - LE 700',
    ],
    language: ['English', 'French', 'Arabic'],
  };

  constructor(
    private filterService: FilterService,
    private sortService: SortService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.filterSubscription = this.filterService.filters$.subscribe(
      (filters) => {
        this.activeFilters = filters;
        // Apply filters whenever they change
        this.applyFilters();
      }
    );

    this.sortSubscription = this.sortService.selectedSort$.subscribe(
      (sortOption) => {
        this.selectedSort = sortOption;
      }
    );

    // Load categories from the API
    this.loadCategories();
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
  }

  /**
   * Load categories from the API
   */
  loadCategories() {
    // Keep the isLoading variable for other logic but don't use it for UI
    this.isLoading = true;
    this.categoryService.getAllCategoriesWithoutPagination().subscribe({
      next: (categories) => {
        // Extract category names from the response and sort alphabetically
        this.filters.categories = categories
          .map((cat) => cat.name)
          .sort((a, b) => a.localeCompare(b));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Failed to load categories');
        this.isLoading = false;
      },
    });
  }

  isChecked(label: string, value: string): boolean {
    // Normalize the label to match what's used in the filter service
    let filterLabel = label;
    if (label === 'Category') {
      filterLabel = 'genre';
    } else if (label === 'Price') {
      filterLabel = 'price';
    } else if (label === 'Language') {
      filterLabel = 'language';
    }

    // Convert to lowercase for case-insensitive comparison
    filterLabel = filterLabel.toLowerCase();

    // For price filters, we need to handle the format differences
    if (label === 'Price') {
      return this.activeFilters.some((f) => {
        return f.label.toLowerCase() === 'price' && f.value === value;
      });
    }

    // For other filters
    return this.activeFilters.some((f) => {
      return f.label.toLowerCase() === filterLabel && f.value === value;
    });
  }

  toggleFilter(label: string, value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    // Map labels to match the backend API expectations
    let filterLabel = label;
    if (label === 'Category') {
      filterLabel = 'genre';
    } else if (label === 'Price') {
      filterLabel = 'price';
    } else if (label === 'Language') {
      filterLabel = 'language';
    }

    if (checked) {
      this.filterService.addFilter({ label: filterLabel, value });
    } else {
      this.filterService.removeFilter({ label: filterLabel, value });
    }

    // Explicitly apply filters after toggling (start at page 1 when changing filters)
    this.applySortAndFilters(1);
  }

  onSortChange(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value;
    this.selectedSort = sortValue;
    this.sortService.setSortOption(sortValue);

    // Apply sort (start at page 1 when changing sort)
    this.applySortAndFilters(1);
  }

  resetSort() {
    this.selectedSort = '';
    this.sortService.setSortOption('');
    this.applySortAndFilters(1);
  }

  /**
   * Removes all active filters
   */
  clearAllFilters() {
    this.filterService.clearFilters();
    // Explicitly apply filters after clearing (start at page 1)
    this.applySortAndFilters(1);
  }

  removeFilter(filter: Filter) {
    this.filterService.removeFilter(filter);
    // Explicitly apply filters after removing (maintain current page)
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || '1', 10);
    this.applySortAndFilters(currentPage);
  }

  /**
   * Apply both sort and filters
   */
  private applySortAndFilters(page: number = 1) {
    // Keep the isLoading variable for other logic but don't use it for UI
    this.isLoading = true;

    // Always use the combined endpoint regardless of whether we have both filters and sort
    this.filterService
      .getSortedAndFilteredBooks(
        this.selectedSort,
        this.activeFilters,
        page // Pass the current page
      )
      .subscribe({
        next: (res) => {
          // Emit both the data and pagination information
          this.sortedBooks.emit({
            books: res.data,
            totalPages: res.totalPages || 1,
            currentPage: page, // Use the provided page number
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to apply sort and filters:', err);
          this.toastr.error('Failed to apply sort and filters');
          this.isLoading = false;
        },
      });
  }

  // Apply filters
  private applyFilters() {
    // Get the current page from the URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page') || '1', 10);
    this.applySortAndFilters(currentPage);
  }
}
