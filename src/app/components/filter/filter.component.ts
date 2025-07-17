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
  subscription!: Subscription;

  @Output() sortedBooks = new EventEmitter<any[]>(); // optional, emit to parent

  filters = {
    genre: [
      'Business',
      'Entertainment',
      'Fiction',
      'Humor',
      'Literature',
      'Sugar Flakes',
    ],
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
    private sortService: SortService
  ) {}

  ngOnInit() {
    this.subscription = this.filterService.filters$.subscribe((filters) => {
      this.activeFilters = filters;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isChecked(label: string, value: string): boolean {
    return this.activeFilters.some(
      (f) => f.label === label && f.value === value
    );
  }

  toggleFilter(label: string, value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    checked
      ? this.filterService.addFilter({ label, value })
      : this.filterService.removeFilter({ label, value });
  }

  removeFilter(filter: Filter) {
    this.filterService.removeFilter(filter);
  }

  clearAllFilters() {
    this.filterService.clearFilters();
  }

  onSortChange(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value;
    this.selectedSort = sortValue;
    this.sortService.setSortOption(sortValue);

    this.sortService.getSortedBooks(sortValue).subscribe({
      next: (res) => {
        this.sortedBooks.emit(res.data);
        console.log(res.data);
      },
      error: (err) => {
        console.error('Failed to sort books:', err);
      },
    });
  }

  getPriceRange(priceRange: string): { min: number; max: number } | null {
    const matches = priceRange.match(/LE (\d+) - LE (\d+)/);
    if (matches && matches.length === 3) {
      return {
        min: parseInt(matches[1]),
        max: parseInt(matches[2]),
      };
    }
    return null;
  }
}
